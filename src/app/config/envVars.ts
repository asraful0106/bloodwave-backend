import dotenv from "dotenv";

dotenv.config();

interface IEnvConfig {
  PORT: string;
  DB_URL: string;
  NODE_ENV: "Development" | "Production";
  BCRYPT_SALT_ROUND: string;
  // Super Admin
  SUPER_ADMIN: string;
  SUPER_ADMIN_EMAIL: string;
  SUPER_ADMIN_PASSWORD: string;
  // JWT
  JWT_SECRET: string;
  JWT_ACCESS_EXPIRES: string;
  JWT_REFRESH_SECRET: string;
  JWT_REFRESH_EXPIRES: string;
  // // Express session
  // EXPRESS_SESSION_SECRET: string;
  // // Storage Provider
  // PROVIDER: "S3" | "LOCAL" | "CLOUDINARY";
  // // SSL
  // SSL: {
  //   SSL_STORE_ID: string;
  //   SSL_STORE_PASS: string;
  //   SSL_PAYMENT_API: string;
  //   SSL_VALIDATION_API: string;
  //   SSL_SUCCESS_BACKEND_URL: string;
  //   SSL_FAIL_BACKEND_URL: string;
  //   SSL_CANCEL_BACKEND_URL: string;
  //   SSL_SUCCESS_FRONTEND_URL: string;
  //   SSL_FAIL_FRONTEND_URL: string;
  //   SSL_CANCEL_FRONTEND_URL: string;
  // };
}

const loadEnvVariables = (): IEnvConfig => {
  const requiredEnvVariable: string[] = [
    "PORT",
    "DB_URL",
    "NODE_ENV",
    "BCRYPT_SALT_ROUND",
    // Super Admin
    "SUPER_ADMIN",
    "SUPER_ADMIN_EMAIL",
    "SUPER_ADMIN_PASSWORD",
    // JWT
    "JWT_SECRET",
    "JWT_ACCESS_EXPIRES",
    "JWT_REFRESH_SECRET",
    "JWT_REFRESH_EXPIRES",
    // // Express session
    // "EXPRESS_SESSION_SECRET",
    // // Storage Provider
    // "PROVIDER",
    // "SSL_STORE_ID",
    // "SSL_STORE_PASS",
    // "SSL_PAYMENT_API",
    // "SSL_VALIDATION_API",
    // "SSL_SUCCESS_BACKEND_URL",
    // "SSL_FAIL_BACKEND_URL",
    // "SSL_CANCEL_BACKEND_URL",
    // "SSL_SUCCESS_FRONTEND_URL",
    // "SSL_FAIL_FRONTEND_URL",
    // "SSL_CANCEL_FRONTEND_URL",
  ];
  requiredEnvVariable.forEach((key) => {
    if (!process.env[key]) {
      throw new Error(`Missinng required environment variable ${key}`);
    }
  });
  return {
    PORT: process.env.PORT as string,
    DB_URL: process.env.DB_URL as string,
    NODE_ENV: process.env.NODE_ENV as "Development" | "Production",
    BCRYPT_SALT_ROUND: process.env.BCRYPT_SALT_ROUND as string,
    // Super Admin
    SUPER_ADMIN: process.env.SUPER_ADMIN as string,
    SUPER_ADMIN_EMAIL: process.env.SUPER_ADMIN_EMAIL as string,
    SUPER_ADMIN_PASSWORD: process.env.SUPER_ADMIN_PASSWORD as string,
    // JWT
    JWT_SECRET: process.env.JWT_SECRET as string,
    JWT_ACCESS_EXPIRES: process.env.JWT_ACCESS_EXPIRES as string,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET as string,
    JWT_REFRESH_EXPIRES: process.env.JWT_REFRESH_EXPIRES as string,
    // // Express session
    // EXPRESS_SESSION_SECRET: process.env.EXPRESS_SESSION_SECRET as string,
    // // Storage Provider
    // PROVIDER: process.env.PROVIDER as "S3" | "LOCAL" | "CLOUDINARY",
    // SSL: {
    //   SSL_STORE_ID: process.env.SSL_STORE_ID as string,
    //   SSL_STORE_PASS: process.env.SSL_STORE_PASS as string,
    //   SSL_PAYMENT_API: process.env.SSL_PAYMENT_API as string,
    //   SSL_VALIDATION_API: process.env.SSL_VALIDATION_API as string,
    //   SSL_SUCCESS_BACKEND_URL: process.env.SSL_SUCCESS_BACKEND_URL as string,
    //   SSL_FAIL_BACKEND_URL: process.env.SSL_FAIL_BACKEND_URL as string,
    //   SSL_CANCEL_BACKEND_URL: process.env.SSL_CANCEL_BACKEND_URL as string,
    //   SSL_SUCCESS_FRONTEND_URL: process.env.SSL_SUCCESS_FRONTEND_URL as string,
    //   SSL_FAIL_FRONTEND_URL: process.env.SSL_FAIL_FRONTEND_URL as string,
    //   SSL_CANCEL_FRONTEND_URL: process.env.SSL_CANCEL_FRONTEND_URL as string,
    // },
  };
};

export const envVars = loadEnvVariables();
