// ID 生成策略的类型
type IdType = "AUTO" | "UUID" | "TIMESTAMP"

// 默认的ID 生成策略
const DEFAULT_ID_TYPE: IdType = "AUTO";

export {
    IdType,
    DEFAULT_ID_TYPE
}
