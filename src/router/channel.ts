import express, {Application, Response, NextFunction} from 'express'
import {ID_CHANNEL_TYPE} from "../consts";
import {store} from "../stores/store";
import {get_model_id_str, ResultUtil} from "../util";
import {ChannelValidate, IChannelValidate} from "../model";

const channel = express.Router()

// 获取全部channel
// req.body 参数 无
// 返回json格式：
//  {"code":0,"success":true,"message":"","data":[{"id":"1","name":"channel的名字"},{"id":"1","name":"channel的名字"}]}
channel.get('', (req, res, next) => {
    const channels = store.channel.list();
    res.status(200)
        .json(ResultUtil.Ok(channels));
})

// 获取某个channel的信息
// req.body 参数 无
// 返回json格式：
//   {"code":0,"success":true,"message":"","data":{"id":"1","name":"channel的名字"}}
channel.get('/:id', (req, res, next) => {
    const id = req.params.id;
    const channel = store.channel.get(id);
    let code = 200
    let data;
    if (!channel) {
        code = 400;
        data = ResultUtil.Error(1, `channel:${id}不存在`)
    } else {
        data = ResultUtil.Ok(channel)
    }
    res.status(code).json(data);
})

// 创建一个channel,
// req.body 参数 {"name":"channel名字"}
// 返回json格式：
//  {"code":0,"success":true,"message":"","data":"成功"}
channel.post("", (req, res, next) => {
    const id = get_model_id_str(ID_CHANNEL_TYPE);
    const channelValidateModel = new ChannelValidate(id);
    // console.log(req.body)
    channelValidateModel.setAllAttrs(req.body)
    const vr = channelValidateModel.validate();
    if (!vr.success) {
        res.status(400).json(ResultUtil.Error(1, vr.msg))
        return;
    }
    const result = store.channel.add(channelValidateModel.validated_data as IChannelValidate);
    if (!result) {
        res.status(400).json(ResultUtil.Error(1, `已有名为${channelValidateModel.validated_data.name}的channel，请检查`))
        return;
    }
    res.status(201).json(ResultUtil.Ok(0, `新增成功:${id}`));

})


export {
    channel
}