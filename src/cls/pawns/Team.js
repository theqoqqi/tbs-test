export default class Team {

    static DEFAULT_1 = new Team('Default 1', '#004488');
    static DEFAULT_2 = new Team('Default 2', '#884400');
    static DEFAULT_3 = new Team('Default 3', '#880000');
    static DEFAULT_4 = new Team('Default 4', '#008844');

    constructor(name, hexColor) {
        this.name = name;
        this.hexColor = hexColor;
    }
}