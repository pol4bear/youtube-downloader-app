<?php
require_once '../src/base.php';
require_once '../src/UserManager.php';

$page = isset($_GET['page'])
    ? $_GET['page']
    : (isset($_POST['page'])
        ? $_POST['page']
        : null);

if (!isset($page)) badRequest();

addApiHeader();
$result = getMessages($page);
http_response_code($result[0]);
echo $result[1];
