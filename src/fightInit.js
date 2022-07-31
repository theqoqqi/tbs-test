
import arenaData from './data/json/arenas/generic_with_obstacles.json';
import Army from './cls/fight/Army.js';
import Team from './cls/pawns/Team.js';

let army1 = new Army(Team.DEFAULT_1);
let army2 = new Army(Team.DEFAULT_2);

army1.addSquad('test_dragon', 5);
army1.addSquad('peasant', 250);
army1.addSquad('robber', 100);
army1.addSquad('robber2', 50);
army1.addSquad('footman', 50);
army2.addSquad('bowman', 150);
army2.addSquad('priest', 100);
army2.addSquad('witch_hunter', 150);

let armies = [army1, army2];

export {
    arenaData,
    armies,
}