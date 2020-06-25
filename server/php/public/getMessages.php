<?php
require_once '../src/base.php';
require_once '../src/UserManager.php';

$page = isset($_GET['page'])
    ? $_GET['page']
    : (isset($_POST['page'])
        ? $_POST['page']
        : null);
$mode = isset($_GET['mode'])
    ? $_GET['mode']
    : (isset($_POST['mode'])
        ? $_POST['mode']
        : null);

if (!isset($page) || !isset($mode)) badRequest();

addApiHeader();
$result = getMessages($page, $mode);
http_response_code($result[0]);
echo $result[1];
