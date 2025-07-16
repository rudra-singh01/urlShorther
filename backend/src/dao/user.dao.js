import UserModal from "../modal/user.modal.js";
import UrlModel from "../modal/shorturl.modal.js";

export const findUserByEmail = async (email) => {
    const user = await UserModal.findOne({email});
    return user;
}


export const findUserById = async (id) => {
    const user = await UserModal.findById(id);
    return user;
}

export const createUser = async ({name, email, password}) => {
    const user = await UserModal.create({name, email, password});
    return user;
}

export const getUserAllUrls = async (id) => {
   return await UrlModel.find({user:id});
   
}