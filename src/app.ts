import express, {
  type Application,
  type Request,
  type Response,
} from "express";
// import cookieParser from "cookie-parser";
// import cors from "cors";
import notFound from "./app/middlewares/notFound.js";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler.js";
// import expressSession from "express-session";
// import { envVars } from "./app/config/env.js";
import passport from "passport";
import { configurePassport } from "./app/config/passport.js";
import router from "./app/routes/index.js";

const app: Application = express();

// ✅ Open CORS for SSLCommerz POST callbacks (before global CORS)
// app.use("/api/v1/payment/success", cors({ origin: "*" }));
// app.use("/api/v1/payment/fail", cors({ origin: "*" }));
// app.use("/api/v1/payment/cancel", cors({ origin: "*" }));

// // CORS configuration
// const corsOptions = {
//   origin: (
//     origin: string | undefined,
//     callback: (err: Error | null, allow?: boolean) => void,
//   ) => {
//     // console.log("Incoming origin:", origin); // This line to see the req origin

//     const allowedOrigins = [
//       "http://127.0.0.1:5500",
//       "http://127.0.0.1:5501",
//       "http://localhost:5500",
//       "http://localhost:5501",
//     ];

//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else if (
//       !origin ||
//       origin === "null" ||
//       allowedOrigins.includes(origin)
//     ) {
//       callback(null, true);
//     } else {
//       callback(new Error("Not allowed by CORS"));
//     }
//   },
//   credentials: true,
// };

// // For allowing frontend to access backend
// app.use(cors(corsOptions));

// // Passport auth middleware
// app.use(
//   expressSession({
//     secret: envVars.EXPRESS_SESSION_SECRET,
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//       httpOnly: true,
//       secure: false,
//       sameSite: "lax",
//       maxAge: 24 * 60 * 60 * 1000,
//     },
//   }),
// );


configurePassport();
app.use(passport.initialize());
app.use(passport.session());

// For accessing the cookie
// app.use(cookieParser());
// For json data
app.use(express.json());
// For url encoded data
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.send("Server is running");
});

// Route start with "api/v1"
app.use("/api/v1/", router);

// Middlewares
app.use(notFound);
app.use(globalErrorHandler);

export default app;
