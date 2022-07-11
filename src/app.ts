import express, {Application, Request, Response, NextFunction} from 'express'
import dotenv from "dotenv"
dotenv.config()
import {authorize, authenticate} from "./middleware";
//
// console.log(process.env.ID_GLOBAL_TYPE)
// console.log(process.env.ID_MESSAGE_TYPE)
// console.log(process.env.ID_MESSAGE_TYPE)
// console.log(process.env.ID_MESSAGE_TYPE)
const app: Application = express();
// 登录中间件
app.use(authenticate);
// 授权中间件
app.use(authorize);

app.get('/', (req: Request, res: Response, next: NextFunction) => {
    res.send('Hello World!');
});
const port = process.env.PORT || 7777;
app.listen(port, function () {
    console.log(`Example app listening on port http://localhost:${port}!`);
})