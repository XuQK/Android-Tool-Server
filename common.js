import * as http from "http";

/**
 * 完成响应
 * @param res {ServerResponse}
 * @param contentType {string}
 * @param any {any} 可被序列化成 json 字符串的的对象
 */
export function sendResponse200(res, contentType, any) {
    res.writeHead(200, http.STATUS_CODES[200], {
        "Content-Type": contentType,
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST",
        "Access-Control-Allow-Headers": "Content-Type"
    });
    res.end(any);
}

/**
 * 完成响应
 * @param res {ServerResponse}
 */
export function sendResponse500(res) {
    res.writeHead(500, http.STATUS_CODES[500], {
        "Content-Type": "text/plain",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST",
        "Access-Control-Allow-Headers": "Content-Type"
    });
    res.end("不支持的操作");
}
