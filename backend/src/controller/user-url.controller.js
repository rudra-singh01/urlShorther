import { getUserAllUrls } from "../dao/user.dao.js";
import wrapAsync from "../utils/tryCatchWrapper.js";

export const getUrls =  wrapAsync(async(req,res)=>{
    // console.log(req.user)
    const {_id} = req.user;
    const urls = await getUserAllUrls(_id.toString());
    console.log(urls)
    res.status(200).json({message:"all Urls feathed successfully" , urls});
})