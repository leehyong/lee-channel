import {IBaseModel, IChannelModel, IMessageModel} from "../model";
import {NormalMessageStore} from "./message";


type SortFn = (a: IMessageModel, b: IMessageModel) => number

/**
 * 消息相关操作
 */
interface IMessageOp {
    list(channel_id: string,): IMessageModel[]

    add(model: IMessageModel): boolean

    remove(channel_id: string, msg_id: string): boolean

    sort: SortFn
}

/**
 * 页相关
 */
interface Page<T> {
    page_size: number,
    total: number,
    page: number,
    data: T[] | null
}

/**
 * 分页
 */
interface IPageMessageOp extends IMessageOp {
    page(channel_id: string, page: number, page_size?: number): Page<IMessageModel>
}

/**
 * channel相关操作
 */
interface IChannelOp {
    list(): IChannelModel[]

    get(channel_id: string): IChannelModel | undefined


    add(model: IChannelModel): boolean
}


class ChannelManage implements IChannelOp {
    // 单例模式
    public static instance: ChannelManage = new ChannelManage();
    public channels: Map<string, IChannelModel>;
    // channel 名字对应的 id
    public channel_names:Map<string, string>;

    // 私有构造函数
    private constructor() {
        this.channels = new Map();
        this.channel_names = new Map();
    }

    /**
     * 新增一个 channel，
     * @param model
     * @return 如果 channel 对应的name不存在， 则新增，返回true； 否则，返回false
     */
    add(model: IChannelModel): boolean {
        if (this.channel_names.get(model.id as string) === undefined) {
            this.channels.set(model.id as string, model);
            this.channel_names.set(model.name as string, model.id);
            return true
        }
        return false
    }

    list(): IChannelModel[] {
        return Array.from(this.channels.values());
    }

    get(channel_id: string) {
        return this.channels.get(channel_id)
    }
}


/**
 * 消息
 */
class ChannelMessageManage implements IMessageOp {
    public static instance: ChannelMessageManage = new ChannelMessageManage();
    public channel_msg: { [key: string]: NormalMessageStore }
    public msg_limit: number;
    // 数据是否需要重排序
    protected is_resort: boolean;

    protected constructor() {
        this.is_resort = false;
        this.channel_msg = {}
        this.msg_limit = 0;
    }

    add(model: IMessageModel): boolean {
        let msg_store = this.channel_msg[model.channel as string];
        if (msg_store === undefined) {
            msg_store = new NormalMessageStore(model.channel);
            this.channel_msg[model.channel as string] = msg_store
        }
        // 每次数据更新， 都需要重新排序

        const success = msg_store.add(model);
        success ? this.is_resort = true : null;
        return success;

    }


    list(channel_id: string): IMessageModel[] {
        const msg_store = this.channel_msg[channel_id];
        if (msg_store === undefined) return []
        if (this.is_resort) {
            msg_store.msgs.sort(this.sort);
        }
        return msg_store.msgs;
    }

    remove(channel_id: string, msg_id: string) {
        let msg_store = this.channel_msg[channel_id];
        if (msg_store === undefined) {
            // 空操作
            return false;
        }
        return msg_store.remove(msg_id);
    }

    sort(a: IMessageModel, b: IMessageModel): number {
        if (a.createdAt < b.createdAt) return 1;
        else if (a.createdAt === b.createdAt) return 0
        else return -1;
    }
}

/**
 * 分页列出消息
 */
class PageChannelMessageManage extends ChannelMessageManage implements IPageMessageOp {
    public static instance: PageChannelMessageManage = new PageChannelMessageManage();

    protected constructor() {
        super();
    }

    page(channel_id: string, page: number, page_size?: number): Page<IMessageModel> {
        let msg_store = this.channel_msg[channel_id];
        page_size = page_size || 10;
        const start = (page - 1) * page_size
        if (msg_store === undefined || start > msg_store.msgs.length) {
            // 空操作
            return {
                page_size,
                total: 0,
                page,
                data: null
            } as Page<IMessageModel>;
        }
        if (this.is_resort) {
            // 排序
            msg_store.msgs.sort(this.sort)
        }
        const end = page * page_size
        return {
            page_size,
            page,
            total: msg_store.msgs.length,
            data: msg_store.msgs.slice(start, end)
        } as Page<IMessageModel>;
    }
}


export const store = {
    channel: ChannelManage.instance,
    message: PageChannelMessageManage.instance,
}