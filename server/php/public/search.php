<?php
require_once '../src/base.php';
require_once '../src/YouTubeSearch.php';

$query = isset($_GET['q']) ? $_GET['q'] : (isset($_POST['q']) ? $_POST['q'] : null);
$maxResults = isset($_GET['cnt']) ? $_GET['cnt'] : (isset($_POST['cnt']) ? $_POST['cnt'] : null);
$pageToken = isset($_GET['token']) ? $_GET['token'] : (isset($_POST['token']) ? $_POST['token'] : null);
if ($query == null) badRequest();

addApiHeader();
$result = getVideoList($query, $maxResults, $pageToken);
http_response_code($result[0]);
echo $result[1];
