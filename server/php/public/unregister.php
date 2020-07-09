<?php
require_once '../src/base.php';
require_once '../src/UserManager.php';

$result = unregister();
addApiHeader();
http_response_code($result[0]);
echo $result[1];
