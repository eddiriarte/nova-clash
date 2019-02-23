
export const byId = (id) => document.getElementById(id);

export const byCssClass = (cssClass) => document.querySelector(cssClass);

export const manyByCssClass = (cssClass) => [...document.querySelectorAll(cssClass)];


