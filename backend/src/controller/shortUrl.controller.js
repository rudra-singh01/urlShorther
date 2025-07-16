import { CreateShortUrlServiceWithOutUser, CreateShortUrlServiceWithUser } from "../service/shortUrl.service.js";
import { getShortUrl } from "../dao/ShortUrl.js";
import wrapAsync from "../utils/tryCatchWrapper.js";

export const createShortUrl = wrapAsync(async (req, res, next) => { 

    const data = req.body;
    // console.log(data , "the data");
    let shortUrl ;

    
    if(req.user){
        shortUrl = await CreateShortUrlServiceWithUser(data.url ,req.user.id , data.slug);
       
    }else{
        shortUrl = await CreateShortUrlServiceWithOutUser(data.url);
        
    }
    res.status(200).json({ shortUrl });

})

export const RedirectToUrlController = wrapAsync(async (req, res, next) => {

    const shortUrl = await getShortUrl(req.params.id);
    if (!shortUrl) {
        throw new NotFoundError("URL not found");
    }
    res.redirect(shortUrl.full_url);

})


