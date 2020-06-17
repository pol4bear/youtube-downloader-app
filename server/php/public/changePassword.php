<?php
require_once '../src/base.php';
require_once '../src/UserManager.php';

$password = isset($_GET['password'])
    ? $_GET['password']
    : (isset($_POST['password'])
        ? $_POST['password']
        : null);
$salt = isset($_GET['salt'])
    ? $_GET['salt']
    : (isset($_POST['salt'])
        ? $_POST['salt']
        : null);

if (!isset($password) || !isset($salt)) badRequest();

$result = changePassword($password, $salt);
addApiHeader();
http_response_code($result[0]);
echo $result[1];
