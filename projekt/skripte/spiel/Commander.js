import Rune from "./Rune";
import * as Spielbrett from "../helfer/spielfeld";

export default class Commander {

    constructor(stelle, id, name, settings) {
        this.id = id;
        this.name = name;
        this.stelle = stelle;
        this.settings = settings;
        this.hangar = Spielbrett.hangarPlanetenFinden(this.stelle, this.settings.color);
        this.strecke = Spielbrett.commanderStreckeFinden(this.stelle, this.settings.color);
        this.raumschiffe = Spielbrett.raumschiffeBauen(this.stelle, this.settings, this.hangar);
    }

    alleRaumschiffeImHangar() {
        return this.raumschiffe
            .every(shuttle => shuttle.istImHangar());
    }

    istRaumschiffAufPlanet(rune, raumschiffId) {
        const raumschiff = this.raumschiffe
            .filter(shuttle => shuttle.id === raumschiffId).pop();
        const planet = rune.schritte + this.strecke
            .findIndex(planet => planet === raumschiff.position);
        const landung = this.strecke[ planet ];
    
        return this.raumschiffe
            .some(shuttle => shuttle.position === landung);
    }

    kannRaumschiffAbschiessen(raumschiffId) {
        const abschussRampe = this.strecke[0];
        const raumschiff = this.raumschiffe
            .filter(shuttle => shuttle.id === raumschiffId)
            .pop();

        if (raumschiff.istImHangar()) {
            return false;
        }

        return this.raumschiffe
            .every(shuttle => !shuttle.istAuf(abschussRampe));
    }

    ziehen(raumschiffId, rune) {
        const raumschiff = this.raumschiffe.filter((f) => f.id === raumschiffId)[0];

        if (Rune.PHI.isGleich(rune) && raumschiff.istImHangar()) {
            raumschiff.bewegenBis(this.strecke[0]);
            return;
        }

        for (let schritt = 1; schritt <= rune.schritte; schritt++) {
            const field = this.strecke[ schritt + this.strecke.findIndex(planet => planet === raumschiff.position) ]
            setTimeout(() => raumschiff.bewegenBis(field, (schritt === rune.schritte)), 600 * schritt);
        }
    }

    freieHangars() {
        const raumschiffe = this.raumschiffe;
        return this.hangar
            .filter(hangar => raumschiffe.every(shuttle => !shuttle.istAuf(hangar)))
    }

}

