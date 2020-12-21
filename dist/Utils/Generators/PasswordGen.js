"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.passwordGenerator = void 0;
const passwordGenerator = (length) => {
    var result = "";
    var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
};
exports.passwordGenerator = passwordGenerator;
//# sourceMappingURL=PasswordGen.js.map