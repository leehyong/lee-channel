import {store} from "../stores/store";


import {describe, test, expect} from "@jest/globals";
import {get_model_id_str} from "../util";
import {ID_CHANNEL_TYPE, ID_MESSAGE_TYPE} from "../consts";
import {IChannelModel, IMessageModel} from "../model";

describe("channel", () => {
    test("channel", () => {
        const channel = store.channel
        const names = ["lee1", "lee2", "lee3"];
        let size = 0;
        for (let name of names) {
            const channel_id = get_model_id_str(ID_CHANNEL_TYPE);
            let result = channel.get(channel_id);
            expect(result).toBe(undefined);
            const model: IChannelModel = {
                id: channel_id,
                name
            }
            let result1 = channel.add(model);
            expect(result1).toBe(true);
            result1 = channel.add(model);
            expect(result1).toBe(false);
            result = channel.get(channel_id);
            expect(result!.id).toBe(model.id);
            expect(result!.name).toBe(model.name);
            ++size;
            expect(channel.channels.size).toBe(size)
        }
        expect(channel.list().length).toBe(size)
    });
});


describe("channel message", () => {
    let channel: IChannelModel;
    beforeAll(() => {
        const channel_id = get_model_id_str(ID_CHANNEL_TYPE);
        const model: IChannelModel = {
            id: channel_id,
            name: "lee-test-"+ new Date().toDateString(),
        }
        store.channel.add(model);
        channel = store.channel.get(channel_id)!;
    });

    test("message", () =>{
        const titles = ["msg1", "msg2", "msg3"];
        const dt = new Date().getTime();
        let size = 0;
        let remove_id:string;
        for (let title of titles){
            const id = get_model_id_str(ID_MESSAGE_TYPE)
            const model:IMessageModel = {
                id,
                title,
                content: `${title}   sdada content`,
                channel: channel.id,
                createdAt: dt,
            }
            store.message.add(model)
            ++size;
            expect(store.message.list(channel.id).length).toBe(size);
            remove_id = id;
        }
        expect(store.message.remove(channel.id, remove_id!)).toBe(true)
        expect(store.message.list(channel.id).length).toBe(size - 1);

    })
})

