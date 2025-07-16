import express from "express";
import { nanoid } from "nanoid";
import fileCabanate from "./src/config/mongo.config.js";
import ShortUrlSchema from "./src/modal/shorturl.modal.js";
import shortUrlRoute from "./src/routes/shortUrl.route.js";
import { RedirectToUrlController } from "./src/controller/shortUrl.controller.js";
import dotenv from "dotenv";
import { errorHandler } from "./src/utils/errorHandler.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRoute from "./src/routes/user.route.js";
import { attchUser } from "./src/utils/attachUser.js";
import userUrlsRoute from "./src/routes/user-url.route.js";
dotenv.config("./.env");


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(attchUser)
app.use("/api/create", shortUrlRoute);
app.use("/api/user", userRoute);
app.use("/api/user-url", userUrlsRoute);
app.get("/:id" , RedirectToUrlController);

app.use(errorHandler);  
app.listen(3000, () => {
  fileCabanate();
  console.log("Server is running on port 3000");
});
