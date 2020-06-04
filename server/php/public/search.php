<?php
    require 'base.php';

    $result = null;
    $query = isset($_GET['q']) ? $_GET['q'] : (isset($_POST['q']) ? $_POST['q'] : null);
    $max_result = isset($_GET['cnt']) ? $_GET['cnt'] : (isset($_POST['cnt']) ? $_POST['cnt'] : null);
    $region_code = ip_info($_SERVER['REMOTE_ADDR'], 'countrycode');
    echo $_SERVER['REMOTE_ADDR'];
    print_r($region_code);

    if ($query == null) {
        $result->success = False;
        $result->error_no = 1;
        $result->error_message = "There's no query requested";
        echo json_encode($result);
        exit(1);
    }

    $DEVELOPER_KEY = getApiKey();
    $client = new Google_Client();
    $client->setDeveloperKey($DEVELOPER_KEY);
    $youtube = new Google_Service_YouTube($client);

    $htmlBody = '';
    $searchResponse = $youtube->search->listSearch('id,snippet', array(
        'type' => 'video',
        'q' => $query,
        'maxResults' => isset($max_result) ? $max_result : getMaxResults(),
        'regionCode' => isset($region_code) ? $region_code : 'KR'
    ));

    echo json_encode($searchResponse);