import { userSignUpService, userLoginService } from "../service/user.service.js";
import  wrapAsync  from "../utils/tryCatchWrapper.js";
import { cookiesOptions } from "../config/config.js";

export const signupController = wrapAsync (async (req, res) => {
    const {name, email, password} = req.body;
    // console.log(name, email, password); 
    const newUser = await userSignUpService(name, email, password );
    req.user = newUser.user;
    res.cookie("access_token", newUser.token, cookiesOptions);
    res.status(201).json({message:"User created successfully" , user: newUser.user , token: newUser.token});
})

export const loginController = wrapAsync (async (req, res) => {
    const {email, password} = req.body;
    const loggedInUser = await userLoginService(email, password);
    req.user = loggedInUser.user;
    // console.log(req.user);
    res.cookie("access_token", loggedInUser.token, cookiesOptions);
    res.status(200).json({message:"User logged in successfully" ,  user: loggedInUser.user , token: loggedInUser.token});
})

export const logOutController = wrapAsync(async(req , res)=>{
    res.clearCookie("access_token" , cookiesOptions);
    res.status(200).json({message:"User logged out successfully"});
})

export const get_current_user_controller = wrapAsync(async(req , res)=>{
    res.status(200).json({user: req.user});
})