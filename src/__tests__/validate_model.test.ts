import {describe, test, expect} from "@jest/globals";

import {ChannelValidate, MessageValidate, BaseValidate, generate_fields} from "../model";
import {StringField} from "../field";

export class TestMessageValidate extends MessageValidate {
    override model_clz = TestMessageValidate;
    private static _test = StringField({required: false, min: 3, error_message:(val) => `${val}的长度不能低于3`})

    constructor(_id: any) {
        super(_id);
        // this.fields = {...this.fields, ...generate_fields(TestMessageValidate as any)}
        // this.test = BaseValidate.generate_field(TestMessageValidate.testCls);
    }
}

describe("validate ChannelValidate", () => {
    test("ChannelValidate 1", () => {
        const name = "leehuayong";
        let model = new ChannelValidate(1).setAttr('name', name);
        expect(model.is_validated).toBe(false);
        let result = model.validate();
        expect(model.is_validated).toBe(true);
        expect(result.success).toBe(true);
        expect(result.msg).toBe("");
        // console.log(model.validated_data)
        expect(model.validated_data.name).toBe(name);
        expect(model.validated_data.id).toBe(1);
    });

    test("ChannelValidate 2", () => {
        const name = "  ";
        let model = new ChannelValidate(1)
            .setAttr('name', name);
        expect(model.is_validated).toBe(false);
        let result = model.validate();
        expect(model.is_validated).toBe(true);
        expect(result.success).toBe(false);
        expect(result.msg).toBe("name:不能为空字符串或者只包含空白字符");
        // console.log(model.validated_data)
        expect(model.validated_data.name).toBe(undefined);
        expect(model.validated_data.id).toBe(1);
    });
    test("ChannelValidate 3", () => {
        const name = undefined;
        let model = new ChannelValidate(1)
            .setAttr('name', name);
        expect(model.is_validated).toBe(false);
        let result = model.validate();
        expect(model.is_validated).toBe(true);
        expect(result.success).toBe(false);
        expect(result.msg).toBe("name:必填的值");
        // console.log(model.validated_data)
        expect(model.validated_data.name).toBe(undefined);
        expect(model.validated_data.id).toBe(1);

    });
    test("ChannelValidate 3", () => {
        let model = new ChannelValidate(1)
            .setAttr('name', null);
        expect(model.is_validated).toBe(false);
        let result = model.validate();
        expect(model.is_validated).toBe(true);
        expect(result.success).toBe(false);
        expect(result.msg).toBe("name:必填的值");
        // console.log(model.validated_data)
        expect(model.validated_data.name).toBe(undefined);
        expect(model.validated_data.id).toBe(1);

    });
})


describe("validate MessageValidate", () => {
    test("MessageValidate 1", () => {
        const dt = new Date().getTime();
        const model = new MessageValidate(1)
            .setAttr('channel', "1")
            .setAttr('title', "嘿嘿")
            .setAttr('content', "dadad").setAttr('createdAt', dt);
        expect(model.is_validated).toBe(false);
        let result = model.validate();
        expect(model.is_validated).toBe(true);
        expect(result.msg).toBe("");
        expect(result.success).toBe(true);
        expect(model.validated_data.id).toBe(1);
        expect(model.validated_data.channel).toBe("1");
        expect(model.validated_data.title).toBe("嘿嘿");
        expect(model.validated_data.content).toBe("dadad");
        expect(model.validated_data.createdAt).toBe(dt);
    });
    test("MessageValidate 2", () => {
        const dt = new Date().getTime();
        const model = new MessageValidate(1)
            .setAttr('channel', "12")
            .setAttr('title', "嘿嘿")
            .setAttr('createdAt', dt);

        expect(model.is_validated).toBe(false);
        let result = model.validate();
        expect(model.is_validated).toBe(true);
        expect(result.msg).toBe("");
        expect(result.success).toBe(true);
        expect(model.validated_data.id).toBe(1);
        expect(model.validated_data.channel).toBe("12");
        expect(model.validated_data.title).toBe("嘿嘿");
        expect(model.validated_data.content).toBe("hello world");
        expect(model.validated_data.createdAt).toBe(dt);
    });

    test("MessageValidate 3", () => {
        const dt = new Date().getTime();
        const model = new MessageValidate(1)
            .setAttr('channel', "113")
            // .setAttr('title', "嘿嘿")
            .setAttr('createdAt', dt);

        expect(model.is_validated).toBe(false);
        let result = model.validate();
        expect(model.is_validated).toBe(true);
        expect(result.msg).toBe("title:必填的值");
        expect(result.success).toBe(false);
        expect(model.validated_data.id).toBe(1);
        expect(model.validated_data.channel).toBe("113");
        expect(model.validated_data.title).toBe(undefined);
        expect(model.validated_data.content).toBe("hello world");
        expect(model.validated_data.createdAt).toBe(dt);
    });

    test("MessageValidate 4", () => {
        const dt = new Date().getTime();
        const model = new MessageValidate(1)
            .setAttr('channel', "113")
            // .setAttr('title', "嘿嘿")
            .setAttr('createdAt', dt);

        expect(model.is_validated).toBe(false);
        let result = model.validate();
        expect(model.is_validated).toBe(true);
        expect(result.msg).toBe("title:必填的值");
        expect(result.success).toBe(false);
        expect(model.validated_data.id).toBe(1);
        expect(model.validated_data.channel).toBe("113");
        expect(model.validated_data.title).toBe(undefined);
        expect(model.validated_data.content).toBe("hello world");
        expect(model.validated_data.createdAt).toBe(dt);
    });
})



describe("validate TestMessageValidate", () => {
    test("TestMessageValidate 1", () => {
        const dt = new Date().getTime();
        const model = new TestMessageValidate(1)
            .setAttr('channel', "1")
            .setAttr('title', "嘿嘿")
            .setAttr('content', "dadad")
            .setAttr('createdAt', dt);
        expect(model.is_validated).toBe(false);
        let result = model.validate();
        expect(model.is_validated).toBe(true);
        expect(result.msg).toBe("");
        expect(result.success).toBe(true);
        expect(model.validated_data.id).toBe(1);
        expect(model.validated_data.channel).toBe("1");
        expect(model.validated_data.title).toBe("嘿嘿");
        expect(model.validated_data.test).toBe(null);
        expect(model.validated_data.content).toBe("dadad");
        expect(model.validated_data.createdAt).toBe(dt);
    });

    test("MessageValidate 2", () => {
        const dt = new Date().getTime();
        const model = new TestMessageValidate(1)
            .setAttr('channel', "1")
            .setAttr('title', "嘿嘿")
            .setAttr('content', "dadad")
            .setAttr('test', "cd")
            .setAttr('createdAt', dt);
        expect(model.is_validated).toBe(false);
        let result = model.validate();
        expect(model.is_validated).toBe(true);
        expect(result.msg).toBe("test:cd的长度不能低于3");
        expect(result.success).toBe(false);
        expect(model.validated_data.id).toBe(1);
        expect(model.validated_data.channel).toBe("1");
        expect(model.validated_data.test).toBe(undefined);
        expect(model.validated_data.title).toBe("嘿嘿");
        expect(model.validated_data.content).toBe("dadad");
        expect(model.validated_data.createdAt).toBe(dt);
    });
})