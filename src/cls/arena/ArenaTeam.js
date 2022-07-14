
export default class ArenaTeam {

    static DEFAULT_1 = new ArenaTeam('Default 1', '#004488');
    static DEFAULT_2 = new ArenaTeam('Default 2', '#884400');
    static DEFAULT_3 = new ArenaTeam('Default 3', '#880000');
    static DEFAULT_4 = new ArenaTeam('Default 4', '#008844');

    constructor(name, hexColor) {
        this.name = name;
        this.hexColor = hexColor;
    }
}