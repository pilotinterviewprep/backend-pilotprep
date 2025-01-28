"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pick = void 0;
const pick = (obj, keys) => {
    const queryObj = {};
    for (const key of keys) {
        if (obj && Object.hasOwnProperty.call(obj, key)) {
            queryObj[key] = obj[key];
        }
    }
    return queryObj;
};
exports.pick = pick;
