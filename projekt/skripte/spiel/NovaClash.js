import NovaDisk from './NovaDisk';
import Commander from './Commander';
import Rune from "./Rune";
import * as Finder from '../helfer/finder';
import SocketVerbindung from "../helfer/SocketVerbindung";
import {Ereignis} from "../helfer/events";

export default class NovaClash {

    constructor() {
        this.socket = new SocketVerbindung(this);

        this._battle = JSON.parse(localStorage.getItem('battle'));
        this._commander = JSON.parse(localStorage.getItem('commander'));

        this.id = this._battle.id;
        this.novaDisk = new NovaDisk();
        this.commanders = makeCommanders(this._battle);
        this.commanderVersuche = 0;

        listenerHinzufuegen(this, Finder.byId('NovaClash'));

        console.info('👩‍🚀 🎮 Battle kann beginnen!');
    }

    beiScheibeDrehenKlick() {
        if (this.commanderAmZug.id === this._commander.id) {
            this.commanderVersuche++;
            if (this.commanderVersuche >= 3) {
                console.info('🙈 Du hattest drei Versuche... dein Zug ist vorbei!');
                this.zugBeenden(this.id);
                return;
            }

            this.socket.scheibeDrehen(this.id);
        } else {
            console.info('🙈 Du bist nicht mehr am Zug...!');
        }
    }

    beiRaumschiffKlicks({ detail }) {
        // ist der Commander dran?
        if (this.commanderAmZug.id !== this._commander.id) {
            console.info('🙈 Du bist nicht mehr am Zug...!');
            return;
        }

        // wurde die Nova schon gedreht?
        if (!(this.rune instanceof Rune)) {
            console.info('🙈 Kein PINK vorhanden... drehe die Nova!');
            return;
        }

        const commander = this.findeCommanderById(this._commander.id);

        // is this a commanders ship?
        if (!commander.raumschiffe.some(shuttle => shuttle.id === detail.id)) {
            console.info('🙈 Raumschiff gehört dir nicht... wähle eins deiner Raumschiffe aus!');
            return;
        }

        const raumschiff = commander.raumschiffe.filter(shuttle => shuttle.id === detail.id).pop();

        if (Rune.PHI.isGleich(this.rune)) {

            // can start with new ship?
            if (raumschiff.istImHangar() && commander.raumschiffe.some(shuttle => shuttle.istAuf(commander.strecke[0]))) {
                console.info('🙈 Abschussrampe is belegt... wähle an anderes Raumschiff!');
                return;
            }

        } else {

            // can move any ship?
            if (commander.alleRaumschiffeImHangar()) {
                console.info('🙈 Alle Raumschiffe sind im Hangar... versuche es erneut!');
                this.zugBeenden(this.id);
                return;
            }

        }

        // is available target?
        if (commander.istRaumschiffAufPlanet(this.rune, detail.id)) {
            console.info('🙈 Planet ist belegt... wähle an anderes Raumschiff!');
            return;
        }

        // move ship!
        this.socket.raumschiffBewegen(this.id, commander.id, this.rune.symbol, detail.id);

        this.zugBeenden(this.id);
    }

    zugBeenden(id) {
        this.rune = null;
        this.commanderVersuche = 0;
        this.socket.zugBeenden(this.id);
    }

    beiDiskDrehen() {
        if (this.commanderAmZug.id === this._commander.id) {
            this.novaDisk.drehen();
            setTimeout(this.novaDisk.drehungBeenden.bind(this.novaDisk), 2500);
        } else {
            console.info('🙈 Du bist nicht mehr am Zug...!');
        }
    }

    beiCommanderBeauftragen({ commanderId }) {
        this.commanderAmZug = this.findeCommanderById(commanderId);

        if (this.commanderAmZug.alleRaumschiffeImHangar()) {
            this.commanderVersuche = 3;
        } else {
            this.commanderVersuche = 1;
        }

    }

    get commanderAmZug() {
        return this.findeCommanderById(this._battle.currentCommander);
    }

    findeCommanderById(commanderId) {
        return this.commanders.filter(commander => commander.id === commanderId).pop();
    }

    beiRaumschiffBewegen({ detail }) {
        console.info('🚨 🚀 Raumschiff wird bewegt!');
        const commanderId = detail.id.split('-')[0];
        
        Object.values(this.commanders)
            .filter(commander => commander.id !== commanderId)
            .forEach(commander => {
                commander.raumschiffe.forEach(shuttle => {
                    if (shuttle.istAuf(detail.position)) {
                        const basis = commander.freieHangars();
                        shuttle.bewegenBis(basis.pop());
                    }
                })
            });
    }

    beiScheibeAktualisieren({ disc, battleId }) {
        console.info('🚨 💽 nova shuffled...', disc);
        if (this.id === battleId) {
            this.rune = Rune.beiSymbol(disc);
            this.novaDisk.element.classList.remove('spin');
            this.novaDisk.runeAnzeigen( this.rune );
        }
    }

    beiBattleStatus({ battle }) {
        console.info('🚨 💽 battle wurde aktualisiert...', battle);
        if (battle.id === this._battle.id) {
            this._battle = battle;

            localStorage.setItem('battle', JSON.stringify(this._battle));
        }
    }

    beiRaumschiffAktualisieren({ commanderId, ship, disc }) {
        console.info('🚨 💽 Raumschiffposition wurde aktualisiert...', ship);
        const commander = this.findeCommanderById(commanderId);
        const rune = Rune.beiSymbol(disc);

        commander.ziehen(ship, rune);
    }
}

const listenerHinzufuegen = (nova, board) => {
    board.addEventListener(Ereignis.diskDrehen, () => { nova.beiScheibeDrehenKlick(nova); });
    board.addEventListener(Ereignis.symbolTeilen, ({ detail }) => nova.socket.symbolTeilen(nova.id, detail));
    board.addEventListener(Ereignis.schiffAuswaehlen, nova.beiRaumschiffKlicks.bind(nova));
    board.addEventListener(Ereignis.schiffBewegen, nova.beiRaumschiffBewegen.bind(nova));
}

const makeCommanders = (battle) => {
    return battle.commanders.map(
        (commander, index) => new Commander((index + 1), commander.id, commander.name, commander.settings)
    );
}
