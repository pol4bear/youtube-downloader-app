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
  ? $_GET['cnt']
  : (isset($_POST['cnt'])
    ? $_POST['cnt']
    : null);
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

// Make client detect data as json
addApiHeader();

// Get video list and print
$result = getVideoList($query, $maxResults, $pageToken);
http_response_code($result[0]);
echo $result[1];
