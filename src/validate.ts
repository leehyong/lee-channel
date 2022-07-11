export type FieldValidator = (val: any) => boolean
export type TValidators = FieldValidator[]


/**
 *  校验字段的长度或者值不小于 min_val
 * @param min_val
 */
function min(min_val: number) {
    function _inner(val: string | number) {
        // 没有对应的值时，不需要校验，直接返回 true
        if (val === undefined || val == null) return true;
        const isString = typeof val === "string";
        const txt = isString ? "长度":"值"
        min.prototype.errmsg = (_val) => `${txt}${val}必须不小于${min_val}`
        if (isString) {
            return (val as string).length >= min_val;
        } else {
            return val >= min_val;
        }
    }
    return _inner
}


/**
 *  校验字段的长度或者值不大于 max_val
 * @param max_val
 */
function max(max_val: number) {
    function _inner(val: string | number) {
        // 没有对应的值时，不需要校验，直接返回 true
        if (val === undefined || val == null) return true;
        const isString = typeof val === "string";
        const txt = isString ? "长度":"值"
        max.prototype.errmsg = (_val) => `${txt}${val}必须不大于${max_val})`
        if (isString) {
            return (val as string).length <= max_val;
        } else {
            return val <= max_val;
        }
    }
    return _inner
}

/**
 * 校验字段的长度或者值 在[min max_val)之间； 开闭原则。
 * @param min
 * @param max
 */

function range(min:number, max:number){
    function _inner(val: string | number) {
        // 没有对应的值时，不需要校验，直接返回 true
        if (val === undefined || val == null) return true;
        const isString = typeof val === "string";
        const txt = isString ? "长度":"值"
        range.prototype.errmsg = (_val) => `${txt}${val}必须在范围内[${min},${max})`
        if (isString) {
            const len = (val as string).length;
            return len < max && len >= min;
        } else {
            return val < max && val > min;
        }
    }
    return _inner
}


/**
 * 校验字段是否是必须的
 * @param val
 */
function is_required(val:any){
    return val != undefined
}

is_required.prototype.errmsg = (val) => "必填的值";
/**
 * 校验字符串非空
 * @param val
 */
function is_not_empty(val:string){
    return is_required(val) && val.length > 0;
}

is_not_empty.prototype.errmsg = (val) => "不能为空"

/**
 * 校验字符串去除空字符后非空
 * @param val
 */
function is_not_blank(val:string){
    return is_required(val) && val.trim().length > 0;
}

is_not_blank.prototype.errmsg = (val) =>  `不能只包含空白字符`;

export class LeeValidationError extends Error{
    constructor(options) {
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
    LeeValidationError
}

