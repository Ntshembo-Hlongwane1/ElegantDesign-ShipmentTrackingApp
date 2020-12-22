"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetTime = void 0;
const GetTime = () => {
    const date = new Date();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? "0" + minutes : minutes;
    let Time = hours + ":" + minutes + " " + ampm;
    return Time;
};
exports.GetTime = GetTime;
//# sourceMappingURL=CurrentTime.js.map