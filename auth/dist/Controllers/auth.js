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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Signin = exports.Signup = void 0;
exports.Update = Update;
exports.checkAndRefreshToken = checkAndRefreshToken;
exports.refreshToken = refreshToken;
exports.getUser = getUser;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const index_1 = require("../index");
const uuid_1 = require("uuid");
const googleapis_1 = require("googleapis");
const Signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { Email, Password, ConfirmPassword, Name } = req.body;
    console.log(req.body);
    if (!Email || !Password || !ConfirmPassword || !Name) {
        console.log(!Email || !Password || !ConfirmPassword || !Name);
        return res.status(400).json({ message: 'Invalid Inputs' });
    }
    if (Password !== ConfirmPassword) {
        return res.status(400).json({ message: "Password doesn't match" });
    }
    try {
        const existingUser = yield index_1.prisma.user.findFirst({
            where: {
                email: Email
            }
        });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const userId = (0, uuid_1.v4)();
        if (!process.env.JWT_SECRET) {
            return res.status(500).json({ message: 'JWT Secret is not defined' });
        }
        const jwt_token = jsonwebtoken_1.default.sign({ _id: userId, email: Email }, process.env.JWT_SECRET);
        bcrypt_1.default.genSalt(10, function (err, salt) {
            bcrypt_1.default.hash(Password, salt, function (err, hash) {
                return __awaiter(this, void 0, void 0, function* () {
                    if (err) {
                        return res.status(500).json({ message: 'Error hashing password' });
                    }
                    const register_user = yield index_1.prisma.user.create({
                        data: {
                            id: userId,
                            email: Email,
                            password: hash,
                            name: Name,
                            jwtToken: jwt_token,
                        }, select: {
                            id: true,
                            name: true, jwtToken: true
                        }
                    });
                    return res.status(200).cookie('token', jwt_token, {
                        httpOnly: true,
                        secure: false,
                        sameSite: 'lax',
                        expires: new Date(Date.now() + 60 * 60 * 1000),
                    }).json({ message: 'User Registered and Logged in', user: register_user });
                });
            });
            if (err) {
                return res.status(500).json({ message: 'Error hashing password' });
            }
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Something went wrong', error: error });
    }
});
exports.Signup = Signup;
const Signin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { Email, Password } = req.body;
    console.log(Email);
    console.log(Password);
    if (!Email || !Password) {
        return res.status(400).json({ message: 'Invalid Inputs' });
    }
    try {
        const user = yield index_1.prisma.user.findFirst({
            where: {
                email: Email
            }, select: {
                id: true,
                email: true, jwtToken: true,
                password: true
            }
        });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const passwordMatch = yield bcrypt_1.default.compare(Password, user.password);
        if (!passwordMatch) {
            return res.status(400).json({ message: 'Invalid password' });
        }
        if (!process.env.JWT_SECRET) {
            return res.status(500).json({ message: 'JWT Secret is not defined' });
        }
        let jwtToken = user.jwtToken;
        if (!jwtToken) {
            jwtToken = jsonwebtoken_1.default.sign({ _id: user.id, email: user.email }, process.env.JWT_SECRET);
            const updatedUser = yield index_1.prisma.user.update({
                where: { id: user.id },
                data: { jwtToken },
            });
            if (!updatedUser) {
                return res.status(500).json({ message: 'Failed to update user token' });
            }
        }
        const { password } = user, userData = __rest(user, ["password"]);
        console.log(jwtToken);
        return res
            .status(200)
            .cookie('token', jwtToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            expires: new Date(Date.now() + 60 * 60 * 1000),
        })
            .json({ message: 'User Logged In', user: userData });
    }
    catch (error) {
        console.error('Error during signin:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});
exports.Signin = Signin;
function Update(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { access_token, refresh_token, expiry_date } = req.body;
        try {
            const { _id } = req.user;
            const upd = yield index_1.prisma.user.update({
                where: { id: _id },
                data: {
                    accessToken: access_token,
                    refreshToken: refresh_token,
                    tokenExpiry: expiry_date ? new Date(expiry_date * 1000) : null
                },
            });
            console.log(upd);
            if (!upd) {
                return res.status(500).json({ message: 'Failed to update user token' });
            }
            return res.status(200).json({ message: 'User Authenticated' });
        }
        catch (err) {
            console.error(err);
            res.status(500).send('Error handling OAuth callback.');
        }
    });
}
function checkAndRefreshToken(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { userId } = req.params;
            const user = yield index_1.prisma.user.findUnique({
                where: { id: userId },
            });
            if (!user || !user.accessToken || !user.refreshToken) {
                return res.status(400).send('User does not have valid tokens.');
            }
            const currentDate = new Date().getTime();
            const tokenExpiryDate = user.tokenExpiry ? new Date(user.tokenExpiry).getTime() : 0;
            if (currentDate >= tokenExpiryDate - 5 * 60 * 1000) {
                const { message, success, accessToken } = yield refreshToken({ userId: userId, refreshToken: user.refreshToken, userEmail: user.email });
                if (!success) {
                    return res.status(400).json({ message, success: false });
                }
                return res.json({ success: true, message, accessToken });
            }
            else {
                return res.json({ message: "Access Token is valid", success: true, accessToken: user.accessToken });
            }
        }
        catch (error) {
            return res.status(500).send('Error handling refresh token.');
        }
    });
}
function refreshToken(_a) {
    return __awaiter(this, arguments, void 0, function* ({ userId, refreshToken, userEmail }) {
        try {
            const oAuth2Client = new googleapis_1.google.auth.OAuth2({ clientId: process.env.GOOGLE_CLIENT_ID, clientSecret: process.env.GOOGLE_CLIENT_SECRET, redirectUri: process.env.GOOGLE_REDIRECT_URI });
            oAuth2Client.setCredentials({
                refresh_token: refreshToken,
            });
            const { credentials: tokens } = yield oAuth2Client.refreshAccessToken();
            console.log(tokens);
            const res = yield index_1.prisma.user.update({
                where: { id: userId },
                data: {
                    accessToken: tokens.access_token,
                    tokenExpiry: tokens.expiry_date ? new Date(tokens.expiry_date) : null,
                    refreshToken: tokens.refresh_token
                },
            });
            if (!res) {
                return {
                    message: "Unable to store the new access token",
                    success: false,
                };
            }
            return {
                message: "Access token refreshed successfully",
                success: true,
                accessToken: tokens.access_token,
            };
        }
        catch (err) {
            console.error(err);
            return {
                message: "Error refreshing token",
                success: false,
            };
        }
    });
}
function getUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { _id } = req.user;
        const user = yield index_1.prisma.user.findUnique({
            where: { id: _id }, select: {
                id: true,
                email: true,
                jwtToken: true
            }
        });
        if (!user)
            return;
        return res.status(201).json(user);
    });
}
//get access token 
