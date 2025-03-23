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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv = require("dotenv");
var express = require("express");
var http_1 = require("http");
var path_1 = require("path");
var socket_io_1 = require("socket.io");
var mongodb_1 = require("mongodb");
dotenv.config();
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var uri, mongoDBClient, chatAppDB, messagesCollection, app, server, io, port;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    uri = process.env.MONGODB_URI;
                    mongoDBClient = new mongodb_1.MongoClient(uri, {
                        serverApi: {
                            version: mongodb_1.ServerApiVersion.v1,
                            strict: true,
                            deprecationErrors: true,
                        }
                    });
                    return [4 /*yield*/, mongoDBClient.connect()];
                case 1:
                    _a.sent();
                    chatAppDB = mongoDBClient.db('chat_app');
                    messagesCollection = chatAppDB.collection('messages');
                    app = express();
                    server = (0, http_1.createServer)(app);
                    io = new socket_io_1.Server(server, {
                        connectionStateRecovery: {},
                        cors: { origin: '*' }
                    });
                    app.use(express.static((0, path_1.join)(__dirname, 'public')));
                    io.on('connection', function (socket) { return __awaiter(_this, void 0, void 0, function () {
                        var serverOffset, query, cursor, _a, cursor_1, cursor_1_1, doc, e_1_1;
                        var _this = this;
                        var _b, e_1, _c, _d;
                        return __generator(this, function (_e) {
                            switch (_e.label) {
                                case 0:
                                    socket.on('chat message', function (msg, clientOffset, callback) { return __awaiter(_this, void 0, void 0, function () {
                                        var result, insertResult, e_2;
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0:
                                                    _a.trys.push([0, 2, , 3]);
                                                    return [4 /*yield*/, messagesCollection.insertOne({
                                                            content: msg,
                                                            client_offset: clientOffset,
                                                        })];
                                                case 1:
                                                    insertResult = _a.sent();
                                                    result = insertResult;
                                                    return [3 /*break*/, 3];
                                                case 2:
                                                    e_2 = _a.sent();
                                                    if (e_2 instanceof Error && e_2.code === 11000) {
                                                        callback();
                                                    }
                                                    return [2 /*return*/];
                                                case 3:
                                                    io.emit('chat message', msg, result.insertedId.toString());
                                                    callback();
                                                    return [2 /*return*/];
                                            }
                                        });
                                    }); });
                                    if (!!socket.recovered) return [3 /*break*/, 12];
                                    serverOffset = socket.handshake.auth.serverOffset;
                                    query = serverOffset
                                        ? { _id: { $gt: new mongodb_1.ObjectId(serverOffset) } }
                                        : {};
                                    cursor = messagesCollection.find(query).sort({ _id: 1 });
                                    _e.label = 1;
                                case 1:
                                    _e.trys.push([1, 6, 7, 12]);
                                    _a = true, cursor_1 = __asyncValues(cursor);
                                    _e.label = 2;
                                case 2: return [4 /*yield*/, cursor_1.next()];
                                case 3:
                                    if (!(cursor_1_1 = _e.sent(), _b = cursor_1_1.done, !_b)) return [3 /*break*/, 5];
                                    _d = cursor_1_1.value;
                                    _a = false;
                                    doc = _d;
                                    socket.emit('chat message', doc.content, doc._id.toString());
                                    _e.label = 4;
                                case 4:
                                    _a = true;
                                    return [3 /*break*/, 2];
                                case 5: return [3 /*break*/, 12];
                                case 6:
                                    e_1_1 = _e.sent();
                                    e_1 = { error: e_1_1 };
                                    return [3 /*break*/, 12];
                                case 7:
                                    _e.trys.push([7, , 10, 11]);
                                    if (!(!_a && !_b && (_c = cursor_1.return))) return [3 /*break*/, 9];
                                    return [4 /*yield*/, _c.call(cursor_1)];
                                case 8:
                                    _e.sent();
                                    _e.label = 9;
                                case 9: return [3 /*break*/, 11];
                                case 10:
                                    if (e_1) throw e_1.error;
                                    return [7 /*endfinally*/];
                                case 11: return [7 /*endfinally*/];
                                case 12: return [2 /*return*/];
                            }
                        });
                    }); });
                    port = 4000;
                    server.listen(port, function () {
                        console.log("Server running at http://localhost:".concat(port));
                    });
                    return [2 /*return*/];
            }
        });
    });
}
main();
