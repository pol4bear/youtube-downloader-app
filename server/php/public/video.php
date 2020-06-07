<?php
require_once '../src/base.php';
require_once '../src/YouTubeSearch.php';

$video = isset($_GET['v']) ? $_GET['v'] : (isset($_POST['v']) ? $_POST['v'] : null);
if ($video == null) badRequest();

addApiHeader();
$result = getVideoInfo($video);
http_response_code($result[0]);
echo $result[1];
