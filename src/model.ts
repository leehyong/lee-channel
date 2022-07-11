export interface BaseModel {
    id: string | number
}

export interface ChannelModel extends BaseModel {
    name: string
}

export interface MessageModel extends BaseModel {
    title: string,
    content: string,
    channel: string,
    createdAt: number
}