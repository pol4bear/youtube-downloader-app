<?php
require_once '../src/base.php';
require_once '../src/UserManager.php';

$email = isset($_GET['email'])
    ? $_GET['email']
    : (isset($_POST['email'])
        ? $_POST['email']
        : null);
$password = isset($_GET['password'])
    ? $_GET['password']
    : (isset($_POST['password'])
        ? $_POST['password']
        : null);
$remember = isset($_GET['remember'])
    ? $_GET['remember']
    : (isset($_POST['remember'])
        ? $_POST['remember']
        : null);

if (!isset($email) || !isset($password) || !isset($remember)) badRequest();
$password = urldecode($password);
$password = str_replace(" ", "+", $password);
$remember = filter_var($remember, FILTER_VALIDATE_BOOLEAN);

$result = login($email, $password, $remember);
addApiHeader();
http_response_code($result[0]);
echo $result[1];
