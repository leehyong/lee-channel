import express, {Application, Request, Response, NextFunction} from 'express'
import {ID_CHANNEL_TYPE} from "../consts";
import {store} from "../stores/store";
import {get_model_id_str, ReusltUtil} from "../util";
import {ChannelModel, IChannelModel} from "../model";

const channel = express.Router()

// 获取全部channel
channel.get('', (req, res, next) => {
    const channels = store.channel.list();
    res.status(200)
        .json(ReusltUtil.Ok(channels));
})

// 获取某个channel
channel.get('/:id', (req, res, next) => {
    const id = req.params.id;
    const channel = store.channel.get(id);
    let code = 200
    let data;
    if (!channel) {
        code = 400;
        data = ReusltUtil.Error(1, `channel:${id}不存在`)
    } else {
        data = ReusltUtil.Ok(channel)
    }
    res.status(code).json(data);
})

// 创建一个channel
channel.post("", (req, res, next) => {
    const id = get_model_id_str(ID_CHANNEL_TYPE);
    const channelValidateModel = new ChannelModel(id);
    channelValidateModel.setAllAttrs(req.body)
    const vr = channelValidateModel.validate();
    if (!vr.success) {
        res.status(400).json(ReusltUtil.Error(1, vr.msg))
        return;
    }
    const result = store.channel.add(channelValidateModel.validated_data as IChannelModel);
    if (!result) {
        res.status(400).json(ReusltUtil.Error(1, "新增channel失败，请检查"))
        return;
    }
    res.status(201).json(ReusltUtil.Error(0, `新增成功:${id}`));

})


export {
    channel
}