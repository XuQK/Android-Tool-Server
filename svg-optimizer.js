import * as svgo from "svgo";
import * as common from "./common.js";
import querystring from "querystring";
import url from "node:url";

/**
 * 优化 svg
 * @param {InstanceType<IncomingMessage>} req
 * @param {InstanceType<ServerResponse>&{req: InstanceType<IncomingMessage>}} res
 * @param {Buffer} bodyBuffer
 * @return {Promise<void>}
 */
export async function runSvgOptimizer(req, res, bodyBuffer) {
    try {
        const precision = querystring.parse(url.parse(req.url).query).precision;
        await optimizeSvgAndEndResponse(res, bodyBuffer.toString(), precision);
    } catch (e) {
        console.error(e);
        common.sendResponse500(res)
    }
}

/**
 * @param {InstanceType<typeof ServerResponse> & {req: InstanceType<typeof IncomingMessage>}} res
 * @param svgContent {string}
 * @param precision {number}
 * @return {Promise<void>}
 *
 * @throws
 */
async function optimizeSvgAndEndResponse(res, svgContent, precision) {
    const optimizedSvgContent = svgo.optimize(svgContent, {
        floatPrecision: precision,
        multipass: true
    }).data
    common.sendResponse200(res, "text/plain", optimizedSvgContent);
}
