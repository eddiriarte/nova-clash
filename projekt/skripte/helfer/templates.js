
export const raumschiff = (raumschiffTyp, farbe, groesse = 52) => `
<svg viewBox="0 0 52 52" width="${groesse}", height="${groesse}">
    <use xlink:href="#${raumschiffTyp}" fill="#${farbe}" width="100%" />
</svg>`;

export const commanderItem = (commander) => `
<div class="commander-item">
    ${raumschiff(commander.settings.ship, commander.settings.color, 28)}
    ${commander.name}
</div>`;

export const battleItem = (battle, commander) => {
    const onJoinClick = `this.dispatchEvent(new CustomEvent('click-join-battle', { detail: '${battle.id}', bubbles: true }));`;
    const onStartClick = `this.dispatchEvent(new CustomEvent('click-start-battle', { detail: '${battle.id}', bubbles: true }));`;

    const canStart = battle.owner === commander.id;
    const canJoin = battle.owner !== commander.id
        && battle.commanders.every(c => c.id !== commander.id)
        && !battle.started;

    return `
<div class="battle-item">
    ${battle.name} (${battle.commanders.length} 👨‍🚀👩‍🚀)
    ${ canJoin ? `<button onclick="${onJoinClick}">Mitmachen</button>` : '' }
    ${ canStart ? `<button onclick="${onStartClick}">Starten</button>` : '' } 
</div>`;
}

