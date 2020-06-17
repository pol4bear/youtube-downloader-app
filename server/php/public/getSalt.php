<?php
require_once '../src/base.php';
require_once '../src/UserManager.php';

$email = isset($_GET['email'])
    ? $_GET['email']
    : (isset($_POST['email'])
        ? $_POST['email']
        : null);

if (!isset($email)) badRequest();

$result = getSalt($email, $password, $remember);
addApiHeader();
http_response_code($result[0]);
echo $result[1];
