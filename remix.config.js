// remix.config.ts
const config = {
    mode: process.env.NODE_ENV || 'development',
    databaseUrl: process.env.DATABASE_URL,  
    publicApiKey: process.env.PUBLIC_API_KEY,

    imgBaseURL: process.env.IMG_BASE_URL,
    apiBaseURL: process.env.API_BASE_URL,
    RECAPTCHA_SECRET_KEY: process.env.RECAPTCHA_SECRET_KEY,
    RECAPTCHA_SITE_KEY: process.env.RECAPTCHA_SITE_KEY,
};

export default config;
