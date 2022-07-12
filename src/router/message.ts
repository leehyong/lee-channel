import express, {Application, Request, Response, NextFunction} from 'express'
import {ID_CHANNEL_TYPE, ID_MESSAGE_TYPE} from "../consts";
import {store} from "../stores/store";
import {get_model_id_str, ResultUtil} from "../util";
import {ChannelModel, IChannelModel, IMessageModel, MessageModel} from "../model";

const message = express.Router()

function common(req:Request, res:Response, next:NextFunction){
    const channel = req.params.channel
    const _channel = store.channel.get(channel);
    if (!_channel){
        res.status(400)
            .json(ResultUtil.Error(1, "channel不存在，请检查"));
        return
    }
    next()
}

// 获取某个channel某页的消息
message.get(
    '/:channel/:page',
    common,
    (req, res, next) => {
        const page = parseInt(req.params.page, 10) || 1
        const data = store.message.page(req.params.channel, page);
        res.status(200)
            .json(ResultUtil.Ok(data));
    })

// 发送消息
message.post(
    "'/:channel",
    common,
    (req, res, next) => {
        const id = get_model_id_str(ID_MESSAGE_TYPE);
        const msgValidateModel = new MessageModel(id);
        msgValidateModel.setAttr("channel", req.params.channel);
        msgValidateModel.setAllAttrs(req.body);
        const vr = msgValidateModel.validate();
        if (!vr.success) {
            res.status(400).json(ResultUtil.Error(1, vr.msg))
            return;
        }
        const result = store.message.add(msgValidateModel.validated_data as IMessageModel);
        if (!result) {
            res.status(400).json(ResultUtil.Error(1, "发送消息失败"))
            return;
        }
        res.status(201).json(ResultUtil.Ok(0, `发送消息成功:${id}`));
    })

export {
    message
}