import Raumschiff from '../spiel/Raumschiff';
import * as Template from './templates';
import * as Finden from './finder';

export const board = () => Finden.byCssClass('.gameboard');

const planetenSortieren = (stelle) => {
    let planeten = Finden.manyByCssClass('.quadrant .planet:not(.ziel)');
    
    while(!planeten[0].classList.contains(`commander${stelle}`)) {
        planeten = [...planeten.slice(1), planeten[0]];
    }
    
    return planeten;
};

const zielPlanetenFinden = (stelle, farbe) => Finden.manyByCssClass('.quadrant .planet.ziel.commander' + stelle)
    .map(planet => {
        planet.style.backgroundColor = '#' + farbe;
        return planet;
    });

export const commanderStreckeFinden = (stelle, farbe) => {
    return [
        ...planetenSortieren(stelle),
        ...zielPlanetenFinden(stelle, farbe)
    ];
};

export const hangarPlanetenFinden = (stelle, farbe) => Finden.manyByCssClass(`.hangar.commander${stelle} .planet`)
    .map(hangar => {
        hangar.style.backgroundColor = '#' + farbe;
        return hangar;
    });

export const raumschiffeBauen = (stelle, settings, hangar) => {
    return hangar.reduce((list, planet, index) => {
        const id = `commander${stelle}-raumschiff${index + 1}`;
        const figur = document.createElement('picture');
        figur.classList.add('raumschiff');
        figur.innerHTML = Template.raumschiff(settings.ship, settings.color);

        Finden.byId('NovaClash').appendChild(figur);

        return [...list, new Raumschiff(id, figur, planet)];
    }, []);
};
