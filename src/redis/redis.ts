import connectRedis from 'connect-redis';
import * as redis from 'redis';
import session from 'express-session'

const redisClient = redis.createClient({ 
    url: "redis://redis:6379", 
    password: "oasis-redis-password-which-is-supposed-to-be-32-char",
    legacyMode: true,
 });
(async () => { await redisClient.connect() })();
const RedisStore = connectRedis(session);

declare module "express-session" {
    interface SessionData {
        userId: string
    }
}

const expressSession = () => {
    return session({
        secret: 'oasis-cookie-secret',
        store: new RedisStore({ host: 'localhost', port: 6379, client: redisClient }),
        resave: false,
        saveUninitialized: true,
        name: "auth",
        cookie: {
            secure: false
        }
    });
}

export default expressSession;