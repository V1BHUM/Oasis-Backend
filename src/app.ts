import 'reflect-metadata'
import { PrismaClient } from '@prisma/client';
import express from 'express';
import cors from 'cors';
import { expressMiddleware } from '@apollo/server/express4';

import { apolloServer } from './apollo';
import { PORT } from './constants';
import expressSession from './redis/redis'

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

app.use(expressSession());

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
app.set("Access-Control-Allow-Credentials", true);

app.listen(PORT, () => console.log(`Server started at port ${PORT}`));