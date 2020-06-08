<?php
require_once '../src/base.php';
require_once '../src/YouTubeSearch.php';

$videoId = isset($_GET['v']) ? $_GET['v'] : (isset($_POST['v']) ? $_POST['v'] : null);
$quality = isset($_GET['quality']) ? $_GET['quality'] : (isset($_POST['quality']) ? $_POST['quality'] : getConfig('quality'));

if ($videoId == null) badRequest();
else if (!validateVideoQuality($videoId, $quality)) badRequest();
else if (($fileName = getFileName($videoId, $quality)) == null) badRequest();

header("Content-Disposition: attachment; filename=\"".$fileName."\"" );
header("Content-Type: application/octet-stream");
$url = "https://youtube.com/watch?v=".$videoId;
passthru("youtube-dl -f \"$quality\" -o - \"$url\"");
