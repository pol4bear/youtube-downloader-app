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
  $token = $config['token'];
  if (!isset($token)) {
    return null;
  }

  $apiClient = new Google_Client(['developer_key' => $token]);
  return new Google_Service_YouTube($apiClient);
}

/**
 * Get YouTube video array searched.
 * Return success/error result.
 *
 * @param string $query
 * @param string|null $maxResults
 * @param string|null $pageToken
 * @return array|null
 */
function getVideoList(
  string $query,
  string $maxResults = null,
  string $pageToken = null
) {
  global $config;

  $youtubeClient = getYouTubeClient();
  $regionCode = getIpInfo($_SERVER['REMOTE_ADDR'], 'countrycode');

  // Make GraphQL query to request.
  $apiQuery = [
    'type' => 'video',
    'q' => $query,
    'maxResults' =>
      is_numeric($maxResults) && ($maxResults >= 0 && $maxResults <= 50)
        ? (int) $maxResults
        : $config['max_results'],
    'regionCode' => isset($regionCode) ? $regionCode : $config['region_code'],
  ];
  if (isset($pageToken)) {
    $apiQuery['pageToken'] = $pageToken;
  }

  try {
    // Get list of YouTube videos.
    $searchResponse = $youtubeClient->search->listSearch('snippet', $apiQuery);
    if ($searchResponse['pageInfo']['totalResults'] == 0) {
      throw new InvalidArgumentException();
    }

    // Get statistics of YouTube videos searched above.
    $statResponse = $youtubeClient->videos->listVideos('statistics', [
      'id' => array_column(
        array_column($searchResponse['items'], 'id'),
        'videoId'
      ),
    ]);

    // Format results prettier.
    $items = formatVideoListItems($searchResponse['items'], $statResponse);
    if ($items == null) {
      throw new InvalidArgumentException();
    }

    // Make result to response.
    $result = [
      'nextPageToken' => $searchResponse['nextPageToken'],
      'prevPageToken' => $searchResponse['prevPageToken'],
      'pageInfo' => $searchResponse['pageInfo'],
      'items' => $items,
    ];

    // Return success result.
    return [200, makeResult(true, $result)];
  } catch (Google_Service_Exception $exception) {
    // Return error result on API daily limit.
    return getError(2);
  } catch (InvalidArgumentException $exception) {
    // Return error result on invalid user input.
    return getError(3);
  }
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
 * Get video info including available qualities.
 * Return success/error result.
 *
 * @param string $videoId
 * @return array|null
 */
function getVideoInfo(string $videoId)
{
  global $config;
  $youtubeClient = getYouTubeClient();
  $regionCode = getIpInfo($_SERVER['REMOTE_ADDR'], 'countrycode');

  try {
    // Get YouTube video snippet and statistics.
    $searchResponse = $youtubeClient->videos->listVideos('snippet,statistics', [
      'id' => $videoId,
      'regionCode' => isset($regionCode) ? $regionCode : $config['region_code'],
    ]);

    $video = $searchResponse['items'][0];

    // If video info not found throw invalid argument exception.
    if (!isset($video)) {
      throw new InvalidArgumentException();
    }

    // Make video info response.
    $videoSnippet = $video['snippet'];
    $result = [
      'id' => $video['id'],
      'channelId' => $videoSnippet['channelId'],
      'chanelTitle' => $videoSnippet['channelTitle'],
      'description' => $videoSnippet['description'],
      'publishedAt' => $videoSnippet['publishedAt'],
      'tags' => $videoSnippet['tags'],
      'title' => $videoSnippet['title'],
      'thumbnails' => $videoSnippet['thumbnails'],
      'statistics' => $video['statistics'],
      'qualities' => getVideoQuality($videoId),
    ];

    // Return success result.
    return [200, makeResult(true, $result)];
  } catch (Google_Service_Exception $exception) {
    // Return error result on API daily limit.
    return getError(2);
  } catch (InvalidArgumentException $exception) {
    // Return error result on invalid user input.
    return getError(3);
  }
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
  global $url;
  exec("youtube-dl -F \"$url$videoId\"", $output, $return);
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

/**
 * Make success/error result.
 * Return success/error result.
 *
 * @param bool $success
 * @param $result
 * @return false|string
 */
function makeResult(bool $success, $result)
{
  $result = [
    'success' => $success,
    'result' => $result,
  ];
  return json_encode($result, JSON_UNESCAPED_UNICODE);
}

/**
 * Print bad request result and exit.
 */
function badRequest()
{
  header('Content-Type: application/json; charset=UTF-8');
  $error = getError(1);
  http_response_code($error[0]);
  echo $error[1];
  exit(1);
}
