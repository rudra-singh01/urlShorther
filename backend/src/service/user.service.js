import UserModal from "../modal/user.modal.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { findUserByEmail, createUser } from "../dao/user.dao.js";
import { ConflictError } from "../utils/errorHandler.js";
import { signupToken } from "../utils/helper.js";

export const userSignUpService = async (name, email, password) => {
    // console.log(name , email , password);
  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    throw new ConflictError("User already exists");
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await createUser({name, email, password:hashedPassword});
  const token = await signupToken({id:user._id});    
  return {user, token};  
};

export const userLoginService = async (email, password) => {
  const user = await findUserByEmail(email);
  if (!user) {
    throw new Error("User not found");
  }
  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    throw new Error("Invalid password");
  }
  const token = await signupToken({id:user._id});
  
  // Convert to plain object and remove password
  const userResponse = user.toObject();
  delete userResponse.password;
  
  return {user: userResponse, token};
};
