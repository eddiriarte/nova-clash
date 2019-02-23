import * as NovaEvent from '../helfer/events';
import {bewegungBerechnen} from "../helfer/transformations";

export default class Raumschiff {

    constructor(id, element, startPlanet) {
        this.id = id;
        this.element = element;
        
        this.bewegenBis(startPlanet);
        NovaEvent.erwarteKlick(this.element, this.beiRaumschiffKlick.bind(this));
    }

    bewegenBis(planet, shouldTriggerEvent) {
        this.position = planet;
        this.element.style.transform = bewegungBerechnen(planet, this.element);

        if (shouldTriggerEvent) {
            NovaEvent.schiffBewegen(this.element, { id: this.id, offset: this.position });
        }
    }

    istAuf(field) {
        return this.position === field;
    }

    istImHangar() {
        return this.position.parentNode.classList.contains('hangar');
    }

    istAmZiel() {
        return this.position.classList.contains('ziel');
    }

    beiRaumschiffKlick() {
        if (this.istAmZiel()) {
            console.log('Dieser Raumschiff ist bereits am Ziel...');
            return;
        }

        NovaEvent.schiffAuswaehlen(this.element, { id: this.id });
    }
}
