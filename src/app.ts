import { PrismaClient } from '@prisma/client';
import express from 'express';
import { PORT } from './constants';


const app = express();
app.use(express.json());

const prisma = new PrismaClient();

app.get("/", async (req: express.Request, res:express.Response) => {
    req.body;
    const user = await prisma.book.create({
        data: {
            id: "Random_ID",
            title: "Random Title",
            author: "Random Author",
            publishDate: "Idk"
        }
    });
    res.json(user);
});

app.listen(PORT, () => console.log(`Server started at port ${PORT}`));