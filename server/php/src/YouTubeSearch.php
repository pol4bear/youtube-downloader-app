<?php
require_once 'base.php';

/**
 * Create YouTube Data API v3 client object.
 * Return client object.
 *
 * @return Google_Service_YouTube|null
 */
function getYouTubeClient()
{
  global $config;
  $apiKey = $config['api_key'];
  if (!isset($apiKey)) {
    return null;
  }

  $apiClient = new Google_Client(['developer_key' => $apiKey]);
  return new Google_Service_YouTube($apiClient);
}

/**
 * Format video and statistics array prettier.
 * Return formatted list of videos.
 *
 * @param $items
 * @param $statResponse
 * @return array|null
 */
function formatVideoListItems($items, $statResponse)
{
  if (!isset($items)) {
    return null;
  }

  $result = [];

  // Loop all videos and make new array with specific data.
  foreach ($items as $index => $item) {
    $snippet = $item['snippet'];
    array_push($result, [
      'id' => $item['id']['videoId'],
      'channelId' => $snippet['channelId'],
      'channelTitle' => $snippet['channelTitle'],
      'description' => $snippet['description'],
      'publishedAt' => $snippet['publishedAt'],
      'title' => $snippet['title'],
      'thumbnails' => $snippet['thumbnails'],
      'statistics' => $statResponse['items'][$index]['statistics'],
    ]);
  }

  return $result;
}

/**
 * Get file name of video.
 * Return file name if download available null otherwise.
 *
 * @param $videoId
 * @param $formatCode
 * @return mixed|null
 */
function getFileName($videoId, $formatCode)
{
  global $url;
  exec(
    "youtube-dl -f \"$formatCode\" --get-filename \"$url$videoId\"",
    $output,
    $return
  );
  if ($return != 0) {
    return null;
  }
  return $output[0];
}

/**
 * Get available video qualities.
 * Return qualities on download available null otherwise.
 *
 * @param string $videoId
 * @return array|null
 */
function getVideoQuality(string $videoId)
{
  exec(
    "youtube-dl -F \"https://youtube.com/watch?v=$videoId\"",
    $output,
    $return
  );
  if ($return != 0) {
    return null;
  }
  $output = array_values($output);

  // Loop output of command above line by line. Make array of quality using regex.
  $result = [];
  foreach ($output as $quality) {
    if (
      preg_match_all(
        '/^(?<formatCode>[0-9]+)\s+(?<extension>[^\s]+)\s+(?<resolution>audio only|[[0-9]+x[0-9]+)\s+(?<note>.*)$/',
        $quality,
        $match
      )
    ) {
      array_push($result, [
        'formatCode' => $match['formatCode'][0],
        'extension' => $match['extension'][0],
        'resolution' => $match['resolution'][0],
        'note' => $match['note'][0],
      ]);
    }
  }
  return $result;
}

/**
 * Validate video quality.
 * Return true if valid false otherwise.
 *
 * @param string $videoId
 * @param string $quality
 * @return bool
 */
function validateVideoQuality(string $videoId, string $quality)
{
  $validQualities = array_column(getVideoQuality($videoId), 'formatCode');
  if ($validQualities == null) {
    return false;
  }
  return in_array($quality, $validQualities);
}
