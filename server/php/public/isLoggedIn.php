<?php
require_once '../src/base.php';
require_once '../src/UserManager.php';

addApiHeader();
$result = isLoggedIn();
http_response_code($result[0]);
echo $result[1];
