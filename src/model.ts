import {NumberField, StringField} from "./field";

export interface IBaseModel {
    id: any
}

export interface IChannelModel extends IBaseModel {
    name: any
}

export interface IMessageModel extends IBaseModel {
    title: any,
    content: any,
    channel: any,
    createdAt: any
}


export class ChannelModel implements IChannelModel{
    id: any;
    name: StringField({min:1});

}