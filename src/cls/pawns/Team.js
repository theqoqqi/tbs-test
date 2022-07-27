export default class Team {

    static DEFAULT_1 = new Team('Default 1', '#004488', true);
    static DEFAULT_2 = new Team('Default 2', '#884400', true);
    static DEFAULT_3 = new Team('Default 3', '#880000', true);
    static DEFAULT_4 = new Team('Default 4', '#008844', true);
    static NEUTRAL = new Team('Neutral', '#444444', false);

    constructor(name, hexColor, isContender) {
        this.name = name;
        this.hexColor = hexColor;
        this.isContender = isContender;
    }
}