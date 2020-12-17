"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const express_session_1 = __importDefault(require("express-session"));
const connect_mongodb_session_1 = __importDefault(require("connect-mongodb-session"));
const Auth_1 = __importDefault(require("./Routes/Auth/Auth"));
const ShipmentOrder_1 = __importDefault(require("./Routes/ShipmentOrder/ShipmentOrder"));
dotenv_1.default.config();
const app = express_1.default();
const origin = {
    dev: "http://localhost:3000",
    prod: "",
};
//=======================================================MIDDLWARE SETUP================================================
app.use(cors_1.default({
    origin: process.env.NODE_ENV === "production" ? origin.prod : origin.dev,
    credentials: true,
}));
const store = connect_mongodb_session_1.default(express_session_1.default);
const mongoURI = process.env.mongoURI;
const mongoStore = new store({
    collection: "usersessions",
    uri: mongoURI,
    expires: 10 * 60 * 60 * 24 * 1000,
});
app.use(express_session_1.default({
    name: "_sid",
    secret: process.env.session_secret,
    resave: false,
    saveUninitialized: false,
    store: mongoStore,
    cookie: {
        httpOnly: true,
        maxAge: 10 * 60 * 60 * 24 * 1000,
        secure: process.env.NODE_ENV === "production",
    },
}));
//==================================================MongoDB Connection & Configs========================================
const connectionOptions = {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
};
mongoose_1.default.connect(mongoURI, connectionOptions, (error) => {
    if (error) {
        return console.error(error);
    }
    console.log("Connection to MongoDB was successful");
});
//==========================================================Server EndPoints============================================
app.use(Auth_1.default);
app.use(ShipmentOrder_1.default);
//=================================================Server Configs & Connection==========================================
const PORT = process.env.NODE_ENV || 5000;
app.listen(PORT, () => {
    console.log(`Server started on PORT ${PORT}`);
});
//# sourceMappingURL=server.js.map