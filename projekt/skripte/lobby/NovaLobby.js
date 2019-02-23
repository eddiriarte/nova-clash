import * as Finder from '../helfer/finder';
import * as NovaEvent from '../helfer/events';
import * as NovaStore from '../helfer/requests';
import * as Template from '../helfer/templates';
import SocketVerbindung from "../helfer/SocketVerbindung";

export default class NovaLobby {
    constructor() {
        this.socket = new SocketVerbindung(this);
        this.commandersLaden();
        this.battlesLaden();

        NovaEvent.erwarteKlick(Finder.byId('BattleErstellenButton'), this.battleErstellen.bind(this));
        NovaEvent.erwarteBattleTeilnahme(Finder.byId('BattleListe'), this.fuerBattleRegistrieren.bind(this));
        NovaEvent.erwarteBattleStart(Finder.byId('BattleListe'), this.battleBeginnen.bind(this));
    }

    commandersLaden() {
        const _lobby = this;
        NovaStore.alleCommanderAnfragen()
            .then(commanders => {
                if (commanders.length < 1) {
                    location.pathname = '/login.html';
                    return;
                }
                _lobby.commandersAnzeigen(commanders)
            });
    }

    battlesLaden() {
        const _lobby = this;
        NovaStore.alleBattlesAnfragen()
            .then(battles => { _lobby.battlesAnzeigen(battles) });
    }

    commandersAnzeigen(commanders) {
        const commanderListe = Finder.byId('CommanderListe');
        [...commanderListe.children].forEach(item => item.remove());

        commanders.forEach(commander => {
            const item = document.createElement('li');
            item.innerHTML = Template.commanderItem(commander);

            commanderListe.appendChild(item);
        });
    }

    battlesAnzeigen(battles) {
        const commander = JSON.parse( localStorage.getItem('commander') );
        const listPanel = Finder.byId('BattleListe');
        [...listPanel.children].forEach(
            (item, index) => {
                if (index !== 0) {
                    item.remove();
                }
            }
        );

        battles.forEach(battle => {
            const item = document.createElement('li');
            item.innerHTML = Template.battleItem(battle, commander);
            listPanel.appendChild(item);
        });
    }

    fuerBattleRegistrieren({ detail }) {
        console.info(detail);
        const commander = JSON.parse( localStorage.getItem('commander') );
        this.socket.anBattleTeilnehmen( detail, commander.id );
    }

    battleErstellen() {
        const battleName = Finder.byId('BattleNameFeld').value;
        const commander = JSON.parse(localStorage.getItem('commander'));
        if (battleName.length > 0) {
            this.socket.battleErstellen(battleName, commander.id)
                .then(battle => console.info(battle));
        }
    }

    battleBeginnen({ detail }) {
        this.socket.battleBeginnen(detail);
    }

    beiBattleAktualisieren(battle) {
        this.battlesLaden();
    }

    beiCommanderHinzufuegen(commander) {
        this.commandersLaden();
    }

    beiBattleLaden(battle) {
        const commander = JSON.parse( localStorage.getItem('commander') );
        if (battle.commanders.some(teilnehmer => teilnehmer.id === commander.id) ) {
            localStorage.setItem('battle', JSON.stringify(battle));
            location.replace('/?battleId=' + battle.id);
        }
    }
};

