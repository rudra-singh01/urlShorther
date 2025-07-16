import axiosInstance from "../utils/axiosInatance";

export const Login = async (email , password) => {
    const response = await axiosInstance.post('api/user/login', {email , password})
    return response
}

export const register =  async ( name , email , password ) => {
    console.log(name , email , password);
    
    const response = await axiosInstance.post('api/user/signup', {name , email , password})
    return response
}
export const logout =  async () => {
    const response = await axiosInstance.post('api/user/logout')
    return response
}

export const getCurrentUser = async()=>{
    const {data} = await axiosInstance.get('api/user/me');
    return data;
}

export const getAllUserUrls = async()=>{
    const {data} = await axiosInstance.post('api/user-url/urls');
    return data;
}