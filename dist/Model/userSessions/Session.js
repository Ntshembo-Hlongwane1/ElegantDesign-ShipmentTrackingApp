"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sessionModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const sessionSchema = new mongoose_1.default.Schema({
    expires: { type: Date, required: true },
    session: { type: Object, required: true },
});
exports.sessionModel = mongoose_1.default.model("usersessions", sessionSchema);
//# sourceMappingURL=Session.js.map