import * as fsPromise from "node:fs/promises";
import * as common from "./common.js";
import * as webp from "webp-converter";
import * as url from "node:url";
import * as querystring from "querystring";

/**
 * png 转换成 webp 并响应 response
 * @param {InstanceType<typeof IncomingMessage>} req
 * @param {InstanceType<typeof ServerResponse> & {req: InstanceType<typeof IncomingMessage>}} res
 * @param {Buffer} bodyBuffer
 */
export async function runPngConvertToWebp(req, res, bodyBuffer) {
    try {
        const quality = querystring.parse(url.parse(req.url).query).quality;
        const webpBuffer = await pngConvertToWebpAndEndResponse(res, bodyBuffer, quality);
        common.sendResponse200(res, "image/webp", webpBuffer);
    } catch (e) {
        console.error(e);
        common.sendResponse500(res)
    }
}

/**
 * @param {InstanceType<typeof ServerResponse> & {req: InstanceType<typeof IncomingMessage>}} res
 * @param buffer png 的 buffer
 * @param quality {number} 转换质量，[0, 100]
 * @return {Promise<Buffer>} webp 的 buffer
 *
 * @throws
 */
async function pngConvertToWebpAndEndResponse(res, buffer, quality) {
    const tempDir = `${process.cwd()}/temp`;
    await fsPromise.mkdir(tempDir, {recursive: true});
    const tempImageName = Math.floor(Math.random() * 9000 + 1000);
    const pngPath = `${tempDir}/${tempImageName}.png`;
    const webpPath = `${tempDir}/${tempImageName}.webp`;
    await fsPromise.writeFile(pngPath, buffer);
    await webp.cwebp(pngPath, webpPath, `-q ${quality}`, `-v`);
    const webpBuffer = await fsPromise.readFile(webpPath);
    await fsPromise.rm(pngPath);
    await fsPromise.rm(webpPath);
    return webpBuffer
}
