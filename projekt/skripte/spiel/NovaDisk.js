import * as Finden from '../helfer/finder';
import * as NovaEvent from '../helfer/events';
import Rune from "./Rune";

export default class NovaDisk {

    constructor() {
        this.element = Finden.byId('ShuffleDisc');

        NovaEvent.erwarteKlick(this.element, this.beiDiskKlick.bind(this));
    }

    aktivieren() {
        this.element.classList.add('active');
    }

    deaktivieren() {
        this.element.classList.remove('active');
    }

    drehen() {
        this.element.classList.add('spin');
        this.zufaelligeRuneAnzeigen();
    }

    drehungBeenden() {
        const symbol = this.element.innerText;
        NovaEvent.symbolTeilen(this.element, symbol);
    }

    runeAnzeigen(rune) {
        this.element.innerText = rune.symbol;
    }

    zufaelligeRuneAnzeigen() {
        if (!this.esDrehtSich) {
            return;
        }

        const runen = Rune.values();
        const index = (Math.floor(Math.random() * 749 ) % runen.length);
        
        this.runeAnzeigen(runen[index]);
        setTimeout(this.zufaelligeRuneAnzeigen.bind(this), 100);
    }

    get esDrehtSich() {
        return this.element.classList.contains('spin');
    }

    beiDiskKlick() {
        if (!this.esDrehtSich) {
            NovaEvent.diskDrehen(this.element);
        }
    }
}
