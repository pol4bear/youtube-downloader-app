<?php
    require_once 'base.php';

    function getVideoList(string $query, int $max_results = null) {
        $api_client = new Google_Client();
        $api_client->setDeveloperKey(getToken());
        $youtube_client = new Google_Service_YouTube($api_client);

        $region_code = getIpInfo($_SERVER['REMOTE_ADDR'], 'countrycode');

        $htmlBody = '';
        $searchResponse = $youtube_client->search->listSearch('id,snippet', array(
            'type' => 'video',
            'q' => $query,
            'maxResults' => isset($max_result) ? $max_results : getMaxResults(),
            'regionCode' => isset($region_code) ? $region_code : 'KR'
        ));
    }



