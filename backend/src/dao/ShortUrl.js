import ShortUrlSchema from "../modal/shorturl.modal.js";
import { ConflictError } from "../utils/errorHandler.js";

export const saveShortUrl = async (short_url, full_url , userid) => {
    console.log(short_url, full_url, userid);
    
    try {
        const newUrl = await ShortUrlSchema.create({full_url: full_url, short_url: short_url});

        if(userid){
            newUrl.user = userid;   
        }

        newUrl.save();
    } catch (error) {
        if(error.code === 11000){   
            throw new ConflictError("Short URL already exists");
        }
        throw new Error(error);
    }
}


export const getShortUrl = async (short_url) => {
    try {
        const shortUrl = await ShortUrlSchema.findOneAndUpdate({ short_url: short_url }, { $inc: { clicks: 1 }});
        return shortUrl;
    } catch (error) {
        throw error;
    }
}


export const checkCustomSlug = async (slug) => {
    try {
        const isUrlExisted = await ShortUrlSchema.findOne({ short_url:  slug });
        return isUrlExisted ;
    } catch (error) {
        throw error;
    }
}