
const Parser = require('./Parser.js');
const AtomConverter = require('./AtomConverter.js');
const fs = require('fs');
const mkdirp = require('mkdirp');
const getDirName = require('path').dirname;

let parseMap = {
    demon: [
        'imp',
        'imp2',
        'cerberus',
        'demoness',
        'demon',
        'demon2',
        'archdemon',
    ],
    dwarf: [
        'miner',
        'dwarf',
        'droideka',
        'droideka_guard',
        'miner2',
        'alchemist',
        'cannoner',
        'ingeneer',
        'giant',
    ],
    orc: [
        'goblin',
        'goblin2',
        'orc',
        'catapult',
        'goblin_shaman',
        'orc_hunter',
        'orc2',
        'shaman',
        'shaman_blood',
        'ogre',
        'ogre_chieftain',
    ],
    neutral: [
        'thorn',
        'thorn_warrior',
        'dragonfly_lake',
        'dragonfly_fire',
        'devilfish',
        'spider',
        'spider_venom',
        'hyena',
        'pirat',
        'snake_green',
        'snake',
        'spider_fire',
        'barbarian',
        'barbarian2',
        'graywolf',
        'pirat2',
        'snake_royal',
        'bear',
        'bear2',
        'griffin',
        'beholder',
        'griffin_spirit',
        'bear_white',
        'beholder2',
        'kingthorn',
        'assassin',
        'demonologist',
        'griffin2',
        'cyclop',
        'troll',
        'greendragon',
        'reddragon',
        'blackdragon',
    ],
    elf: [
        'sprite_lake',
        'sprite',
        'dryad',
        'elf',
        'werewolf',
        'wolf',
        'druid',
        'satyr',
        'ent',
        'unicorn2',
        'elf2',
        'unicorn',
        'ent2',
    ],
    human: [
        // 'peasant',
        // 'robber',
        // 'robber2',
        'footman',
        'bowman',
        'priest',
        'witch_hunter',
        'footman2',
        'priest2',
        'horseman',
        'knight',
        'archmage',
        'paladin',
        'runemage',
    ],
    lizard: [
        'gobot',
        'gobot2',
        'gorguana',
        'gorguana2',
        'highterrant',
        'chosha',
        'brontor',
        'tirex',
    ],
    undead: [
        'skeleton',
        'archer',
        'spider_undead',
        'zombie',
        'zombie2',
        'pirat_ghost',
        'vampire',
        'bat',
        'ghost',
        'ghost2',
        'blackknight',
        'vampire2',
        'bat2',
        'necromant',
        'bonedragon',
    ],
};









let indexLines = [];
let features = [];
let featuresFromHints = [];
let allFeatures = [];

for (const [raceName, unitNames] of Object.entries(parseMap)) {
    for (const unitName of unitNames) {
        let json = convertFile(unitName, raceName);

        indexLines.push(`export {default as ${unitName}} from './squads/${raceName}/${unitName}.json';`);
        features.push(...json.options.features);
        featuresFromHints.push(...json.options.__featuresFromHints);
    }
}

features = features.filter(onlyUnique);
featuresFromHints = featuresFromHints.filter(onlyUnique);
allFeatures = features.concat(featuresFromHints).filter(onlyUnique);

fs.writeFileSync('../kb/index.js', indexLines.join('\n'));
fs.writeFileSync('../kb/features.generated.txt', features.join('\n'));
fs.writeFileSync('../kb/featuresFromHints.generated.txt', featuresFromHints.join('\n'));
fs.writeFileSync('../kb/allFeatures.generated.txt', allFeatures.join('\n'));








function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

function convertFile(unitName, raceName) {
    let atomPath = `../kb/atoms/${unitName}.atom`;
    let jsonPath = `../kb/squads/${raceName}/${unitName}.json`;
    let converter = new AtomConverter();

    console.log('reading', atomPath)
    let atom = readAtom(atomPath);
    console.log('converting', atomPath)
    let json = converter.convertAtomToJson(atom);

    writeJson(jsonPath, json);

    return json;
}

function readAtom(path) {
    let atomText = fs.readFileSync(path, 'utf8');
    let parser = new Parser();

    return parser.parseConfig(atomText);
}

function writeJson(path, json) {
    let resistances = json.props.resistances;
    let abilities = JSON.parse(JSON.stringify(json.options.abilities));
    let nonRegularAbilities = JSON.parse(JSON.stringify(json.options.__nonRegularAbilities));

    json.props.resistances = json.props.resistances.map((resistance, index) => {
        return `RESISTANCE${index}`;
    });

    json.options.abilities = json.options.abilities.map((ability, abilityIndex) => {
        if (ability.damageRanges) {
            ability.damageRanges = ability.damageRanges.map((range, rangeIndex) => {
                return `ABILITY${abilityIndex}_RANGE${rangeIndex}`;
            });
        }

        return ability;
    });

    json.options.__nonRegularAbilities = json.options.__nonRegularAbilities.map((ability, abilityIndex) => {
        if (ability.damageRanges) {
            ability.damageRanges = ability.damageRanges.map((range, rangeIndex) => {
                return `NON_REG_ABILITY${abilityIndex}_RANGE${rangeIndex}`;
            });
        }

        return ability;
    });



    let content = JSON.stringify(json, null, '  ');



    resistances.forEach((value, index) => {
        value = `["${value[0]}", ${value[1]}]`;
        content = content.replace(`"RESISTANCE${index}"`, value);
    });

    abilities.forEach((ability, abilityIndex) => {
        if (ability.damageRanges) {
            ability.damageRanges.forEach((range, rangeIndex) => {
                range = `["${range[0]}", ${range[1]}, ${range[2]}]`;
                content = content.replace(`"ABILITY${abilityIndex}_RANGE${rangeIndex}"`, range);
            });
        }
    })

    nonRegularAbilities.forEach((ability, abilityIndex) => {
        if (ability.damageRanges) {
            ability.damageRanges.forEach((range, rangeIndex) => {
                range = `["${range[0]}", ${range[1]}, ${range[2]}]`;
                content = content.replace(`"NON_REG_ABILITY${abilityIndex}_RANGE${rangeIndex}"`, range);
            });
        }
    })



    writeFile(path, content);
}

async function writeFile(path, content) {
    await mkdirp(getDirName(path));
    fs.writeFileSync(path, content);
}