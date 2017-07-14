const deadpull = require("../../../images/deadpull.png");
const spiderMan = require("../../../images/spider-man.png");

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
    }
]; 