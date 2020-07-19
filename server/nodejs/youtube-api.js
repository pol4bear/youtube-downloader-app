const {google} = require('googleapis')

const util = require('util');
const exec = util.promisify(require('child_process').exec);

/**
 * Initialize YouTube API.
 * @returns {*}
 */
function getYouTubeApi() {
    return google.youtube({
        version: 'v3',
        auth: process.env.API_KEY,
    });
}

/**
 * Format YouTube Data API result to custom result.
 * @param items
 * @param statResponse
 * @returns {[]}
 */
function formatVideoListItems(items, statResponse) {
    const result = [];

    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const snippet = item.snippet;
        result.push({
            'id': item.id.videoId,
            'channelId': snippet.channelId,
            'channelTitle': snippet.channelTitle,
            'description': snippet.description,
            'publishedAt': snippet.publishedAt,
            'title': snippet.title,
            'thumbnails': snippet.thumbnails,
            'statistics': statResponse['items'][i]['statistics'],
        });
    }

    return result;
}

/**
 * Get available video qualities.
 * @param videoId
 */
async function getVideoQuality(videoId) {
    try {
        const {stdout} = await exec(`youtube-dl -F "https://youtube.com/watch?v=${videoId}"`);
        const qualities = stdout.split('\n');
        if (!qualities || qualities.length === 0)
            return null;

        const qualityRegex = /^(?<formatCode>[0-9]+)\s+(?<extension>[^\s]+)\s+(?<resolution>audio only|[[0-9]+x[0-9]+)\s+(?<note>.*)$/;

        const result = [];
        qualities.forEach(quality => {
            const match = qualityRegex.exec(quality);
            if (!match) return;
            result.push({
                'formatCode': match.groups.formatCode,
                'extension': match.groups.extension,
                'resolution': match.groups.resolution,
                'note': match.groups.note,
            });
        })
        return result;
    }
    catch(e) {
        handleYouTubeDlError(e.code);
    }
}

/**
 * Get expected filename of video.
 * @param videoId
 * @param formatCode
 * @returns {Promise<string>}
 */
async function getFileName(videoId, formatCode) {
    try {
        const { stdout } = await exec(`youtube-dl -f "${formatCode}" --get-filename "https://youtube.com/watch?v=${videoId}"`);
        return stdout.toString();
    }
    catch(e) {
        handleYouTubeDlError(e.code);
    }
}

/**
 * Handle error while using youtube-dl.
 * @param code
 * @returns {null}
 */
function handleYouTubeDlError(code) {
    switch(code) {
        case 1:
            return null;
        case 127:
            console.log("Error occurred while using youtube-dl. Did you install youtube-dl before use?");
            process.exit(-2);
    }
}

module.exports = {
    getYouTubeApi,
    formatVideoListItems,
    getVideoQuality,
    getFileName,
}