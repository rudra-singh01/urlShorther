import {findUserById } from "../dao/user.dao.js";
// import ShortUrlSchema from "../modal/shorturl.modal.js";
import { verifyToken } from "./helper.js";

export const attchUser = async(req,res,next)=>{
    // console.log(req.cookies);
    
    const token = req.cookies.access_token;
    console.log(token , "the token");
    if (!token) return next()
    try {
        const decoded = verifyToken(token);
        const user = await findUserById(decoded.id);
        // console.log(user , "the user");
        
        if(!user) return next()
        req.user = user;
    // console.log(req.user , "the user");
    
        next();
    } catch (error) {
        next()
    }
}