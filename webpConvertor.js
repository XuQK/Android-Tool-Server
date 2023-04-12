import sharp from "sharp";

/**
 *
 * @param {number} quality
 * @param {Buffer} body
 * @return {Promise<Buffer>}
 */
export function getResponse(quality, body) {
    try {
        return sharp(body)
            .webp({quality: quality})
            .toBuffer();
    } catch (e) {
        console.error(e);
    }
}
