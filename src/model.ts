import {BaseField, NumberField, StringField} from "./field";
import {IValidate, IValidateResult} from "./validate";

export interface IBaseModel {
    id: any
}

export interface IChannelModel extends IBaseModel {
    name: any,
    createdAt: any
}

export interface IMessageModel extends IBaseModel {
    title: any,
    content: any,
    channel: any,
    createdAt: any

}

abstract class BaseModel implements IValidate, IBaseModel {
    public id: any;
    public is_validated: boolean;
    public validated_data: { [key: string]: any }

    protected constructor(_id:any) {
        this.id = _id
        this.is_validated = false;
        this.validated_data = {};
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
                for (let validator of field.validators) {
                    const validate_result: IValidateResult = validator(field.getValue());
                    if (!validate_result.success) {
                        // 用户自定义的错误消息比默认的错误消息优先级高
                        if (field.error_message) {
                            if (typeof field.error_message === "function") {
                                validate_msgs.push(field.error_message(field.getValue()));
                            } else {
                                validate_msgs.push(field.error_message);
                            }
                        } else {
                            validate_msgs.push(validate_result.msg);
                        }
                        // 只要一个字段报错就退出当前 for 循环、继续迭代下个字段
                        success = false;
                        break
                    }
                }
                // 所有字段都校验成功之后才把数据写进验证结果集里
                if (success){
                    this.validated_data[key] = field.getValue();
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

}

export class ChannelModel extends BaseModel implements IChannelModel {
    public name: any;
    public createdAt: any;

    private static nameCls = StringField(
        {
            is_not_blank:true,
            min: 1,
            required: true,
            max:30
        }
    )
    private static createdAtCls = StringField(
        {
            is_not_blank:true,
            min: 1,
            required: true,
            max:30
        }
    )

    constructor(_id: any) {
        super(_id);
        this.name = new ChannelModel.nameCls()
    }

    // builder 模式， 支持链式调用
    public setName(name?: any|null) {
        this.name.setValue(name)
        return this
    }

    public validate(): IValidateResult {
        return super.validate();
    }

}