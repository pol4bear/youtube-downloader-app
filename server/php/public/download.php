<?php
require_once '../src/base.php';
require_once '../src/YouTubeSearch.php';

/**
 * Video id to download.
 * The download won't start without video id.
 */
$videoId = isset($_GET['v'])
  ? $_GET['v']
  : (isset($_POST['v'])
    ? $_POST['v']
    : null);
/**
 * Video quality format code to download.
 * It has to be a format code of "youtube-dl -F [URL]".
 * The default is best quality.
 */
$quality = isset($_GET['quality'])
  ? $_GET['quality']
  : (isset($_POST['quality'])
    ? $_POST['quality']
    : $config['default_quality']);

// Response error if video id or quality is not valid.
if ($videoId == null) {
  badRequest();
} elseif (!validateVideoQuality($videoId, $quality)) {
  badRequest();
} elseif (($fileName = getFileName($videoId, $quality)) == null) {
  badRequest();
}

// Make client detect transferred data as file.
addCorsHeader();
header('Access-Control-Expose-Headers: Content-Disposition');
header(
  "Content-Disposition: attachment; filename*=UTF-8''" . rawurlencode($fileName)
);
header('Content-Type: application/octet-stream');

// Transfer video data downloaded via youtube-dl to client.
$url = 'https://youtube.com/watch?v=' . $videoId;
passthru("youtube-dl -f \"$quality\" -o - \"$url\"");
