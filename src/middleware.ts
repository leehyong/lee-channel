import {Request, Response, NextFunction} from "express";
import {ResultUtil} from "./util";

function isLogin(req: Request) {
    // 登录校验
    return true;
}

function hasPermission(req: Request) {
    // 权限校验
    return true;
}

const authenticate = function (req: Request, res: Response, next: NextFunction) {
    if (isLogin(req)) {
        return next()
    } else {
        res.status(401)
            .json(ResultUtil.Error(1, "请先登录!"))
    }
}

const authorize = function (req: Request, res: Response, next: NextFunction) {
    if (hasPermission(req)) {
        return next()
    } else {
        res.status(403)
            .json(ResultUtil.Error(1, "没有权限，请联系系统管理员!"))
    }
}

export {authenticate, authorize}