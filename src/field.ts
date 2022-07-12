import {
    TValidators,
    LeeValidationError,
    range,
    min,
    max,
    is_not_blank,
    FieldValidator,
    is_not_empty,
    is_required
} from './validate'

type FieldErrorMessageFn = (val: any) => string
type RequiredFn = (val: any) => boolean

type TErrorFn = null | string | FieldErrorMessageFn
type TRequiredFn = null | boolean | RequiredFn


export interface IField {
    // 字段的默认值
    default_value: any;
    // 字段的验证器
    validators: TValidators;
    //自定义校验错误函数。 字段在验证失败时，可以返回错误消息的函数
    error_message: TErrorFn
}

/**
 * 字段基类
 */
export abstract class BaseField<T> implements IField {
    value?: T;
    default_value: T;
    error_message: TErrorFn;
    validators: TValidators;

    protected constructor(
        {
            default_value,
            validators,
            error_message
        }: IField) {
        this.value = undefined
        this.default_value = default_value;
        this.validators = validators;
        this.error_message = error_message;
    }

    public setValue(val: T) {
        this.value = val
    }

    public getValue(): T {
        return this.value!
    }
}

// 范围
type Range = { min: number, max: number }

/**
 * StringField 的可选项
 */
export interface FieldOptions {
    default_value?: any,
    min?: number,
    max?: number,
    range?: Range,
    // 默认是可选的
    required?: TRequiredFn,
    error_message?: TErrorFn
}

export interface StringFieldOptions extends FieldOptions {
    is_not_blank?: boolean,
    is_not_empty?: boolean,
}

function common_options(options: FieldOptions): IField {
    const _options: IField = {
        validators: [],
        error_message: options.error_message || null,
        default_value: options.default_value || null
    };
    const validators = _options.validators;
    if (!!options.required) {
        validators.push(is_required);
    } else {
        // 默认不是必填参数
        validators.push((_) => {
            return {success: true, msg: ""}
        });
    }
    // 参数校验
    if ((!!options.min || !!options.max) && !!options.range) {
        throw new LeeValidationError("min、max 与 range 不能同时指定")
    } else {
        if (!!options.range) {
            if (typeof options.range === "object") {
                validators.push(range(options.range.min, options.range.max))
            } else {
                const _min = options.range![0];
                const _max = options.range![1];
                if (_min > _max) throw  new LeeValidationError(`${_min} 不能大于 ${_max},请检查!`)
                validators.push(range(options.range![0], options.range![1]))
            }
        } else {
            if (!!options.min) {
                validators.push(min(options.min))
            }
            if (!!options.max) {
                validators.push(max(options.max))
            }
        }
    }
    return _options
}


export function StringField(options: StringFieldOptions) {
    const _options = common_options(options);
    if (!!options.is_not_blank) {
        _options.validators.splice(1, 0, is_not_blank)
    }
    if (!!options.is_not_empty) {
        _options.validators.splice(1, 0, is_not_empty)
    }

    class _StringField extends BaseField<string> {
        constructor() {
            super(_options);
        }
    }

    return _StringField
}

export function NumberField(options: FieldOptions) {
    const _options = common_options(options);

    class _NumberField extends BaseField<number> {
        constructor() {
            super(_options);
        }
    }

    return _NumberField
}