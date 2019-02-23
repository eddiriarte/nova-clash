const makeOptions =
    (options) => Object.assign({}, options, {
        mode: "cors", // no-cors, cors, *same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "omit", // include, *same-origin, omit
        headers: {
            "Content-Type": "application/json",
        }
    });

export const RemoteServerUrl = 'http://localhost:3000';

export const anfragen = (pfad, options = {}) =>
    fetch(`${RemoteServerUrl}${pfad}`, makeOptions(options))
        .then(response => response.json());

export const alleCommanderAnfragen = (options = {}) => anfragen('/all-players');

export const alleBattlesAnfragen = (options = {}) => anfragen('/all-games');

export const commanderHinzufuegen = (commander) => anfragen('/player', {
    method: "POST",
    redirect: "follow",
    referrer: "no-referrer",
    body: JSON.stringify(commander)
});

export const battleHinzufuegen = (battle) => anfragen('/game', {
    method: "POST",
    redirect: "follow",
    referrer: "no-referrer",
    body: JSON.stringify(battle)
});

export const diskDrehen = (battleId) => anfragen('/disc/rotate/game/' + battleId, {
    method: "POST",
    redirect: "follow",
    referrer: "no-referrer",
    body: JSON.stringify({ battleId })
});

export const diskAktualisieren = (battleId, disc) => anfragen('/disc/update/game/' + battleId, {
    method: "POST",
    redirect: "follow",
    referrer: "no-referrer",
    body: JSON.stringify({ battleId, disc })
});
