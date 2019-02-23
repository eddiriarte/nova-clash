import * as Finder from './finder';

export const bewegungBerechnen = (planet, ship) => {
    const targetBlock = planet.getBoundingClientRect();
    const currentBlock = ship.getBoundingClientRect();
    const board = Finder.byId('NovaClash');
    const x = targetBlock.x -  board.offsetLeft;
    const y = targetBlock.y -  board.offsetTop;
    let angle = -90;

    if (!planet.parentNode.classList.contains('hangar')) {
        angle = Math.atan2(targetBlock.y - currentBlock.y, targetBlock.x - currentBlock.x) * 180 / Math.PI;

        if(angle < 360){
            angle += 360;
        }

        if(angle > 360){
            angle -= 360;
        }
    }

    return `translate(${x}px, ${y}px) rotate(${angle + 90}deg)`;
};

const getOffsetTop = (field) => {
    const block = field.getBoundingClientRect();
    return block.top + (block.height / 2) - 26 - board.offsetTop;
};

const getOffsetLeft = (field) => {
    const block = field.getBoundingClientRect();
    return block.left + (block.width / 2) - 26 - board.offsetLeft;
};