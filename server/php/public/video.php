<?php
require_once '../src/base.php';
require_once '../src/YouTubeSearch.php';

/**
 * Video id to search info.
 * Search won't work without video id.
 */
$videoId = isset($_GET['v'])
  ? $_GET['v']
  : (isset($_POST['v'])
    ? $_POST['v']
    : null);

// Response error if no video id.
if (!isset($videoId)) {
  badRequest();
}

$youtubeClient = getYouTubeClient();
$regionCode = getIpInfo($_SERVER['REMOTE_ADDR'], 'countrycode');

try {
  // Get YouTube video snippet and statistics.
  $searchResponse = $youtubeClient->videos->listVideos('snippet,statistics', [
    'id' => $videoId,
    'regionCode' => isset($regionCode)
      ? $regionCode
      : $config['default_region'],
  ]);

  $videoInfo = $searchResponse['items'][0];

  // If video info not found throw invalid argument exception.
  if (!isset($videoInfo)) {
    throw new InvalidArgumentException();
  }

  // Make video info response.
  $videoSnippet = $videoInfo['snippet'];
  $data = [
    'id' => $videoInfo['id'],
    'channelId' => $videoSnippet['channelId'],
    'chanelTitle' => $videoSnippet['channelTitle'],
    'description' => $videoSnippet['description'],
    'publishedAt' => $videoSnippet['publishedAt'],
    'tags' => $videoSnippet['tags'],
    'title' => $videoSnippet['title'],
    'thumbnails' => $videoSnippet['thumbnails'],
    'statistics' => $videoInfo['statistics'],
    'qualities' => getVideoQuality($videoId),
  ];

  // Set success result
  $result = [
    200,
    json_encode(['success' => true, 'data' => $data], JSON_UNESCAPED_UNICODE),
  ];
} catch (Google_Service_Exception $exception) {
  // Set API daily limit error result
  $result = getErrorMessage(2);
} catch (InvalidArgumentException $exception) {
  // Set invalid input error
  $result = getErrorMessage(3);
}

// Make client detect data as json
addApiHeader();
http_response_code($result[0]);
echo $result[1];
