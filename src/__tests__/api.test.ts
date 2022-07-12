import {describe, expect} from "@jest/globals";
import {app} from '../app'

const request = require('supertest');

/**
 * channel 接口测试
 */
describe("api channel", () => {
    let testApp: any;
    beforeAll(() => {
        testApp = request(app);
        // console.log(testApp)
    })
    test("get all channel", (done) => {
        testApp
            .get("")
            .expect(200, done);
    })

    test("post channel", async () => {
        const name = "lee1";
        let resp = await testApp
            .post("/channel")
            .send({"name": name})
            .set('Accept', 'application/json');
        expect(resp.status).toBe(201);
        expect(resp.body.code).toBe(0);
        expect(resp.body.success).toBe(true);
        resp = await testApp
            .get(`/channel`)
            .set('Accept', 'application/json');
        // console.log(resp.body.data)

        const channel_id = resp.body.data[0].id;
        resp = await testApp
            .get(`/channel/${channel_id}`)
            .set('Accept', 'application/json');
        expect(resp.status).toBe(200);
        expect(resp.body.data.name).toBe(name);

        resp = await testApp
            .post("/channel")
            .send({"name": name})
            .set('Accept', 'application/json');
        expect(resp.status).toBe(400);
        expect(resp.body.message).toBe("已有名为lee1的channel，请检查");
    });

    test("channel error", async () => {
        let resp = await testApp
            .get(`/channel/1`)
            .set('Accept', 'application/json');
        expect(resp.status).toBe(400);
        expect(resp.body.code).toBe(1);
        expect(resp.body.data).toBeNull();
        expect(resp.body.success).toBe(false);
        expect(resp.body.message).toBe(`channel:1不存在`);
        let data = {
            name: ""
        }
        resp = await testApp
            .post(`/channel`)
            .send(data)
            .set('Accept', 'application/json');
        expect(resp.status).toBe(400);
        expect(resp.body.code).toBe(1);
        expect(resp.body.data).toBeNull();
        expect(resp.body.success).toBe(false);
        expect(resp.body.message).toBe(`name:不能为空字符串或者只包含空白字符`);
    })
})


/**
 * message 接口测试
 */
describe("api message", () => {
    let testApp: any;
    let channelModel: any;
    beforeAll(async () => {
        testApp = request(app);
        const name = "lee" + new Date().toDateString();
        // console.log(testApp)
        await testApp
            .post("/channel")
            .send({"name": name})
            .set('Accept', 'application/json');
        const result = await testApp
            .get("/channel")
            .set('Accept', 'application/json');
        channelModel = result.body.data[0];
        // console.log(channelModel)
    });

    test("get channel message success", async () => {
        let resp = await testApp.get(`/message/${channelModel.id}/1`)
            .set('Accept', 'application/json');
        expect(resp.status).toBe(200);
        expect(resp.body.success).toBe(true);
        // console.log(resp.body)
        expect(resp.body.data.total).toBe(0);
        expect(resp.body.data.page).toBe(1);
        expect(resp.body.data.page_size).toBe(10);
        expect(resp.body.data.data).toBeNull();
    })

    test("post channel message", async () => {

        const titles = ["lee1", "lee2", "lee3"];
        let resp: any;
        const models = new Map<string, { [key: string]: any }>();
        for (let title of titles) {
            let model = {
                title,
                channel: channelModel.id,
                content: `lee content ${title}`,
            }
            resp = await testApp.post(`/message/${channelModel.id}`)
                .send(model)
                .set('Accept', 'application/json');
            expect(resp.status).toBe(201);
            models.set(model.title, model)
        }
        resp = await testApp
            .get(`/message/${channelModel.id}/1`)
            .set('Accept', 'application/json');
        const msgs = resp.body.data.data;
        expect(msgs.length).toBeGreaterThanOrEqual(3)
        // 属性相等
        for (let msg of msgs) {
            const model = models.get(msg.title);
            if (model === undefined) continue;
            expect(model.channel).toBe(msg.channel);
            expect(model.title).toBe(msg.title);
            expect(model.content).toBe(msg.content);
        }
    })

    test("test create message error", async () => {
        let resp = await testApp
            .get(`/message/${channelModel.id}1/1`)
            .set('Accept', 'application/json');
        expect(resp.status).toBe(400);
        expect(resp.body.message).toBe("channel不存在，请检查");
        const model = {
            content: "a",
        }
        resp = await testApp
            .post(`/message/${channelModel.id}`)
            .send(model)
            .set('Accept', 'application/json');
        expect(resp.status).toBe(400);
        expect(resp.body.success).toBe(false);
        expect(resp.body.data).toBeNull();
        expect(resp.body.message).toBe("title:必填的值;content:a的长度必须在范围[2,1024)内");
    })
});