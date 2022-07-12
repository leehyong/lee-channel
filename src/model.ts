import {BaseField, NumberField, IField, StringField} from "./field";
import {IValidate, IValidateResult} from "./validate";

export interface IBaseModel {
    id: any
}

export interface IChannelModel extends IBaseModel {
    name: any,
    // createdAt: any
}

export interface IMessageModel extends IBaseModel {
    title: any,
    content: any,
    channel: any,
    createdAt: any

}

/**
 * 判定某个类是 BaseField 的子类, 通过范型检查即认为是 BaseField 的子类
 * @param clz
 */
function is_filed_cls<T>(clz: { new(): T, [key: string]: any }): boolean {
    return clz.__proto__ === BaseField;
}

/**
 * 面向元编程
 * 自动生成某个model的所有字段
 * @param clz
 */
export function generate_fields<T extends BaseModel,
    F extends BaseField<any>>(
    clz: {
        new(): T, // 保证可以 使用 new 进行初始化
        [key: string]: any // 能检索类的静态属性
    },
): { [key: string]: F } {
    const fields: { [key: string]: F } = {}
    for (let attr in clz) {
        // 只识别以 _ 开头的属性
        if (attr[0] === "_" && is_filed_cls(clz[attr])) {
            // 去掉开头的 _ , 并创建一个字段实例对象
            fields[attr.substring(1)] = new clz[attr]();
        }
    }
    return fields
}

export abstract class BaseModel implements IValidate {
    public id: any;
    public is_validated: boolean;
    public validated_data: { [key: string]: any }
    protected fields: { [key: string]: any }

    protected constructor(_id: any) {
        this.id = _id
        this.is_validated = false;
        this.validated_data = {};
        this.fields = {id: _id};
    }


    protected static generate_field(cls: any): IField {
        return new cls()
    }

    /**
     * 校验函数， 校验当前model都所有字段
     */
    public validate(): IValidateResult {
        // let key: keyof this;
        const ret: IValidateResult = {msg: "", success: false};
        const validate_msgs: string[] = [];
        for (let key in this.fields) {
            const field = this.fields[key];
            if (field instanceof BaseField) {
                let success = true;
                const msgs = [];
                // console.log(field.validators)
                for (let validator of field.validators) {
                    const validate_result: IValidateResult = validator(field.getValue());
                    if (!validate_result.success) {
                        // 用户自定义的错误消息比默认的错误消息优先级高
                        if (field.error_message) {
                            if (typeof field.error_message === "function") {
                                msgs.push(field.error_message(field.getValue()));
                            } else {
                                msgs.push(field.error_message);
                            }
                        } else {
                            msgs.push(validate_result.msg);
                        }
                        // 只要一个字段报错就退出当前 for 循环、继续迭代下个字段
                        success = false;
                        break
                    }
                }
                // 所有字段都校验成功之后才把数据写进验证结果集里
                if (success) {
                    this.validated_data[key] = field.getValue();
                } else {
                    validate_msgs.push(`${key}:${msgs.join("-")}`)
                }
            } else if (key === "id") {
                this.validated_data.id = this.id
            }
        }
        this.is_validated = true;
        ret.success = validate_msgs.length == 0;
        ret.msg = validate_msgs.join(";")
        return ret;
    }

    /**
     * 设置 prop 对应字段的值
     * builder 模式， 支持链式调用
     * @param prop
     * @param val
     */
    public setAttr(prop: string, val?: any | null) {
        if (this.fields[prop] instanceof BaseField) {
            (this.fields[prop] as any).setValue(val)
        } else {
            // 什么都不做
        }
        return this
    }

    public setAllAttrs(options: { [key: string]: any }) {
        for (let attr in options) {
            this.setAttr(attr, options[attr])
        }
        return this;
    }
}

/**
 * Channel model
 */
export class _ChannelModel extends BaseModel implements IChannelModel {
    public name: any;
    public static test = 100;
    public static test2 = 100;
    public static test3 = "dadadwqeq";

    private static nameCls = StringField(
        {
            is_not_blank: true,
            min: 1,
            required: true,
            max: 30
        }
    )

    constructor(_id: any) {
        super(_id);
        this.name = BaseModel.generate_field(_ChannelModel.nameCls);
        // this.createdAt = BaseModel.generate_field(ChannelModel.createdAtCls);
    }
}


export class ChannelModel extends BaseModel {
    private static _name = StringField(
        {
            is_not_blank: true,
            min: 1,
            required: true,
            max: 30
        }
    )

    constructor(_id: any) {
        super(_id);
        this.fields = {...this.fields, ...generate_fields(ChannelModel as any)}
    }
}

/**
 * Message model
 */
export class MessageModel extends BaseModel {
    // channel: any;
    // content: any;
    // createdAt: any;
    // title: any;
    private static _channel = StringField({
        min: 1, required: true, is_not_empty: true, default_value: "1"
    })
    private static _content = StringField({
        range: {min: 2, max: 1024},
        required: true,
        is_not_blank: true,
        default_value: "hello world"
    })
    private static _createdAt = NumberField({required: false, min: 100})
    private static _title = StringField({required: true, min: 1, is_not_blank: true})

    constructor(_id: any) {
        super(_id);
        this.fields = {...this.fields, ...generate_fields(MessageModel as any)}
        //
        // this.channel = BaseModel.generate_field(MessageModel.channelCls);
        // this.title = BaseModel.generate_field(MessageModel.titleCls);
        // this.content = BaseModel.generate_field(MessageModel.contentCls);
        // this.createdAt = BaseModel.generate_field(MessageModel.createdAtCls);
    }
}


