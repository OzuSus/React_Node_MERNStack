import { rateLimit } from 'express-rate-limit'

export const limiter = rateLimit({
    windowMs: 15*60*1000,
    max: 100,
    message: "Qua nhieu request!, vui long thu lai sau"
});