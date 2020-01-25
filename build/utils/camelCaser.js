"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (str) => {
    return str
        .split("-")
        .map((val, i) => {
        if (i > 0) {
            return val.charAt(0).toUpperCase() + val.slice(1);
        }
        else {
            return val;
        }
    })
        .join("");
};
//# sourceMappingURL=camelCaser.js.map