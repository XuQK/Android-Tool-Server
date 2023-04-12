import * as svgo from "svgo";

/**
 * 处理请求，返回结果
 * @param {Object} body
 * @return {string}
 */
export function getResponse(body) {
    try {
        const precision = body.precision;
        body.svgContentList = body.svgContentList.map(svgContent => optimizeSvgText(svgContent, precision));
        return JSON.stringify(body.svgContentList);
    } catch (e) {
        console.error(e);
    }
}

/**
 *
 * @param {string} svgText
 * @param {number} precision
 * @return {string}
 */
function optimizeSvgText(svgText, precision) {
    return svgo.optimize(svgText, {
        floatPrecision: precision,
        multipass: true
    }).data;
}
