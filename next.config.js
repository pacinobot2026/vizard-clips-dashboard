module.exports = {
  reactStrictMode: true,
  env: {
    DASHBOARD_PASSWORD: process.env.DASHBOARD_PASSWORD,
    VIMEO_ACCESS_TOKEN: process.env.VIMEO_ACCESS_TOKEN,
    VIMEO_USER_ID: process.env.VIMEO_USER_ID,
    VIZARD_API_KEY: process.env.VIZARD_API_KEY,
    POSTBRIDGE_API_KEY: process.env.POSTBRIDGE_API_KEY,
    SESSION_SECRET: process.env.SESSION_SECRET
  }
};
