import 'reflect-metadata'
import { PrismaClient } from '@prisma/client';
import express from 'express';
import cors from 'cors';
import { expressMiddleware } from '@apollo/server/express4';

import { apolloServer } from './apollo';
import { PORT } from './constants';


export interface Context {
    prismaClient: PrismaClient,
    req: express.Request,
    res: express.Response
}

const app = express();
app.use(express.json());

export const prisma = new PrismaClient();

app.get("/", async (req: express.Request, res:express.Response) => {
    req.body;
    res.json({"msg":"Hello, World!"});
});

(async () => {
    const server = await apolloServer();
    app.use(
        "/graphql",
        cors<cors.CorsRequest>(),
        expressMiddleware(server, {
            context: async ({req, res}) : Promise<Context> => {
                return {prismaClient: prisma, req, res};
            }
        }),
    );
})();

app.listen(PORT, () => console.log(`Server started at port ${PORT}`));