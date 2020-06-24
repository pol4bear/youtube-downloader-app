<?php

require_once '../src/base.php';
require_once '../src/UserManager.php';

$receiver = isset($_GET['receiver'])
    ? $_GET['receiver']
    : (isset($_POST['receiver'])
        ? $_POST['receiver']
        : null);
$title = isset($_GET['title'])
    ? $_GET['title']
    : (isset($_POST['title'])
        ? $_POST['title']
        : null);
$content = isset($_GET['content'])
    ? $_GET['content']
    : (isset($_POST['content'])
        ? $_POST['content']
        : null);

if (!isset($receiver) || !isset($title) || !isset($content)) badRequest();

addApiHeader();
$result = sendMessage($receiver, $title, $content);
http_response_code($result[0]);
echo $result[1];
