"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Auth_1 = __importDefault(require("../../Controller/Auth/Auth"));
const router = express_1.Router();
const AuthController = new Auth_1.default();
router.post("/api/user-signup/:user_role", (request, response) => {
    AuthController.SignUp(request, response);
});
router.post("/api/user-signin", (request, response) => {
    AuthController.SignIn(request, response);
});
router.get("/api/logout", (request, response) => {
    AuthController.LogOut(request, response);
});
router.get("/api/isLoggedIn", (request, response) => {
    AuthController.isLoggedIn(request, response);
});
exports.default = router;
//# sourceMappingURL=Auth.js.map