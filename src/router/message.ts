import express, {Application, Request, Response, NextFunction} from 'express'
import {ID_CHANNEL_TYPE, ID_MESSAGE_TYPE} from "../consts";
import {store} from "../stores/store";
import {get_model_id_str, ResultUtil} from "../util";
import {ChannelValidate, IChannelValidate, IMessageValidate, MessageValidate} from "../model";

const message = express.Router()

function common(req: Request, res: Response, next: NextFunction) {
    const channel = req.params.channel
    const _channel = store.channel.get(channel);
    if (!_channel) {
        res.status(400)
            .json(ResultUtil.Error(1, "channel不存在，请检查"));
        return
    }
    next()
}

// 获取某个channel某页的消息
// 路径参数：
//  channel: channel id
//  page:  某页
// req.body 参数 无
// 返回json格式：
//  {"code":0,"success":true,"message":"","data":{"page":1, "page_size":10,"total":120, "data":[{"title":"xxx", "content":"xzc","createAt":1221233,"channel":"2","id":"1000"}}
message.get(
    '/:channel/:page',
    common,
    (req, res, next) => {
        let page = parseInt(req.params.page, 10)
        if (!page || page < 1) page = 1
        const data = store.message.page(req.params.channel, page);
        res.status(200)
            .json(ResultUtil.Ok(data));
    })

// 发送消息
// req.body 参数 {"title":"xxx", "content":"xzc"}
// 返回json格式： {"code":0,"success":true,"message":"发送成功","data":null}
message.post(
    "/:channel",
    common,
    (req, res, next) => {
        const id = get_model_id_str(ID_MESSAGE_TYPE);
        const msgValidateModel = new MessageValidate(id);
        msgValidateModel.setAllAttrs(req.body);
        msgValidateModel.setAttr("channel", req.params.channel);
        msgValidateModel.setAttr("createdAt", new Date().getTime());
        const vr = msgValidateModel.validate();
        if (!vr.success) {
            res.status(400).json(ResultUtil.Error(1, vr.msg))
            return;
        }
        const result = store.message.add(msgValidateModel.validated_data as IMessageValidate);
        if (!result) {
            res.status(400).json(ResultUtil.Error(1, "发送消息失败"))
            return;
        }
        res.status(201).json(ResultUtil.Ok(0, `发送消息成功:${id}`));
    })

export {
    message
}