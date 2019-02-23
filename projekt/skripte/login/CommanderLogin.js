
import * as Finder from '../helfer/finder';
import * as NovaEvent from '../helfer/events';
import * as Template from '../helfer/templates';
import SocketVerbindung from '../helfer/SocketVerbindung';

export default class CommanderLogin {
    constructor() {
        this.socket = new SocketVerbindung(this);
        NovaEvent.erwarteAenderung( Finder.byId('RaumschiffTyp'), this.vorschauAktualisieren.bind(this) );
        NovaEvent.erwarteAenderung( Finder.byId('RaumschiffFarbe'), this.vorschauAktualisieren.bind(this) );
        NovaEvent.erwarteKlick( Finder.byId('AnmeldeButton'), this.login.bind(this) );
    }

    get name() {
        return Finder.byId('CommanderName').value;
    }

    get farbe() {
        return Finder.byId('RaumschiffFarbe').value;
    }

    get raumschiff() {
        return Finder.byId('RaumschiffTyp').value;
    }

    isValid() {
        return this.name.length > 0 && this.farbe.left > 0 && this.raumschiff.length > 0;
    }

    vorschauAktualisieren() {
        Finder.byId('RaumschiffVorschau').innerHTML = Template.raumschiff(this.raumschiff, this.farbe, 200);
    }

    fehlerAnzeigen(nachricht) {
        const paragraph = document.createElement('p');
        paragraph.classList.add('error');
        paragraph.innerText = nachricht;

        Finder.byId('LoginFormular').prepend( paragraph );
    }

    login() {
        if (!this.isValid()) {
            this.fehlerAnzeigen('Alle Felder müssen ausgefüllt werden!');
        }

        const optionen = {
            ship: this.raumschiff,
            color: this.farbe
        };

        this.socket.commanderHinzufuegen(this.name, optionen)
            .then(commander => {
                localStorage.setItem('commander', JSON.stringify(commander));
                location.pathname = '/lobby.html';
            })
            .catch(fehler => console.error(fehler));
    }
}
