import express, {Application, Request, Response, NextFunction, Errback, ErrorRequestHandler} from 'express'
import dotenv from "dotenv"

dotenv.config()
import {authorize, authenticate} from "./middleware";
import {channel} from "./router/channel";
import {message} from "./router/message";
import {LeeValidationError} from "./validate";
import {ChannelModel} from "./model";

const app: Application = express();

// 登录中间件
app.use(authenticate);
app.use(express.json());
app.use(express.urlencoded({extended: true}));
// 授权中间件
app.use(authorize);
app.get('/', (req: Request, res: Response, next: NextFunction) => {
    // new ChannelModel(1);
    res.send('Hello World!');
});
// channel 相关路由
app.use("/channel", channel)
// message 相关路由
app.use("/message", message)

// 错误处理
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    if (err && err instanceof LeeValidationError) {
        res.status(400).send(err.message);
    } else {
        next(err);
    }
})
const port = process.env.PORT || 7777;
app.listen(port, function () {
    console.log(`Example app listening on port http://localhost:${port}!`);
})

export {
    app
}