import {describe, test, expect} from "@jest/globals";

import {range, max, min, is_not_empty, is_required, is_not_blank} from "../validate";

interface ITestData {
    val?: any,
    success: boolean,
    msg: string
}

describe("validate", () => {

    test("range: number", () => {
        const _min = 10, _max = 20;
        const _range = range(_min, _max);
        let result = _range();
        expect(result.success).toBe(true);
        result = _range(10);
        expect(result.success).toBe(true);
        result = _range(5);
        expect(result.msg).toBe(`值5必须在范围[${_min},${_max})内`);
        expect(result.success).toBe(false);
        result = _range(20);
        expect(result.msg).toBe(`值20必须在范围[${_min},${_max})内`);
        expect(result.success).toBe(false);
        result = _range(250);
        expect(result.msg).toBe(`值250必须在范围[${_min},${_max})内`);
        expect(result.success).toBe(false);
    });

    test("range: string", () => {
        const _min = 4, _max = 8;
        const _range = range(_min, _max);
        let result = _range();
        expect(result.success).toBe(true);
        const tests = [
            ["hello", true, ``],
            ["hel", false, `hel的长度必须在范围[${_min},${_max})内`],
            ["helloworld", false, `helloworld的长度必须在范围[${_min},${_max})内`],
        ]
        for (let item of tests) {
            result = _range(item[0] as string);
            expect(result.success).toBe(item[1]);
            expect(result.msg).toBe(item[2]);
        }
    });

    test("min: number", () => {
        let _min = 10;
        const fn = min(_min);
        let result;
        const tests: ITestData[] = [
            {success: true, msg: ``},
            {val: 4, success: false, msg: `值4必须不小于${_min}`},
            {val: 10, success: true, msg: ""},
            {val: 144, success: true, msg: ""},
        ]
        for (let item of tests){
            result = fn(item.val);
            expect(result.success).toBe(item.success);
            expect(result.msg).toBe(item.msg);
        }
    });
    test("min: string", () => {
        let _min = 4;
        const fn = min(_min);
        let result;
        const tests: ITestData[] = [
            {success: true, msg: ``},
            {val: 4, success: true, msg: ""},
            {val: "lee", success: false, msg: `lee的长度必须不小于${_min}`},
            {val: 10, success: true, msg: ""},
            {val: 144, success: true, msg: ""},
        ]
        for (let item of tests){
            result = fn(item.val);
            expect(result.success).toBe(item.success);
            expect(result.msg).toBe(item.msg);
        }
    });
    test("max: number", () => {
        let _max = 100;
        const fn = max(_max);
        let result;
        const tests: ITestData[] = [
            {success: true, msg: ``},
            {val: 4, success: true, msg: ``},
            {val: 10, success: true, msg: ""},
            {val: 100, success: true, msg: ""},
            {val: 144, success: false, msg: `值144必须不大于${_max}`},
        ]
        for (let item of tests){
            result = fn(item.val);
            expect(result.success).toBe(item.success);
            expect(result.msg).toBe(item.msg);
        }
    });
    test("max: string", () => {
        let _max = 6;
        const fn = max(_max);
        let result;
        const tests: ITestData[] = [
            {success: true, msg: ``},
            {val: "lee", success: true, msg: ``},
            {val: "leesen", success: true, msg: ``},
            {val: "leeseno", success: false, msg: `leeseno的长度必须不大于${_max}`},
        ]
        for (let item of tests){
            result = fn(item.val);
            expect(result.success).toBe(item.success);
            expect(result.msg).toBe(item.msg);
        }
    });

    test("is_required: any", () => {
        const fn = is_required;
        let result;
        const tests: ITestData[] = [
            {success: false, msg: `必填的值`},
            {val: "lee", success: true, msg: ``},
            {val: "leesen", success: true, msg: ``},
            {val: 10, success: true, msg: ``},
            {val: false, success: true, msg: ``},
            {val: {}, success: true, msg: ``},
            {val: {ok:false}, success: true, msg: ``},
            {val: "leeseno", success: true, msg: ``},
        ]
        for (let item of tests){
            result = fn(item.val);
            expect(result.success).toBe(item.success);
            expect(result.msg).toBe(item.msg);
        }
    });

    test("is_not_empty: string", () => {
        const fn = is_not_empty;
        let result;
        const tests: ITestData[] = [
            {val: "", success: false, msg: `不能为空`},
            {val: "    ", success: true, msg: ``},
            {val: "leesenfa", success: true, msg: ``},
        ]
        for (let item of tests){
            result = fn(item.val);
            expect(result.success).toBe(item.success);
            expect(result.msg).toBe(item.msg);
        }
    });

    test("is_not_blank: string", () => {
        const fn = is_not_blank;
        let result;
        const tests: ITestData[] = [
            {val: "", success: false, msg: `不能为空字符串或者只包含空白字符`},
            {val: "    ", success: false, msg: `不能为空字符串或者只包含空白字符`},
            {val: "leesenfa", success: true, msg: ``},
        ]
        for (let item of tests){
            result = fn(item.val);
            expect(result.success).toBe(item.success);
            expect(result.msg).toBe(item.msg);
        }
    });
})