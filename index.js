"use strict";

import * as http from "http";
import * as svgOptimizer from "./svgOptimizer.js";
import * as webpConvertor from "./webpConvertor.js";
import url from "node:url";

const server = http.createServer((req, res) => {
    setCorsHead(res);
    switch (req.method) {
        case "OPTIONS": {
            res.writeHead(204, http.STATUS_CODES[204]);
            res.end();
            break;
        }
        case "POST": {
            handlePost(req, res).then(r => {});
            break;
        }
        default:
            reply404(res);
    }
});

/**
 * 处理 Post 请求
 * @param {InstanceType<typeof IncomingMessage>} req
 * @param {ServerResponse} res
 */
async function handlePost(req, res) {
    console.log(`处理请求：${req.url}`);
    const body = [];
    req.on("data", chunk => {
        body.push(chunk);
    });
    req.on("end", async () => {
        try {
            const bodyBuffer = Buffer.concat(body);
            switch (url.parse(req.url).pathname) {
                case "/svgOptimizer": {
                    const responseBody = svgOptimizer.getResponse(bodyBuffer);
                    res.writeHead(200, {
                        "Content-Type": "application/json"
                    })
                    res.end(responseBody)
                    return;
                }
                case "/pngConvertWebp": {
                    /** @type string */
                    const quality = req.headers["quality"]
                    const responseBody = await webpConvertor.getResponse(parseInt(quality), bodyBuffer)
                    res.writeHead(200, {
                        "Content-Type": "application/octet-stream"
                    })
                    res.end(responseBody)
                    break;
                }
                default: {
                    reply404(res);
                    return;
                }
            }
        } catch (e) {
            console.error(e);
            reply404(res)
        }
    });
}

/**
 * 给 response 添加跨域 header
 * @param res {ServerResponse}
 */
function setCorsHead(res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

/**
 * 处理 url 没有处理的情况
 * @param res {ServerResponse}
 */
function reply404(res) {
    res.writeHead(404, http.STATUS_CODES[404], {
        "Content-Type": "text/plain",
    });
    res.end();
}

server.listen(6636);
