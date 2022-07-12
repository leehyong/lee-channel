import {IMessageModel} from "../model";

enum EmitStrategy {
    None,
    Random,
    Lru
}

export abstract class BaseMessageStore {
    // 外部只读
    public msgs: IMessageModel[];
    public channel_id: any;
    protected limit: number

    protected constructor(channel_id:any) {
        this.msgs = [];
        this.limit = 0
        this.channel_id = channel_id
    }

    public abstract add(model: IMessageModel): boolean;

    public abstract remove(model_id: string): boolean;
}

export class NormalMessageStore extends BaseMessageStore {
    constructor(channel_id: any) {
        super(channel_id);
    }

    add(model: IMessageModel): boolean {
        if (model.channel !== this.channel_id) return false;
        this.msgs.push(model);
        return true;
    }

    protected remove_by_idx(idx:number): boolean {
        if (idx !== -1) {
            // 找到并删除元素
            this.msgs.splice(idx, 1);
            return true
        }
        return false;
    }

    remove(model_id: string): boolean {
        const idx = this.msgs.findIndex((model) => model.id === model_id);
        return this.remove_by_idx(idx);
    }
}

export class RandomMessageStore extends NormalMessageStore {
    constructor(channel_id: any, limit: number) {
        super(channel_id);
        // 保证limit最小为1
        this.limit = limit < 1 ? 1 : limit;
    }

    add(model: IMessageModel): boolean {
        if (this.msgs.length >= this.limit) {
            this.selected_remove();
        }
        return super.add(model)
    }

    protected selected_remove() {
        // 随机挑选某个位置进行删除
        const idx = Math.floor(Math.random() * this.msgs.length);
        return this.remove_by_idx(idx);
    }
}

