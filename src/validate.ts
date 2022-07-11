export type FieldValidator = (val: any) => IValidateResult
export type TValidators = FieldValidator[]

interface IValidateResult {
    // 是否验证成功
    success: boolean,
    // 验证之后的消息
    msg: string
}

// 验证接口
interface IValidate {
    // 是否进行验证过
    is_validate: boolean,

    // 验证结果
    validate(): IValidateResult

    // 验证成功后的数据
    validated_data: { [key: string]: any }
}

/**
 *  校验字段的长度或者值不小于 min_val
 * @param min_val
 */
function min(min_val: number) {
    /**
     * @param val
     */
    function _inner(val?: string | number): IValidateResult {
        // 没有对应的值时，不需要校验，直接返回 true
        if (val === undefined || val == null) return {success: true, msg: ""};
        const isString = typeof val === "string";
        let txt: string;
        let is_valid: boolean;
        if (isString) {
            txt = `${val}的长度`
            is_valid = (val as string).length >= min_val;
        } else {
            txt = `值${val}`
            is_valid = val >= min_val;
        }
        return {
            success: is_valid,
            msg: is_valid ? "" : `${txt}必须不小于${min_val}`
        }
    }

    return _inner
}


/**
 *  校验字段的长度或者值不大于 max_val
 * @param max_val
 */
function max(max_val: number) {
    /**
     *  验证通过返回null，失败则返回相应的错误字符串
     * @param val
     */
    function _inner(val?: string | number): IValidateResult {
        // 没有对应的值时，不需要校验，直接返回 true
        if (val === undefined || val == null) return {success: true, msg: ""};
        const isString = typeof val === "string";
        let txt: string;
        let is_valid: boolean;
        if (isString) {
            txt = `${val}的长度`
            is_valid = (val as string).length <= max_val;
        } else {
            txt = `值${val}`
            is_valid = val <= max_val;
        }
        return {success: is_valid, msg: is_valid ? "" : `${txt}必须不大于${max_val}`}
    }

    return _inner
}

/**
 * 校验字段的长度或者值 在[min max_val)之间； 开闭原则。
 * @param min
 * @param max
 */

function range(min: number, max: number) {
    /**
     *  验证通过返回null，失败则返回相应的错误字符串
     * @param val
     */
    function _inner(val?: string | number): IValidateResult {
        // 没有对应的值时，不需要校验，直接返回 true
        if (val === undefined || val == null) return {success: true, msg: ""};
        const isString = typeof val === "string";
        let txt: string;
        let is_valid: boolean;
        if (isString) {
            txt = `${val}的长度`
            const len = (val as string).length;
            is_valid = len < max && len >= min;
        } else {
            txt = `值${val}`
            is_valid = val < max && val >= min;
        }
        return {success: is_valid, msg: is_valid ? "" : `${txt}必须在范围[${min},${max})内`}
    }

    return _inner
}


/**
 * 校验字段是否是必须的
 * 验证通过返回null，失败则返回相应的错误字符串
 * @param val
 */
function is_required(val: any): IValidateResult {
    let is_valid = val != undefined;
    return {success: is_valid, msg: is_valid ? "" : `必填的值`}
}

/**
 * 校验字符串非空
 * 验证通过返回null，失败则返回相应的错误字符串
 * @param val
 */
function is_not_empty(val: string): IValidateResult {
    let is_valid = val.length > 0;
    return {success: is_valid, msg: is_valid ? "" : `不能为空`};
}

/**
 * 校验字符串去除空字符后非空
 * @param val
 */
function is_not_blank(val: string): IValidateResult {
    let is_valid = val.trim().length > 0;
    return {success: is_valid, msg: is_valid ? "" : `不能为空字符串或者只包含空白字符`};
}


class LeeValidationError extends Error {
    constructor(options: any) {
        super(options);
    }
}

export {
    min,
    max,
    range,
    is_required,
    is_not_blank,
    is_not_empty,
    LeeValidationError,
    IValidate,
    IValidateResult
}

