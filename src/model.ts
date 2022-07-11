import {BaseField, NumberField, StringField} from "./field";
import {IValidate, IValidateResult} from "./validate";

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

abstract class BaseModel implements IValidate, IBaseModel {
    public id: any;
    public is_validate: boolean;
    public validated_data: { [key: string]: any }

    protected constructor() {
        this.is_validate = false;
        this.validated_data = {};
    }

    protected validate(): IValidateResult {
        let key: keyof this;
        const ret: IValidateResult = {msg: "", success: false};
        const validate_msg: string[] = [];
        for (key in this) {
            const field = this[key];
            if (field instanceof BaseField) {
                for (let validator of field.validators) {
                    const validate_result:IValidateResult = validator(field.getValue());
                    if (!validate_result.success) {
                        // 用户自定义的错误消息比默认的错误消息优先级高
                        if (field.error_message) {
                            if (typeof field.error_message === "function") {
                                validate_msg.push(field.error_message(field.getValue()));
                            } else {
                                validate_msg.push(field.error_message);
                            }
                        } else{
                            validate_msg.push(validate_result.msg);
                        }
                        // 只要一个字段报错就退出当前 for 循环、继续迭代下个字段
                        break
                    }else{
                        this.validated_data[key] = field.getValue();
                    }
                }
            } else if (key === "id") {
                this.validated_data.id = this.id
            }
        }
        return ret;
    }

}

export class ChannelModel extends BaseModel implements IChannelModel {
    private name: any;
    public is_validate: boolean;

    constructor(_id: any) {
        super();
        this.id = _id;
        this.name = StringField({min: 1, required: true})
    }
    // builder 模式， 支持链式调用
    public setName(name:string){
        this.name.setValue(name)
        return this
    }

    public validate(): IValidateResult {
        return super.validate();
    }
}