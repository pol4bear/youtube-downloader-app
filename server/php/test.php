<?php
    require_once "base.php";
    require_once "YouTubeSearch.php";

    $query = file_get_contents('php://input');
    $youtube_search = new YouTubeSearch($config["api_key"]);
    $result =  $youtube_search->query($query);
    header('Content-Type: application/json');
    echo json_encode($result);
