import {Uuid, UuidOptions} from 'node-ts-uuid';
import {ID_GLOBAL_TYPE, IdType} from "./consts";

interface IdGenerator {
    Id(): string | number
}

class AutoIdGenerator implements IdGenerator {
    num: number = 0;

    Id() {
        // id自增
        return ++this.num;
    }
}

class UuidIdGenerator implements IdGenerator {
    options: UuidOptions;

    constructor() {
        this.options = {
            length: 32,
            prefix: '',
        };
    }

    Id() {
        // 使用UUID
        return Uuid.generate(this.options);
    }
}

class TimestampIdGenerator implements IdGenerator {
    Id() {
        // 使用当前时间的毫秒
        return new Date().getTime();
    }
}

/**
 * _id_generators， 内存缓存 IdGenerator 对象，避免频繁的创建和初始化 IdGenerator 对象
 */
const _id_generators: { [key: string]: IdGenerator } = {}

/**
 * 通过 id_type 来获取对应的id
 * @param id_type : "AUTO"|"UUID"|"TIMESTAMP"
 * @return string | number
 */
function get_model_id(id_type: IdType = ID_GLOBAL_TYPE): string | number {
    //
    let generator_obj: IdGenerator | undefined = _id_generators[id_type]
    if (generator_obj === undefined) {
        let cls;
        switch (id_type) {
            case "TIMESTAMP":
                cls = TimestampIdGenerator
                break
            case "UUID":
                cls = UuidIdGenerator
                break
            case "AUTO":
            default:
                cls = AutoIdGenerator
                break
        }
        generator_obj = new cls()
        _id_generators[id_type] = <IdGenerator>generator_obj
    }
    return generator_obj!.Id();
}

/**
 * 通过 id_type 来获取对应的id， 并将其转为字符串
 * @param id_type : "AUTO"|"UUID"|"TIMESTAMP"
 */
function get_model_id_str(id_type: IdType = ID_GLOBAL_TYPE): string {
    return get_model_id(id_type).toString();
}

interface ResultData {
    code: number,
    success: boolean,
    data: any,
    message: string
}

class ResultUtil {

    public static Ok(data: any, message?: string): ResultData {
        return {code: 0, data, message: !!message ? message : '', success: true}
    }

    public static Error(code: number, message?: string): ResultData {
        return {code, message: !!message ? message : '', data: null, success: false}
    }
}

export {
    get_model_id,
    get_model_id_str,
    ResultUtil
}

