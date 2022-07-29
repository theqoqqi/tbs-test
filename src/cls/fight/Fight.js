import Arena from '../arena/Arena.js';
import EventBus from '../events/EventBus.js';
import PassabilityType from '../enums/PassabilityType.js';
import Vector from '../util/Vector.js';
import ArenaMove from '../arena/ArenaMove.js';
import Formulas from '../Formulas.js';
import AbilitySlot from '../enums/AbilitySlot.js';
import Gamecycle from './Gamecycle.js';
import MoveExecutor from './MoveExecutor.js';
import MoveInfo from '../util/info/MoveInfo.js';
import PotentialHitInfo from '../util/info/PotentialHitInfo.js';
import ExactHitInfo from '../util/info/ExactHitInfo.js';
import Pawn from '../pawns/Pawn.js';
import Team from '../pawns/Team.js';
import Effect from '../pawns/Effect.js';
import PawnEffectAddedEvent from '../events/types/PawnEffectAddedEvent.js';
import PawnEffectRemovedEvent from '../events/types/PawnEffectRemovedEvent.js';
import PawnAddedEvent from '../events/types/PawnAddedEvent.js';
import PawnFeatureAddedEvent from '../events/types/PawnFeatureAddedEvent.js';
import PawnAbilityAddedEvent from '../events/types/PawnAbilityAddedEvent.js';
import PawnRemovedEvent from '../events/types/PawnRemovedEvent.js';
import PawnFeatureRemovedEvent from '../events/types/PawnFeatureRemovedEvent.js';
import PawnAbilityRemovedEvent from '../events/types/PawnAbilityRemovedEvent.js';
import MovementType from '../enums/MovementType.js';
import lodash from 'lodash';
import Constants from '../Constants.js';

export default class Fight {

    #gameContext;

    #eventBus;

    #gamecycle;

    #moveExecutor;

    #armies;

    #armySlotsToPawns;

    constructor(gameContext, arenaData, armies) {
        this.arena = new Arena();
        this.#gameContext = gameContext;
        this.#eventBus = new EventBus();
        this.#gamecycle = new Gamecycle(this, this.#eventBus);
        this.#moveExecutor = new MoveExecutor(this, this.#eventBus);
        this.#armies = armies;

        this.#bindGlobalListeners();
        this.#initArena(arenaData);
        this.#initArmies(armies);
        this.#initNeutrals();
    }

    #bindGlobalListeners() {
        this.#eventBus.addGlobalListener((eventType, event) => {
            let effectEvents = this.arena.getAllPawns()
                .flatMap(pawn => pawn.effects)
                .flatMap(Fight.#getEvents);

            let featureEvents = this.arena.getAllPawns()
                .flatMap(pawn => pawn.features)
                .flatMap(Fight.#getEvents);

            let abilityEvents = this.arena.getAllPawns()
                .flatMap(pawn => pawn.abilities)
                .flatMap(Fight.#getEvents);

            Fight.#executeScriptedCallbacks(effectEvents, eventType, event);
            Fight.#executeScriptedCallbacks(featureEvents, eventType, event);
            Fight.#executeScriptedCallbacks(abilityEvents, eventType, event);
        });
    }

    #initArena(arenaData) {
        for (const cellData of arenaData.cells) {
            let cell = this.addCell(...cellData['position']);

            if (cellData.passability) {
                let passability = cellData.passability;

                if (Array.isArray(passability)) {
                    passability = lodash.sample(passability);
                }

                cell.passability = PassabilityType.enumValueOf(passability);
            }
        }

        this.squadPositions = arenaData.squadPositions.map(positions => {
            return positions.map(Vector.fromArray);
        });

        this.structurePositions = arenaData.structurePositions.map(Vector.fromArray);
        this.structures = arenaData.structures;
    }

    #initArmies(armies) {
        let teams = armies.map(army => army.team);
        let squadPositionsByTeams = new Map(this.squadPositions.map(positions => {
            let team = teams.shift();
            positions = positions.slice();

            return [ team, positions ];
        }));

        let getNextPosition = team => {
            let positions = squadPositionsByTeams.get(team);

            return positions.shift();
        };

        this.#armySlotsToPawns = new Map();

        for (let army of armies) {
            for (const squad of army.squads) {
                let team = army.team;
                let position = getNextPosition(team);

                let pawn = this.createPawn(position, squad.unitName, {
                    team,
                    ...squad.options
                });

                this.#armySlotsToPawns.set(squad, pawn);
            }
        }
    }

    #initNeutrals() {
        let structurePositions = lodash.shuffle(this.structurePositions);

        for (let i = 0; i < this.structures; i++) {
            let structureName = lodash.sample(['iceShard', 'chest']); // TODO: избавиться от хардкода
            let position = structurePositions.pop();

            this.createPawn(position, structureName, {
                team: Team.NEUTRAL,
                stackSize: 1,
            });
        }
    }

    static #getEvents(effect) {
        return effect.getEvents?.() ?? [];
    }

    static #executeScriptedCallbacks(eventDescriptors, ofType, event) {
        for (const [type, callback] of eventDescriptors) {
            if (type === ofType) {
                callback(event);
            }
        }
    }



    //region События

    on(eventType, callback, context = undefined) {
        this.#eventBus.on(eventType, callback, context);
    }

    off(eventType, callback) {
        this.#eventBus.off(eventType, callback);
    }

    addGlobalListener(listener) {
        this.#eventBus.addGlobalListener(listener);
    }

    removeGlobalListener(listener) {
        this.#eventBus.removeGlobalListener(listener);
    }

    //endregion



    //region Игровой цикл

    start() {
        this.#gamecycle.start();
    }

    #nextTurnIfNoActionPoints(pawn) {
        if (pawn.currentActionPoints <= 0) {
            this.#nextTurn();
        }
    }

    #nextTurn() {
        this.#gamecycle.nextTurn();
    }

    get currentPawn() {
        return this.#gamecycle.currentPawn;
    }

    //endregion



    //region Информация о ходах

    getAvailableMoves(forPawn, ability) {
        let moves = [];
        let movementMoves = [];

        if (!ability || ability.slot === AbilitySlot.REGULAR) {
            movementMoves = this.#getMovementMoves(forPawn);

            moves = moves.concat(movementMoves);
        }

        if (ability) {
            let abilityMoves = Fight.#getAbilityMoves(ability, movementMoves);

            moves = moves.concat(abilityMoves);
        }

        let useMoves = this.#getUseMoves(forPawn, movementMoves);

        moves = moves.concat(useMoves);

        return moves;
    }

    #getMovementMoves(forPawn) {
        if (forPawn.movementType === MovementType.IMMOBILE) {
            return [];
        }

        let searchResults = this.arena.getAvailableCells(forPawn, forPawn.currentActionPoints);

        return searchResults.map(searchResult => {
            let {cell, distance} = searchResult;

            return new ArenaMove({
                pawn: forPawn,
                targetCell: cell,
                actionPoints: distance,
                isRanged: false,
            });
        });
    }

    #getUseMoves(forPawn, movementMoves) {
        if (forPawn.movementType === MovementType.IMMOBILE) {
            return [];
        }

        return this.arena.getAllPawns()
            .filter(pawn => pawn.isUsable)
            .map(targetPawn => {
                if (targetPawn.isItem) {
                    return null;
                }

                return this.tryGetMoveForMeleeAction(forPawn, targetPawn, movementMoves);
            })
            .filter(move => move !== null);
    }

    tryGetMoveForMeleeAction(forPawn, targetPawn, movementMoves) {
        let cell = this.arena.getCell(targetPawn.position);
        let actionPoints = this.getActionPointsForMeleeAction(forPawn, targetPawn, movementMoves);

        if (actionPoints === -1) {
            return null;
        }

        return new ArenaMove({
            pawn: forPawn,
            targetCell: cell,
            actionPoints,
            isRanged: false,
        });
    }

    getActionPointsForMeleeAction(forPawn, targetPawn, movementMoves) {
        let neighborPositions = this.arena.getNeighborPositions(targetPawn.position);
        let isNearby = neighborPositions.some(position => position.equals(forPawn.position));
        let actionPoints = 1;

        if (!isNearby) {
            let movementMove = Fight.getAnyMovementMove(forPawn, movementMoves, neighborPositions);

            if (!movementMove) {
                return -1;
            }

            actionPoints += movementMove.actionPoints;
        }

        if (forPawn.currentActionPoints < actionPoints) {
            return -1;
        }

        return actionPoints;
    }

    static #getAbilityMoves(ability, movementMoves) {
        if (!ability.targetCollector) {
            return [];
        }

        return ability.targetCollector({
            movementMoves,
        });
    }

    static getAnyMovementMove(forPawn, movementMoves, toPositions) {
        if (toPositions.length === 0) {
            return null;
        }

        let sorted = toPositions
            .map(position => {
                return position.equals(forPawn.position)
                    || movementMoves.find(move => position.equals(move.targetCell.position));
            })
            .sort((a, b) => {
                return a.actionPoints - b.actionPoints;
            })
            .filter(move => move !== undefined);

        return sorted[0];
    };

    getMoveInfo(attackerPawn, targetPawn, ability) {
        if (targetPawn.isUsable) {
            return new MoveInfo({
                actionInfos: [], // TODO: Действие "Открыть сундук"?
            });
        }

        if (!ability.damageRanges) {
            return new MoveInfo({
                actionInfos: [], // TODO: Что вообще делает способность?
            });
        }

        return new MoveInfo({
            actionInfos: [
                this.getEstimatedDamage(attackerPawn, targetPawn, ability),
            ],
        });
    }

    getEstimatedDamage(attacker, victim, ability) {
        let damageRanges = this.getEstimatedDamageRanges(attacker, victim, ability);
        let minDamage = damageRanges.combinedMin;
        let maxDamage = damageRanges.combinedMax;
        let minKills = victim.getKillCount(minDamage);
        let maxKills = victim.getKillCount(maxDamage);
        let willHitback = this.moveExecutor.shouldHitback(attacker, victim, ability);
        let targetName = victim.unitName;

        return new PotentialHitInfo({
            targetName,
            minDamage,
            maxDamage,
            minKills,
            maxKills,
            willHitback,
        });
    }

    getRandomHitInfo(attacker, victim, ability) {
        let damageRanges = this.getEstimatedDamageRanges(attacker, victim, ability);
        let isCriticalHit = ability.slot === AbilitySlot.REGULAR && Math.random() < attacker.criticalHitChance;
        let criticalHitMultiplier = attacker.criticalHitMultiplier;

        return this.getRandomHitInfoForDamageRanges(victim, damageRanges, isCriticalHit, criticalHitMultiplier);
    }

    getRandomHitInfoForDamageRanges(victim, damageRanges, isCriticalHit = false, criticalHitMultiplier = 1) {
        let damage = this.getDamage(damageRanges, isCriticalHit, criticalHitMultiplier);

        return this.createHitInfo(victim, damage, isCriticalHit);
    }

    createHitInfo(victim, damage, isCriticalHit) {
        damage = Math.round(damage); // TODO: Должно ли это происходить здесь?

        let kills = victim.getKillCount(damage);

        return new ExactHitInfo({
            kills,
            damage,
            isCriticalHit,
        });
    }

    getDamage(damageRanges, isCriticalHit = false, criticalHitMultiplier = 1) {
        if (isCriticalHit) {
            return Math.floor(damageRanges.combinedMax * criticalHitMultiplier);
        } else {
            return this.randomInt(damageRanges.combinedMin, damageRanges.combinedMax);
        }
    }

    getEstimatedDamageRanges(attacker, victim, ability) {
        return Formulas.calculateDamageRange(attacker, victim, ability);
    }

    //endregion



    //region Применение ходов

    makeMove(move, path, ability) {
        let promise = this.#moveExecutor.makeMove(move, path, ability);

        this.#moveExecutor.waitForActions()
            .then(() => this.#nextTurnIfNoActionPoints(move.pawn));

        return promise;
    }

    makeTeleportMove(move, ability) {
        let promise = this.#moveExecutor.makeTeleportMove(move, ability);

        this.#moveExecutor.waitForActions()
            .then(() => this.#nextTurnIfNoActionPoints(move.pawn));

        return promise;
    }

    makeWaitMove(pawn) {
        let promise = this.#gamecycle.postponeMove(pawn);

        this.#moveExecutor.waitForActions()
            .then(() => this.#nextTurn());

        return promise;
    }

    makeDefenceMove(pawn) {
        let promise = this.#moveExecutor.makeDefenceMove(pawn);

        this.#moveExecutor.waitForActions()
            .then(() => this.#nextTurn());

        return promise;
    }

    applyAbility(pawn, ability) {
        return this.#moveExecutor.applyAbility(pawn, ability);
    }

    makeDamageMove({attacker, victim, ability, hitInfo}) {
        return this.#moveExecutor.makeDamageMove({attacker, victim, ability, hitInfo});
    }

    getPositionInTurnOrder(pawn) {
        if (pawn === this.currentPawn) {
            return 1;
        }

        let index = this.#gamecycle.getTurnIndex(pawn);

        return index === -1 ? null : 2 + index; // start from 2
    }

    //endregion



    //region Эффекты

    ensurePawnEffect(pawn, effectName, options) {
        let effect = pawn.getEffectByName(effectName);

        if (effect) {
            effect.ensureDuration(options.duration);
        } else {
            this.addPawnEffect(pawn, effectName, options);
        }
    }

    addPawnEffect(pawn, effectName, options) {
        let effectProps = this.#gameContext.getEffectProps(effectName);
        let effect = new Effect(pawn, effectProps, options);

        pawn.addEffect(effect);

        this.#eventBus.dispatch(PawnEffectAddedEvent, {
            effect,
        });
    }

    removePawnEffect(pawn, effect) {
        pawn.removeEffect(effect);

        this.#eventBus.dispatch(PawnEffectRemovedEvent, {
            effect,
        });
    }

    removePawnEffectByName(pawn, effectName) {
        let effect = pawn.getEffectByName(effectName);

        this.removePawnEffect(pawn, effect);
    }

    //endregion



    //region Способности

    getRegularAbility(forPawn) {
        return this.getAbilityInSlot(forPawn, AbilitySlot.REGULAR);
    }

    getReadyAbilities(forPawn, slots = null) {
        slots ??= AbilitySlot.enumValues;

        return slots.map(slot => this.getAbilityInSlot(forPawn, slot))
            .filter(ability => ability);
    }

    getAbilityInSlot(forPawn, abilitySlot) {
        return forPawn.abilities
            .filter(a => a.slot === abilitySlot)
            .find(ability => {
                if (ability.disabledIfNearEnemy) {
                    if (this.hasEnemiesNearby(forPawn)) {
                        return false;
                    }
                }

                return true;
            });
    }

    isAbilityReady(pawn, ability) {
        return !ability.isReloading
            && (!ability.usesCharges || ability.hasCharges)
            && !this.isAbilityMuted(pawn, ability);
    }

    isAbilityMuted(pawn, ability) {
        return ability.mutedIfNearEnemy && this.hasEnemiesNearby(pawn);
    }

    hasAbilityInSlot(pawn, abilitySlot) {
        return !!pawn.abilities.find(a => a.slot === abilitySlot)
    }

    //endregion



    //region Управление ареной

    addCell(x, y) {
        return this.arena.addCell(Vector.from(x, y));
    }

    createPawn(position, unitName, options) {
        let pawn = this.#newPawn(position, unitName, options);

        this.arena.addPawn(pawn);
        this.#addPawn(pawn);

        return pawn;
    }

    removePawn(pawn) {
        this.arena.removePawn(pawn);
        this.#removePawn(pawn);
    }

    createCorpse(position, unitName) {
        let pawn = this.#newPawn(position, Constants.CORPSE_UNIT_NAME, {
            team: Team.NEUTRAL,
            stackSize: 1,
        });

        this.arena.setCorpse(position, pawn, unitName);
        this.#addPawn(pawn);

        return pawn;
    }

    removeCorpse(pawn) {
        this.arena.removeCorpse(pawn);
        this.#removePawn(pawn);
    }

    #newPawn(position, unitName, options) {
        let props = this.#gameContext.getPawnProps(unitName);
        let defaultOptions = this.#gameContext.getPawnOptions(unitName);
        let allOptions = Object.assign({}, defaultOptions, options);
        let pawn = new Pawn(this, unitName, props, allOptions);

        pawn.position = position;

        return pawn;
    }

    #addPawn(pawn) {
        this.#gamecycle.addPawn(pawn, false);

        this.#eventBus.dispatch(PawnAddedEvent, { pawn });

        for (const feature of pawn.features) {
            this.#eventBus.dispatch(PawnFeatureAddedEvent, { feature });
        }

        for (const ability of pawn.abilities) {
            this.#eventBus.dispatch(PawnAbilityAddedEvent, { ability });
        }
    }

    #removePawn(pawn) {
        this.#gamecycle.removePawn(pawn);

        this.#eventBus.dispatch(PawnRemovedEvent, { pawn });

        console.log('REMOVE:', pawn)
        for (const feature of pawn.features) {
            this.#eventBus.dispatch(PawnFeatureRemovedEvent, { feature });
        }

        for (const ability of pawn.abilities) {
            this.#eventBus.dispatch(PawnAbilityRemovedEvent, { ability });
        }
    }

    //endregion



    //region Прочее

    calculateSummary() {
        let armies = this.#armies.map(army => this.calculateSummaryForArmy(army));

        return {
            winner: this.#gamecycle.winner,
            armies,
        };
    }

    calculateSummaryForArmy(army) {
        let squads = army.squads.map(squad => {
            let pawn = this.#armySlotsToPawns.get(squad);
            let unitName = pawn.unitName;
            let deaths = Math.max(0, squad.options.stackSize - pawn.stackSize);

            return {
                unitName,
                deaths,
            }
        });

        return {
            squads,
        };
    }

    randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    hasEnemiesNearby(forPawn) {
        let neighborPositions = this.arena.getNeighborPositions(forPawn.position);

        return neighborPositions.some(position => {
            let otherPawn = this.arena.getSquadOrStructure(position);

            return otherPawn && this.isOpponents(forPawn, otherPawn);
        });
    }

    isAllies(pawnA, pawnB) {
        return this.isAlliedTeams(pawnA.team, pawnB.team);
    }

    isOpponents(pawnA, pawnB) {
        return this.isOpponentTeams(pawnA.team, pawnB.team);
    }

    isAlliedTeams(teamA, teamB) {
        return teamA === teamB;
    }

    isOpponentTeams(teamA, teamB) {
        return teamA !== teamB;
    }

    get moveExecutor() {
        return this.#moveExecutor;
    }

    //endregion
}