import {store} from "../stores/store";
import {describe, expect} from "@jest/globals";
import {app} from '../app'
import assert from "assert";

const request = require('supertest');


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
            .set('Accept', 'application/json')
            .send({"name": name});
        expect(resp.status).toBe(400);

    })


})