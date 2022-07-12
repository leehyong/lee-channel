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

export abstract class BaseModel implements IValidate, IBaseModel {
    public id: any;
    public is_validated: boolean;
    public validated_data: { [key: string]: any }

    protected constructor(_id: any) {
        this.id = _id
        this.is_validated = false;
        this.validated_data = {};
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
        for (let key in this) {
            const field = this[key];
            if (field instanceof BaseField) {
                let success = true;
                const msgs = [];
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
    public setAttr(prop: keyof this, val?: any | null) {
        if(this[prop] instanceof BaseField){
            (this[prop] as any).setValue(val)
        }else{
            // 什么都不做
        }
        return this
    }

    public setAllAttrs(options:{[key:string]:any}){
        for (let attr in options){
            this.setAttr(attr as keyof this, options[attr])
        }
        return this;
    }
}

/**
 * Channel model
 */
export class ChannelModel extends BaseModel implements IChannelModel {
    public name: any;

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
        this.name = BaseModel.generate_field(ChannelModel.nameCls);
        // this.createdAt = BaseModel.generate_field(ChannelModel.createdAtCls);
    }
}

/**
 * Message model
 */
export class MessageModel extends BaseModel implements IMessageModel {
    channel: any;
    content: any;
    createdAt: any;
    title: any;
    private static channelCls = StringField({
        min: 1, required: true, is_not_empty: true, default_value: "1"
    })
    private static contentCls = StringField({
        range: {min: 2, max: 1024},
        required: true,
        is_not_blank: true,
        default_value: "hello world"
    })
    private static createdAtCls = NumberField({required: false, min: 100})
    private static titleCls = StringField({required: true, min: 1, is_not_blank: true})

    constructor(_id: any) {
        super(_id);
        this.channel = BaseModel.generate_field(MessageModel.channelCls);
        this.title = BaseModel.generate_field(MessageModel.titleCls);
        this.content = BaseModel.generate_field(MessageModel.contentCls);
        this.createdAt = BaseModel.generate_field(MessageModel.createdAtCls);
    }
}

