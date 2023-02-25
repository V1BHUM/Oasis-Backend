import 'reflect-metadata'
import { PrismaClient } from '@prisma/client';
import express from 'express';
import cors from 'cors';
import { expressMiddleware } from '@apollo/server/express4';

import { apolloServer } from './apollo';
import { PORT } from './constants';
import {RedisStore} from 'connect-redis';
import session from 'express-session';
import connectRedis from 'connect-redis';
import * as redis from 'redis';


export interface Context {
    prismaClient: PrismaClient,
    req: express.Request,
    res: express.Response
}

const app = express();
app.use(express.json());

export const prisma = new PrismaClient();

app.get("/", async (req: express.Request, res:express.Response) => {
    res.json({"msg":"Hello, World!"});
});

const redisClient = redis.createClient({url: 'redis://redis:6379', legacyMode: true ,password:"my-super-secret-password"});
(async ()=>{await redisClient.connect()})();
const RedisStore = connectRedis(session);

app.use(
    session({
        secret: 'secret',
        store: new RedisStore({host: 'localhost', port: 6379,client:redisClient}),
        resave: false,
        saveUninitialized: false,
        name:"test"
    })
);

(async () => {
    const server = await apolloServer();
    app.use(
        "/graphql",
        cors<cors.CorsRequest>(
            {
                origin: true,
                credentials: true
            }
        ),
        expressMiddleware(server, {
            context: async ({req, res}) : Promise<Context> => {
                return {prismaClient: prisma, req, res};
            }
        }),
    );
})();

app.listen(PORT, () => console.log(`Server started at port ${PORT}`));