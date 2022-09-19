export const port = process.env.PORT || 3002 || 3003

const trustOrigins = [
  process.env.FE_DEV_TRUST_BACKEND_URL,
  process.env.FE_PROD_TRUST_BACKEND_URL
];

export const corsConfig = {
  origin: function (origin, callback) {
    if (!origin || trustOrigins.includes(origin)) {
      callback(null, true);
      
    } else {
      console.log("Cros origin issues")
      callback(new Error("Origin not allowed"));
    }
  },
  credentials: true,
};