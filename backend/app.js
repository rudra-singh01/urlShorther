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

// CORS configuration for both development and production
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'https://url-shorther-zjxm.vercel.app',
      'http://localhost:5173',  
      process.env.FRONTEND_URL
    ].filter(Boolean); // Remove undefined values
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
  exposedHeaders: ['Set-Cookie']
};

app.use(cors(corsOptions));
app.use(attchUser);
app.use("/api/create", shortUrlRoute);
app.use("/api/user", userRoute);
app.use("/api/user-url", userUrlsRoute);
app.get("/:id", RedirectToUrlController);

app.use(errorHandler);  
app.listen(3000, () => {
  fileCabanate();
  console.log("Server is running on port 3000");
});
