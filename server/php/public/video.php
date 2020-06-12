<?php
require_once '../src/base.php';
require_once '../src/YouTubeSearch.php';

/**
 * Video id to search info.
 * Search won't work without video id.
 */
$video = isset($_GET['v'])
  ? $_GET['v']
  : (isset($_POST['v'])
    ? $_POST['v']
    : null);

// Response error if no video id.
if ($video == null) {
  badRequest();
}

// Make client detect data as json
addApiHeader();

// Get video info and print
$result = getVideoInfo($video);
http_response_code($result[0]);
echo $result[1];
