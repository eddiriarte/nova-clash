const triggerEvent = (element, event, detail, bubbles = true) => element.dispatchEvent(
    new CustomEvent(event, { detail, bubbles })
);

export const Ereignis = {
    schiffBewegen: 'figure-move',
    schiffAuswaehlen: 'figure-click',
    diskDrehen: 'novaDisk-click',
    symbolTeilen: 'novaDisk-drehen'
};

/**
 * Fügt einen Change-EventListener zu den gegebenen HTML-Elelment hinzu.
 *
 * @param {HtmlElement} element
 * @param {function} handler
 */
export const erwarteAenderung = (element, handler) => element.addEventListener('change', handler);

/**
 * Fügt einen Klick-EventListener zu den gegebenen HTML-Elelment hinzu.
 *  
 * @param {HtmlElement} element 
 * @param {function} handler 
 */
export const erwarteKlick = (element, handler) => element.addEventListener('click', handler);

/**
 * Fügt einen JoinGame-EventListener zu den gegebenen HTML-Elelment hinzu.
 *
 * @param element
 * @param handler
 * @returns {*}
 */
export const erwarteBattleTeilnahme = (element, handler) => element.addEventListener('click-join-battle', handler);

/**
 * Fügt einen JoinGame-EventListener zu den gegebenen HTML-Elelment hinzu.
 *
 * @param element
 * @param handler
 * @returns {*}
 */
export const erwarteBattleStart = (element, handler) => element.addEventListener('click-start-battle', handler);

/**
 * Triggert ein `figure-move` Event, dass mit allen Spielern synchronisiert wird.
 * 
 * @param {HtmlElement} element 
 * @param {JSON} detail 
 */
export const schiffBewegen = (element, detail) => triggerEvent(element, Ereignis.schiffBewegen, detail);

/**
 * Triggert ein `figure-click` Event, dass mit allen Spielern synchronisiert wird.
 * 
 * @param {HtmlElement} element 
 * @param {JSON} detail 
 */
export const schiffAuswaehlen = (element, detail) => triggerEvent(element, Ereignis.schiffAuswaehlen, detail);

/**
 * Triggert ein `novaDisk-click` Event, dass mit allen Spielern synchronisiert wird.
 * 
 * @param {HtmlElement} element 
 */
export const diskDrehen = (element) => triggerEvent(element, Ereignis.diskDrehen, null);

/**
 * Triggert ein `novaDisk-drehen` Event, dass mit allen Spielern synchronisiert wird.
 * 
 * @param {HtmlElement} element 
 * @param {Object} detail 
 */
export const symbolTeilen = (element, detail) => triggerEvent(element, Ereignis.symbolTeilen, detail);


