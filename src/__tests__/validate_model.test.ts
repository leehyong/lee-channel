import {describe, test, expect} from "@jest/globals";

import {ChannelModel} from "../model";

describe("validate", () =>{
    test("ChannelModel 1",() =>{
        const name = "leehuayong";
        let model = new ChannelModel(1).setName(name);
        expect(model.is_validated).toBe(false);
        let result = model.validate();
        expect(model.is_validated).toBe(true);
        expect(result.success).toBe(true);
        expect(result.msg).toBe("");
        // console.log(model.validated_data)
        expect(model.validated_data.name).toBe(name);
        expect(model.validated_data.id).toBe(1);
    });

    test("ChannelModel 2",() =>{
        const name = "  ";
        let model = new ChannelModel(1)
            .setName(name);
        expect(model.is_validated).toBe(false);
        let result = model.validate();
        expect(model.is_validated).toBe(true);
        expect(result.success).toBe(false);
        expect(result.msg).toBe("不能为空字符串或者只包含空白字符");
        // console.log(model.validated_data)
        expect(model.validated_data.name).toBe(undefined);
        expect(model.validated_data.id).toBe(1);
    });
    test("ChannelModel 3",() =>{
        const name = undefined;
        let model = new ChannelModel(1)
            .setName(name);
        expect(model.is_validated).toBe(false);
        let result = model.validate();
        expect(model.is_validated).toBe(true);
        expect(result.success).toBe(false);
        expect(result.msg).toBe("必填的值");
        // console.log(model.validated_data)
        expect(model.validated_data.name).toBe(undefined);
        expect(model.validated_data.id).toBe(1);

    });
    test("ChannelModel 3",() =>{
        let model = new ChannelModel(1)
            .setName(null);
        expect(model.is_validated).toBe(false);
        let result = model.validate();
        expect(model.is_validated).toBe(true);
        expect(result.success).toBe(false);
        expect(result.msg).toBe("必填的值");
        // console.log(model.validated_data)
        expect(model.validated_data.name).toBe(undefined);
        expect(model.validated_data.id).toBe(1);

    });
})