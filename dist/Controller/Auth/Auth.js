"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const formidable_1 = require("formidable");
const Users_1 = require("../../Model/Users/Users");
const Session_1 = require("../../Model/userSessions/Session");
const bcrypt_1 = __importDefault(require("bcrypt"));
class AuthController {
    SignUp(request, response) {
        const form = new formidable_1.IncomingForm();
        const user_role = request.params.user_role;
        try {
            form.parse(request, (error, fields) => __awaiter(this, void 0, void 0, function* () {
                if (error) {
                    return response.status(500).json({
                        msg: "Network Error: Failed to sign user up try agin later",
                    });
                }
                const { username, password, email } = fields;
                if (!username || !password || !email) {
                    return response
                        .status(400)
                        .json({ msg: "All fields are required to SignUp" });
                }
                if (password.length < 6) {
                    return response
                        .status(400)
                        .json({ msg: "Password has to be at least 6 characters long" });
                }
                const isUsernameExisting = yield Users_1.userModel.findOne({
                    username: username,
                });
                if (isUsernameExisting) {
                    return response
                        .status(400)
                        .json({ msg: "Account with this username already exist" });
                }
                const isEmailExisting = yield Users_1.userModel.findOne({ email: email });
                if (isEmailExisting) {
                    return response
                        .status(400)
                        .json({ msg: "Account with this email already exist " });
                }
                const salt = yield bcrypt_1.default.genSalt(15);
                const hashedPassword = yield bcrypt_1.default.hash(password, salt);
                const newUser = new Users_1.userModel({
                    username: username,
                    email: email,
                    password: hashedPassword,
                    role: user_role,
                });
                const savedUser = newUser.save();
                return response
                    .status(201)
                    .json({ msg: "Account has been created successfully login" });
            }));
        }
        catch (error) {
            return response
                .status(500)
                .json({ msg: "Network Error: Failed to SignUp user try again later" });
        }
    }
    SignIn(request, response) {
        const form = new formidable_1.IncomingForm();
        try {
            form.parse(request, (error, fields) => __awaiter(this, void 0, void 0, function* () {
                if (error) {
                    return response.status(500).json({
                        msg: "Network Error: Failed to SignIn user try again later",
                    });
                }
                const { username, password } = fields;
                if (!username || !password) {
                    return response
                        .status(400)
                        .json({ msg: "All fields are required to SignIn" });
                }
                const user = yield Users_1.userModel.findOne({
                    username: username,
                });
                if (!username) {
                    return response
                        .status(404)
                        .json({ msg: "Account with this username does not exist" });
                }
                const hashedPassword = user.password;
                const isPasswordValid = yield bcrypt_1.default.compare(password, hashedPassword);
                if (!isPasswordValid) {
                    return response.status(400).json({ msg: "Invalid Crendentials" });
                }
                const isUserSessionActive = yield Session_1.sessionModel.findOne({
                    "session.user._id": user._id,
                });
                if (isUserSessionActive) {
                    return response.status(200).json({ msg: "Already Signed in" });
                }
                const userSessionObj = {
                    _id: user._id,
                    username: user.username,
                    email: user.email,
                    user_role: user.role,
                };
                request.session.user = userSessionObj;
                response.status(200).send(request.sessionID);
            }));
        }
        catch (error) {
            return response
                .status(500)
                .json({ msg: "Network Error: Failed to SignIn user try again later" });
        }
    }
    LogOut(request, response) {
        const userSession = request.session.user;
        try {
            if (userSession) {
                request.session.destroy();
                return response.status(200).json({ msg: "Logged Out" });
            }
            return response.status(400).json({ msg: "Account is not logged in" });
        }
        catch (error) {
            return response
                .status(500)
                .json({ msg: "Network Error: Failed to SignIn user try again later" });
        }
    }
    isLoggedIn(request, response) {
        const userSession = request.session.user;
        try {
            if (!userSession) {
                return response.status(200).json({ auth_status: false });
            }
            return response
                .status(200)
                .json({ auth_status: true, user_role: userSession.user_role });
        }
        catch (error) {
            return response
                .status(500)
                .json({ msg: "Network Error: Failed to SignIn user try again later" });
        }
    }
}
exports.default = AuthController;
//# sourceMappingURL=Auth.js.map