"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supabase_js_1 = require("@supabase/supabase-js");
const config_1 = __importDefault(require("../../config"));
const supabase = (0, supabase_js_1.createClient)(config_1.default.supabase_bucket_url, config_1.default.supabase_bucket_key);
exports.default = supabase;
