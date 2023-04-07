"use strict";

import * as http from "http";
import * as svgOptimizer from "./svg-optimizer.js";
import * as webpConvertor from "./webp-convertor.js";
import * as url from "node:url";

const server = http.createServer((req, res) => {
    switch (req.method) {
        case "OPTIONS": {
            res.writeHead(204, http.STATUS_CODES[204], {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST",
                "Access-Control-Allow-Headers": "Content-Type"
            });
            res.end();
            break;
        }
        case "POST": {
            handlePost(req, res);
            break;
        }
        default:
            urlNoMatch(res);
    }
});

/**
 * 处理 Post 请求
 * @param {InstanceType<typeof IncomingMessage>} req
 * @param {InstanceType<typeof ServerResponse> & {req: InstanceType<typeof IncomingMessage>}} res
 */
function handlePost(req, res) {
    console.log(`处理请求：${req.url}`);
    const body = [];
    req.on("data", chunk => {
        body.push(chunk);
    });
    req.on("end", () => {
        switch (url.parse(req.url).pathname) {
            case "/svg-optimizer": {
                svgOptimizer.runSvgOptimizer(req, res, Buffer.concat(body)).then();
                break;
            }
            case "/png-convert-webp": {
                webpConvertor.runPngConvertToWebp(req, res, Buffer.concat(body)).then();
                break;
            }
            default: {
                urlNoMatch(res);
                return;
            }
        }
    });
}

/**
 * 处理 url 没有处理的情况
 * @param res {ServerResponse}
 */
function urlNoMatch(res) {
    res.writeHead(404, http.STATUS_CODES[404], {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST",
        "Access-Control-Allow-Headers": "Content-Type"
    });
    res.end();
}

server.listen(6636);
