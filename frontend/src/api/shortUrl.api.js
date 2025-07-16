import axiosInstance from "../utils/axiosInatance";

export const createShortUrl = async (url , slug) => {
    const response = await axiosInstance.post('api/create', {url , slug})
    return response
}