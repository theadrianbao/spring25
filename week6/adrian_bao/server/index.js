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
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var http_1 = require("http");
var path_1 = require("path");
var socket_io_1 = require("socket.io");
var sqlite3 = require("sqlite3");
var sqlite_1 = require("sqlite");
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var db, app, server, io, port;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, sqlite_1.open)({
                        filename: './chat.db',
                        driver: sqlite3.Database,
                    })];
                case 1:
                    db = _a.sent();
                    return [4 /*yield*/, db.exec("\n    CREATE TABLE IF NOT EXISTS messages (\n      id INTEGER PRIMARY KEY AUTOINCREMENT,\n      client_offset TEXT UNIQUE,\n      content TEXT\n    );\n  ")];
                case 2:
                    _a.sent();
                    app = express();
                    server = (0, http_1.createServer)(app);
                    io = new socket_io_1.Server(server, {
                        connectionStateRecovery: {},
                        cors: { origin: '*' }
                    });
                    app.use(express.static((0, path_1.join)(__dirname, 'public')));
                    io.on('connection', function (socket) { return __awaiter(_this, void 0, void 0, function () {
                        var _this = this;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    socket.on('chat message', function (msg, clientOffset, callback) { return __awaiter(_this, void 0, void 0, function () {
                                        var result, e_1;
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0:
                                                    _a.trys.push([0, 2, , 3]);
                                                    return [4 /*yield*/, db.run('INSERT INTO messages (content, client_offset) VALUES (?, ?)', msg, clientOffset)];
                                                case 1:
                                                    result = _a.sent();
                                                    return [3 /*break*/, 3];
                                                case 2:
                                                    e_1 = _a.sent();
                                                    if (e_1.errno === 19) {
                                                        callback();
                                                    }
                                                    return [2 /*return*/];
                                                case 3:
                                                    io.emit('chat message', msg, result.lastID);
                                                    callback();
                                                    return [2 /*return*/];
                                            }
                                        });
                                    }); });
                                    if (!!socket.recovered) return [3 /*break*/, 2];
                                    return [4 /*yield*/, db.each('SELECT id, content FROM messages WHERE id > ?', [socket.handshake.auth.serverOffset || 0], function (_err, row) {
                                            socket.emit('chat message', row.content, row.id);
                                        })];
                                case 1:
                                    _a.sent();
                                    _a.label = 2;
                                case 2: return [2 /*return*/];
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
