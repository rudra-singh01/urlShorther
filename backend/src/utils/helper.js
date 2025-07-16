import { nanoid } from "nanoid";
import jwt from "jsonwebtoken";
// import { cookiesOptions } from "../config/config.js";

export const generateNanoId = (length) => {
    return nanoid(length);
}

export const signupToken = (payload)=>{
    return jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: "6h"});
}

export const verifyToken = (token)=>{
    return jwt.verify(token, process.env.JWT_SECRET);
}