import express from 'express';
import { PORT } from './constants';


const app = express();
app.use(express.json());


app.get("/", (req: express.Request, res:express.Response) => {
    req.body;
    res.send({"msg": "Hello World!"});
});

app.listen(PORT, () => console.log(`Server started at port ${PORT}`));