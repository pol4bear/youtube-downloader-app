<?php
require_once '../src/base.php';
require_once '../src/UserManager.php';

$no = isset($_GET['no'])
    ? $_GET['no']
    : (isset($_POST['no'])
        ? $_POST['no']
        : null);

if (!isset($no)) badRequest();

$result = deleteMessage($no);
addApiHeader();
http_response_code($result[0]);
echo $result[1];
