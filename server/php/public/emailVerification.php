<?php
require_once '../src/base.php';
require_once '../src/UserManager.php';

$auth = isset($_GET['auth'])
    ? $_GET['auth']
    : (isset($_POST['auth'])
        ? $_POST['auth']
        : null);

if (!isset($auth)) badRequest();

$result = emailVerification($auth);
addApiHeader();
http_response_code($result[0]);
echo $result[1];
