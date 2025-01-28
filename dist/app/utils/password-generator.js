"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = passwordGenerator;
function passwordGenerator(length = 6) {
    const letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";
    let password = "";
    for (let i = 0; i < Math.ceil(length / 2); i++) {
        const randomIndex = Math.floor(Math.random() * letters.length);
        password += letters[randomIndex];
        for (let i = 0; i < 1; i++) {
            const randomIndex = Math.floor(Math.random() * numbers.length);
            password += numbers[randomIndex];
        }
    }
    return password;
}
