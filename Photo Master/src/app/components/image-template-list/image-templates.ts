const deadpull = require("../../../images/template-images/deadpull.png");
const spiderMan = require("../../../images/template-images/spider-man.png");
const spiderMan2 = require("../../../images/template-images/spider-man-2.png");
const ironMan = require("../../../images/template-images/iron-man.png");

export interface ImageTemplate {
    url: string;
    className: string;
}

export const imageTemplates: ImageTemplate[] = [
    {
        url: deadpull,
        className: "deadpull"
    },
    {
        url: spiderMan,
        className: "spider-man"
    },
    {
        url: ironMan,
        className: "iron-man"
    },
    {
        url: spiderMan2,
        className: "spider-man"
    }
]; 