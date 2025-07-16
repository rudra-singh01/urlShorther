import { nanoid } from "nanoid";
import { generateNanoId } from "../utils/helper.js";
import { checkCustomSlug, saveShortUrl } from "../dao/ShortUrl.js";

export const CreateShortUrlServiceWithOutUser = async (url) => {
    try {
        const shortUrl = generateNanoId(7);
        await saveShortUrl(shortUrl , url);
        return (process.env.APP_URL + shortUrl);
    } catch (error) {
        throw new Error(error);
    }
}

export const CreateShortUrlServiceWithUser = async (url , userid , slug = null) => {
    const shortUrl = slug || generateNanoId(7);
    const exist = await checkCustomSlug(slug);
    if(exist){
        throw new Error("this custom url is  already exists");
    }
    await saveShortUrl(shortUrl , url , userid);
    return (process.env.APP_URL + shortUrl);
}
