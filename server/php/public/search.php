<?php
require_once '../src/base.php';
require_once '../src/YouTubeSearch.php';

/**
 * Video search query.
 * Search won't work without query.
 */
$query = isset($_GET['q'])
  ? $_GET['q']
  : (isset($_POST['q'])
    ? $_POST['q']
    : null);
/**
 * Search result count per request.
 * Valid value is 0 to 50.
 */
$maxResults = isset($_GET['cnt'])
  ? (int) $_GET['cnt']
  : (isset($_POST['cnt'])
    ? (int) $_POST['cnt']
    : null);
if (!is_numeric($maxResults) || $maxResults < 0 || $maxResults > 50) {
  $maxResults = $config['default_max_results'];
}
/**
 * Page token to search.
 * Next/Prev page can be searched via this token.
 */
$pageToken = isset($_GET['token'])
  ? $_GET['token']
  : (isset($_POST['token'])
    ? $_POST['token']
    : null);

// Response error if no query.
if ($query == null) {
  badRequest();
}

// Get video list and print
$youtubeClient = getYouTubeClient();
$regionCode = getIpInfo($_SERVER['REMOTE_ADDR'], 'countrycode');

// Make GraphQL query to request.
$apiQuery = [
  'type' => 'video',
  'q' => $query,
  'maxResults' => $maxResults,
  'regionCode' => isset($regionCode) ? $regionCode : $config['default_region'],
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
  $data = [
    'nextPageToken' => $searchResponse['nextPageToken'],
    'prevPageToken' => $searchResponse['prevPageToken'],
    'pageInfo' => $searchResponse['pageInfo'],
    'items' => $items,
  ];

  // Set success result
  $result = [
    200,
    json_encode(['success' => true, 'data' => $data], JSON_UNESCAPED_UNICODE),
  ];
} catch (Google_Service_Exception $exception) {
  // Set API daily limit error result
  return getErrorMessage(2);
} catch (InvalidArgumentException $exception) {
  // Set invalid input error result
  return getErrorMessage(3);
}

// Make client detect data as json
addApiHeader();
http_response_code($result[0]);
echo $result[1];
