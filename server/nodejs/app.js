// Read environment from .env file
const dotenv = require('dotenv');
dotenv.config();

// Check YouTube Data API key was set
if (!process.env.API_KEY) {
    console.log("ERROR: API key was not set");
    process.exit(1);
}

// Load modules
const youtubeApi = require('./youtube-api');
const { getRegion } = require('./util');

// Initialize server
const express = require('express');
const app = express();
const address = process.env.ADDR || '0.0.0.0';
const port = process.env.PORT || 3000;

// Initialize configs
const corsUrl = process.env.CORS_URL || '*';
const maxResults = process.env.MAX_RESULTS || 10;
const defaultRegion = process.env.DEFAULT_REGION || 'KR';
const defaultQuality = process.env.DEFAULT_QUALITY || 'best';

/**
 * Region code of client
 */
let regionCode;

/**
 * Route YouTube video download
 */
app.get('/download', (req, res) => {
    res.send('Download');
});

/**
 * Add get region code of client and add response headers
 */
app.get('/*', (req, res, next) => {
    setDefaultHeader(res);
    regionCode = getRegion(req.connection.remoteAddress) || defaultRegion;
    next();
});

/**
 * Route YouTube video list search
 */
app.get('/search', async (req, res, next) => {
    if (!req.query.q) return sendBadRequest(res, next);

    const youtube = youtubeApi.getYouTubeApi();
    const query = {
        'part': 'snippet',
        'type': 'video',
        'q': req.query.q,
        'maxResults': req.query.cnt || maxResults,
        'regionCode': regionCode,
    }
    if (req.query.token)
        query.pageToken = req.query.token;

    let youtubeError;
    try {
        const searchResponse = await youtube.search.list(query);
        const ids = [];
        searchResponse.data.items.forEach(item => {
            ids.push(item.id.videoId);
        });
        const statResponse = await youtube.videos.list({
            'part': 'statistics',
            'id': ids,
        })

        const data = {
            'nextPageToken': searchResponse.data.nextPageToken,
            'prevPageToken': searchResponse.data.prevPageToken,
            'pageInfo': searchResponse.data.pageInfo,
            'items': youtubeApi.formatVideoListItems(searchResponse.data.items, statResponse.data),
        }

        const result = {
            'success': true,
            'data': data,
        };
        res.send(JSON.stringify(result));
    }
    catch(e) {
        handleYouTubeError(e, res);
    }
});

/**
 * Route YouTube video info search
 */
app.get('/watch', (req, res) => {
    res.send('Watch');
});

app.get('/*', (req, res) => {
    sendBadRequest(res);
});

// Run server
app.listen(port, address, () => console.log(`YouTube Downloader backend listening at http://${address}:${port}`));

/**
 * Get response code and error info by error code
 * @param code
 * @returns {null|(number|{code: *})[]}
 */
function getErrorInfo(code) {
    let responseCode = 500;
    const error = {
        'code': code,
    }

    switch (code) {
    case 1:
        responseCode = 400;
        error.message = 'Bad Request.';
        break;
    case 2:
        responseCode = 503;
        error.message = 'Daily API request limit try again later.';
        break;
    case 3:
        responseCode = 404;
        error.message = 'Requested item(s) not found';
        break;
    case 4:
        responseCode = 503;
        error.message = 'YouTube Data API v3 is not working. Try again later.'
        break;
    case 5:
        responseCode = 500;
        error.message = 'Server cannot process your request. Contact server admin to solve this problem.'
        break;
    default:
        return null;
    }

    return [responseCode, error];
}

/**
 * Set default response header
 * @param res
 */
function setDefaultHeader(res) {
    res.set({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': corsUrl
    })
    res.charset = 'UTF-8'
}

/**
 * Send bad request to client
 * @param res
 */
function sendBadRequest(res) {
    setDefaultHeader(res)

    const errorInfo = getErrorInfo(1);
    res.status(errorInfo[0])
    res.send(JSON.stringify(errorInfo[1]));
}

function handleYouTubeError(e, res) {
    const youtubeErrorInfo = e.response.data.error;
    let errorInfo = getErrorInfo(4);

    if (youtubeErrorInfo) {
        switch(youtubeErrorInfo.code) {
            case 400:
                console.log("ERROR: Your API key is not valid!");
                errorInfo = getErrorInfo(5);
                break;
        }
    }

    res.status = errorInfo[0];
    res.send(JSON.stringify(errorInfo[1]));
}