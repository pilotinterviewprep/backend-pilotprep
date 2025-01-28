"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validDateChecker = void 0;
const http_status_1 = __importDefault(require("http-status"));
const api_error_1 = __importDefault(require("../error/api-error"));
const validDateChecker = (date, key) => {
    const regex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
    if (!regex.test(date)) {
        throw new api_error_1.default(http_status_1.default.BAD_REQUEST, `${key} is not a valid date. Valid format is YYYY-MM-DD`);
    }
    let valid_date = new Date(date);
    if (key === "fromDate") {
        valid_date = new Date(`${date}T00:00:00Z`);
    }
    if (key === "toDate") {
        valid_date = new Date(`${date}T23:59:59Z`);
    }
    return valid_date;
};
exports.validDateChecker = validDateChecker;
