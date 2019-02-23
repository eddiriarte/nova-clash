import '../darstellung/nova-clash.scss';
import CommanderLogin from "./login/CommanderLogin";
import NovaLobby from "./lobby/NovaLobby";
import NovaClash from "./spiel/NovaClash";

require('jscolor-picker');

if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
    const urlParams = new URLSearchParams(window.location.search);
    const battleId = urlParams.get('battleId');

    if (!battleId) {
        window.location.pathname = '/login.html';
    }

    window.nova = new NovaClash(battleId);
}

if (window.location.pathname === '/lobby.html') {
    window.lobby = new NovaLobby();
}

if (window.location.pathname === '/login.html') {
    window.login = new CommanderLogin();
}
