
export default class Rune {

    constructor(symbol, schritte) {
        this.symbol = symbol;
        this.schritte = schritte;
    }

    isGleich(rune) {
        return this.symbol === rune.symbol;
    }

    static get ALPHA() {
        return new Rune('α', 1);
    }

    static get BETA() {
        return new Rune('β', 2);
    }

    static get DELTA() {
        return new Rune('δ', 3);
    }

    static get EPSILON() {
        return new Rune('ε', 4);
    }

    static get OMEGA() {
        return new Rune('ω', 5);
    }

    static get KAPPA() {
        return new Rune('κ', 6);
    }

    static get PHI() {
        return new Rune('φ', 7);
    }

    static beiSymbol(symbol) {
        switch (symbol) {
            case 'α':
                return Rune.ALPHA;
            case 'β':
                return Rune.BETA;
            case 'δ':
                return Rune.DELTA;
            case 'ε':
                return Rune.EPSILON;
            case 'ω':
                return Rune.OMEGA;
            case 'κ':
                return Rune.KAPPA;
            case 'φ':
                return Rune.PHI;
        }
    }

    static values() {
        return [
            Rune.ALPHA,
            Rune.BETA,
            Rune.DELTA,
            Rune.EPSILON,
            Rune.OMEGA,
            Rune.KAPPA,
            Rune.PHI
        ];
    }
};
