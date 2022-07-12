// ID 生成策略的类型
type IdType = "AUTO" | "UUID" | "TIMESTAMP"

// 默认的ID 生成策略
const ID_GLOBAL_TYPE: IdType =( process.env.ID_GLOBAL_TYPE || "AUTO" ) as IdType
const ID_MESSAGE_TYPE: IdType = (process.env.ID_MESSAGE_TYPE || ID_GLOBAL_TYPE) as IdType
const ID_CHANNEL_TYPE: IdType = (process.env.ID_CHANNEL_TYPE || ID_GLOBAL_TYPE) as IdType

export {
    IdType,
    ID_GLOBAL_TYPE,
    ID_MESSAGE_TYPE,
    ID_CHANNEL_TYPE
}

