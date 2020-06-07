<?php
    require_once 'base.php';

    function getYouTubeClient() {
        global $config;
        $token = $config['token'];
        if (!isset($token))
            return null;

        $apiClient = new Google_Client(['developer_key' => $token]);
        return new Google_Service_YouTube($apiClient);
    }

    function getVideoList(string $query, string $maxResults = null, string $pageToken = null) {
        global $config;
        $youtubeClient = getYouTubeClient();
        $regionCode = getIpInfo($_SERVER['REMOTE_ADDR'], 'countrycode');

        $apiQuery = array(
            'type' => 'video',
            'q' => $query,
            'maxResults' => is_numeric($maxResults) && ($maxResults >= 0 && $maxResults <= 50) ? (int)$maxResults : $config['max_results'],
            'regionCode' => isset($regionCode) ? $regionCode : $config['region_code']
        );
        if (isset($pageToken)) $apiQuery['pageToken'] = $pageToken;

        try {
            $searchResponse = $youtubeClient->search->listSearch('snippet', $apiQuery);
            if ($searchResponse['pageInfo']['totalResults'] == 0) throw new InvalidArgumentException();

            $statResponse = $youtubeClient->videos->listVideos('statistics', array(
                'id' => array_column(array_column($searchResponse['items'], 'id'), 'videoId')
            ));

            $items = formatVideoListItems($searchResponse['items'], $statResponse);
            if ($items == null) throw new InvalidArgumentException();

            $result = array (
                'nextPageToken' => $searchResponse['nextPageToken'],
                'prevPageToken' => $searchResponse['prevPageToken'],
                'pageInfo' => $searchResponse['pageInfo'],
                'items' => $items
            );

            return array(200, makeResult(true, $result));
        }
        catch(Google_Service_Exception $exception) {
            return getError(2);
        }
        catch(InvalidArgumentException $exception) {
            return getError(3);
        }
    }

    function formatVideoListItems($items, $statResponse) {
        if (!isset($items)) return null;

        $result = array();

        foreach ($items as $index => $item) {
            $snippet = $item['snippet'];
            array_push($result, array(
                'id' => $item['id']['videoId'],
                'channelId' => $snippet['channelId'],
                'channelTitle' => $snippet['channelTitle'],
                'description' => $snippet['description'],
                'publishedAt' => $snippet['publishedAt'],
                'title' => $snippet['title'],
                'thumbnails' => $snippet['thumbnails'],
                'statistics' => $statResponse['items'][$index]['statistics']
            ));
        }

        return $result;
    }

    function getVideoInfo(string $videoId) {
        global $config;
        $youtubeClient = getYouTubeClient();
        $regionCode = getIpInfo($_SERVER['REMOTE_ADDR'], 'countrycode');

        try {
            $searchResponse = $youtubeClient->videos->listVideos('snippet,statistics', array(
                'id' => $videoId,
                'regionCode' => isset($regionCode) ? $regionCode : $config['region_code']
            ));

            $video = $searchResponse['items'][0];
            if (!isset($video)) throw new InvalidArgumentException();
            $videoSnippet = $video['snippet'];
            $result = array(
                'id' => $video['id'],
                'channelId' => $videoSnippet['channelId'],
                'chanelTitle' => $videoSnippet['channelTitle'],
                'description' => $videoSnippet['description'],
                'publishedAt' => $videoSnippet['publishedAt'],
                'tags' => $videoSnippet['tags'],
                'title' => $videoSnippet['title'],
                'quality' => getVideoQuality($videoId)
            );

            return array(200, makeResult(true, $result));
        }
        catch(Google_Service_Exception $exception) {
            return getError(2);
        }
        catch(InvalidArgumentException $exception) {
            return getError(3);
        }
    }

    function getFileName($videoId, $quality) {
        global $url;
        exec("youtube-dl -f \"$quality\" --get-filename \"$url$videoId\"", $output, $return);
        if ($return != 0) return null;
        return $output[0];
    }

    function getVideoQuality(string $videoId) {
        global $url;
        exec("youtube-dl -F \"$url$videoId\"", $output, $return);
        if ($return != 0) return null;
        $output = array_values($output);
        $result = array();
        foreach ($output as $quality) {
            if (preg_match_all("/^(?<formatCode>[0-9]+)\s+(?<extension>[^\s]+)\s+(?<resolution>audio only|[[0-9]+x[0-9]+)\s+(?<note>.*)$/", $quality, $match))
                array_push($result, array(
                    'formatCode' => $match['formatCode'][0],
                    'extension' => $match['extension'][0],
                    'resolution' => $match['resolution'][0],
                    'note' => $match['note'][0]
                ));
        }
        return $result;
    }

    function validateVideoQuality(string $videoId, string $quality) {
        $validQualities = array_column(getVideoQuality($videoId), 'formatCode');
        if ($validQualities == null) return false;
        if (in_array($quality, $validQualities))
            return true;
        return false;
    }

    function makeResult(bool $success, $result) {
        $result = [
            'success' => $success,
            'result' => $result
        ];
        return json_encode($result, JSON_UNESCAPED_UNICODE);
    }

    function badRequest() {
        header("Content-Type: application/json; charset=UTF-8" );
        $error = getError(1);
        http_response_code($error[0]);
        echo $error[1];
        exit (1);
    }
