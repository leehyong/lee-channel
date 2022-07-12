import express, {Application, Request, Response, NextFunction} from 'express'
import {ID_MESSAGE_TYPE} from "../consts";

const message = express.Router()

message.get('/users/:userId/books/:bookId', (req, res) => {
    res.send(req.params)
})
// 获取某个channel某页的消息
message.get(
    '/:channel/:page',
    (req, res, next) => {
        console.log('Request Type:', req.params)
        res.status(200).json(req.params)
    })

// 发送消息
message.post(
    "'/:channel",
    (req, res, next) => {

    })

export {
    message
}