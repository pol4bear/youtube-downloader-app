<?php
require_once '../src/base.php';
require_once '../src/UserManager.php';

$password = isset($_GET['password'])
    ? $_GET['password']
    : (isset($_POST['password'])
        ? $_POST['password']
        : null);
$newPassword = isset($_GET['newPassword'])
    ? $_GET['newPassword']
    : (isset($_POST['newPassword'])
        ? $_POST['newPassword']
        : null);
$salt = isset($_GET['salt'])
    ? $_GET['salt']
    : (isset($_POST['salt'])
        ? $_POST['salt']
        : null);
$username = isset($_GET['username'])
    ? $_GET['username']
    : (isset($_POST['username'])
        ? $_POST['username']
        : null);

$password = urldecode($password);
$password = str_replace(" ", "+", $password);
$salt = urldecode($salt);
$salt = str_replace(" ", "+", $salt);
$newPassword = urldecode($newPassword);
$newPassword = str_replace(" ", "+", $newPassword);

addApiHeader();
$result = changeInfo($username, $password, $newPassword, $salt);
http_response_code($result[0]);
echo $result[1];

