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
const prisma_1 = __importDefault(require("../shared/prisma"));
const oldOTPCleaner = () => __awaiter(void 0, void 0, void 0, function* () {
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
    try {
        const deletedOtps = yield prisma_1.default.oTP.deleteMany({
            where: {
                created_at: {
                    lt: tenMinutesAgo,
                },
            },
        });
        console.log(`${deletedOtps.count} old OTPs deleted`);
    }
    catch (error) {
        console.error("Error deleting old OTPs:", error);
    }
});
exports.default = oldOTPCleaner;
