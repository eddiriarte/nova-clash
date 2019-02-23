import io from 'socket.io-client';
import {
    RemoteServerUrl,
    commanderHinzufuegen,
    battleHinzufuegen,
    diskAktualisieren,
    diskDrehen, anfragen
} from './requests';


const getDefaultSubscriber = () => Object.values(RemoteEvents)
    .reduce((o, e) => ({...o, [e]: []}), {});

const eventHandlerRegistrieren = (subscriber, client, handler, scope) => {
    const events = Object.keys(subscriber);
    events.forEach(eventName => {
        client.on(eventName, handler.bind(scope, eventName));
    });
};

export const LocalEvents = {
    Verbinden: 'connection',
    Anmelden: 'login',
    BattleErstellen: 'create_game',
    AnBattleTeilnehmen: 'join_game',
    BattleVerlassen: 'leave_game',
    BattleBeginnen: 'start_game',
    ScheibeDrehen: 'rotate_disc',
    RaumschifBewegen: 'move_ship',
    VerbindungTrennen: 'disconnect',
    AuftragBeenden: 'end_turn',
};

export const RemoteEvents = {
    DiskDrehen: 'disc_rotate',
    ScheibeAktualisieren: 'disc_update',
    CommanderHinzufuegen: 'add_player',
    BattleAktualisieren: 'game_info',
    BattleLaden: 'board_load',
    RaumschiffAktualisieren: 'ship_update',
    CommanderBeauftragen: 'commander_enlist',
    BattleStatus: 'game_update',
};

export const makeSubscriber = (callee) => {
    const methods = Object.getOwnPropertyNames( Object.getPrototypeOf(callee) );
    return Object.keys(RemoteEvents)
        .reduce((subscriber, event) => {
            const callbackName = `bei${event}`;
            if (!methods.includes(callbackName)) {
                return subscriber;
            }

            return {...subscriber, [ RemoteEvents[event] ]: [ callee[ callbackName ].bind(callee) ] };
        }, {});
};

export default class SocketVerbindung {
    constructor(callee) {
        this.client = io(RemoteServerUrl);
        this.subscriber = Object.assign(getDefaultSubscriber, makeSubscriber(callee));

        eventHandlerRegistrieren(this.subscriber, this.client, this.externeEventsHandeln, this);
    }

    battleErstellen(name, commanderId) {
        return battleHinzufuegen({ name, commanderId });
    }

    commanderHinzufuegen(name, options) {
        const settings = Object.assign({ ship: 'ship-1', color: 'red' }, options);
        return commanderHinzufuegen({ name, settings });
    }

    anBattleTeilnehmen(battleId, commanderId) {
        this.client.emit(LocalEvents.AnBattleTeilnehmen, { battleId, commanderId })
    }

    battleBeginnen(battleId) {
        this.client.emit(LocalEvents.BattleBeginnen, { battleId });
    }

    scheibeDrehen(battleId) {
        return anfragen('/disc/rotate/game/' + battleId, {
            method: "POST",
            redirect: "follow",
            referrer: "no-referrer",
            body: JSON.stringify({ battleId })
        });
    }

    symbolTeilen(battleId, symbol) {
        return anfragen('/disc/update/game/' + battleId, {
            method: "POST",
            redirect: "follow",
            referrer: "no-referrer",
            body: JSON.stringify({ battleId, disc: symbol })
        });
    }

    zugBeenden(battleId) {
        return anfragen(`/game/${battleId}/next-player`, {
            method: "POST",
            redirect: "follow",
            referrer: "no-referrer",
            body: JSON.stringify({ battleId })
        });
    }

    raumschiffBewegen(battleId, commanderId, disc, ship) {
        this.client.emit(LocalEvents.RaumschifBewegen, { battleId, commanderId, disc, ship });
    }

    externeEventsHandeln(event, data) {
        const handlers = this.subscriber[event];
        handlers.forEach(callback => callback(data));
    }
}
