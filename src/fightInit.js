
import arenaData from './data/json/arenas/generic_with_obstacles.json';
import Army from './cls/fight/Army.js';
import Team from './cls/pawns/Team.js';

let army1 = new Army(Team.DEFAULT_1);
let army2 = new Army(Team.DEFAULT_2);

army1.addSquad('walker', 250);
army1.addSquad('soarer', 100);
army1.addSquad('archer', 50);
army2.addSquad('walker', 150);
army2.addSquad('dragon', 1);

let armies = [army1, army2];

export {
    arenaData,
    armies,
}