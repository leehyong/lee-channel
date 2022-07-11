import {Uuid, UuidOptions} from 'node-ts-uuid';
import {DEFAULT_ID_TYPE, IdType} from "./consts";

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
function get_model_id(id_type: IdType=DEFAULT_ID_TYPE): string | number {
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

export {
    get_model_id
}

