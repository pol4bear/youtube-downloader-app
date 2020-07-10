const {google} = require('googleapis')

function getYouTubeApi() {
    return google.youtube({
        version: 'v3',
        auth: process.env.API_KEY,
    });
}

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

module.exports = {
    getYouTubeApi,
    formatVideoListItems,
}