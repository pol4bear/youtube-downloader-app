<?php
    require_once 'vendor/autoload.php';
    use GraphQL\Error\Error;
    use GraphQL\Error\FormattedError;
    use GraphQL\GraphQL;
    use GraphQL\Type\Definition\ObjectType;
    use GraphQL\Type\Definition\Type;
    use GraphQL\Type\Schema;

    $youtube_fields = array();

    /**
     * Google YouTube Data API v3 Search:list GraphQL implement. Check https://developers.google.com/youtube/v3/docs/search/list for detail info.
     */
    class YouTubeSearch {
        /**
         * Google API Client.
         * @var Google_Client
         */
        private Google_Client $client;
        /**
         * Google YouTube Data Api v3 Client.
         * @var Google_Service_YouTube
         */
        private Google_Service_YouTube $youtube;
        /**
         * GraphQL schema validations.
         * @var array
         */
        private array $validates;
        /**
         * GraphQL schema keys.
         * @var array
         */
        private array $keys;
        /**
         * Parsed GraphQL query.
         * @var array
         */
        private array $queries;
        /**
         * GraphQL schemas.
         * @var Schema
         */
        private Schema $schema;

        /**
         * YouTubeSearch constructor.
         * @param string $api_key
         */
        public function __construct(string $api_key) {
            $this->client = new Google_Client();
            $this->client->setDeveloperKey($api_key);
            $this->youtube = new Google_Service_YouTube($this->client);
            $this->initialize();
        }

        /**
         * Get class fields.
         * @param string $name
         * @return array|null
         */
        public function get(string $name) {
            // Return field on valid $name null otherwise.
            switch($name) {
            case "parameters":
                return $this->keys;
            default:
                return null;
            }
        }

        /**
         * Get result of query using Google YouTube Data API v3.
         * @param string $query
         * @return array
         */
        public function query(string $query) {
            $query_result = null;

            // Make query for execute to Google YouTube Data API v3 and execute.
            $query = $this->make_query($query);
            $execute_result =  GraphQL::executeQuery($this->schema, $query)->toArray();

            // Check if there was an error while executing query.
            if (isset($execute_result["errors"])) {
                // On error make error result and set to $query_result.
                $query_result["success"] = false;
                $errors = array();
                foreach ($execute_result["errors"] as $error) {
                    $error_object = array();
                    $error_object["message"] = $error["message"];
                    array_push($errors, $error_object);
                }
                $query_result["errors"] = $errors;
            }
            else {
                // On success make success result and set to $query_result.
                $query_result["success"] = true;
                $query_result["result"] = $execute_result["data"];
            }

            return $query_result;
        }

        /**
         * Initialize requirements before use.
         */
        private function initialize() {
            // Initialize schema validation methods
            $this->validates = [
                "part" => function (string $input) { return preg_match("/^(?:id|snippet)(?:,(?:id|snippet))?$/", $input) == 1; },
                "channelId" => function (string $input) { return true; },
                "channelType" => function (string $input) { return preg_match("/^(?:any|show)$/", $input) == 1; },
                "eventType" => function (string $input) { return preg_match("/^(?:completed|live|upcoming)$/", $input) == 1; },
                "maxResults" => function (string $input) { return preg_match("/^(?:[1-4]?[0-9]|50)$/", $input) == 1; },
                "order" => function (string $input) { return preg_match("/^(?:data|rating|relevance|title|videoCount|viewCount)$/", $input) == 1; },
                "pageToken" => function (string $input) { return true; },
                "publishedAfter" => function (string $input) { return preg_match("/^(?:[1-9][0-9]{1,3}|[1-9])-(?:0[1-9]|1[0-2])-(?:[0-2][0-9]|3[01])T(?:[01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/", $input) == 1; },
                "publishedBefore" => function (string $input) { return preg_match("/^(?:[1-9][0-9]{1,3}|[1-9])-(?:0[1-9]|1[0-2])-(?:[0-2][0-9]|3[01])T(?:[01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/", $input) == 1; },
                "q" => function (string $input) { return true; },
                "regionCode" => function (string $input) { return preg_match("/^[A-Z]{2}$/", $input) == 1; },
                "saveSearch" => function (string $input) { return preg_match("/^(?:moderate|none|strict)$/", $input) == 1; },
                "type" => function (string $input) { return preg_match("/^(?:channel|playlist|video)$/", $input) == 1; },
                "videoCaption" => function (string $input) { return preg_match("/^(?:any|closedCaption|none)$/", $input) == 1; },
                "videoCategoryId" => function (string $input) { return true; },
                "videoDefinition" => function (string $input) { return preg_match("/^(?:any|high|standard)$/", $input) == 1; },
                "videoDimension" => function (string $input) { return preg_match("/^(?:2d|3d|any)$/", $input) == 1; },
                "videoDuration" => function (string $input) { return preg_match("/^(?:any|long|medium|short)$/", $input) == 1; },
                "videoEmbeddable" => function (string $input) { return preg_match("/^(?:any|true)$/", $input) == 1; },
                "videoLicense" => function (string $input) { return preg_match("/^(?:any|creativeCommon|youtube)$/", $input) == 1; },
                "videoSyndicated" => function (string $input) { return preg_match("/^(?:any|true)$/", $input) == 1; },
                "videoType" => function (string $input) { return preg_match("/^(?:any|episode|movie)$/", $input) == 1; },
                "fields" => function (array $input) { if (count($input) > 0 ) return true; return false; }
            ];
            // Initialize schema key
            $this->keys = array_keys($this->validates);

            $this->queries = array();
            $this->queries['query'] = new ObjectType([
                'name' => 'Query',
                'fields' => [
                    'search' => [
                        'type' => Type::string(),
                        'args' => [
                            'channelId' => ['type' => Type::string()],
                            'channelType' => ['type' => Type::string()],
                            'eventType' => ['type' => Type::string()],
                            'maxResults' => ['type' => Type::string()],
                            'order' => ['type' => Type::string()],
                            'pageToken' => ['type' => Type::string()],
                            'publishedAfter' => ['type' => Type::string()],
                            'publishedBefore' => ['type' => Type::string()],
                            'q' => ['type' => Type::string()],
                            'regionCode' => ['type' => Type::string()],
                            'saveSearch' => ['type' => Type::string()],
                            'type' => ['type' => Type::string()],
                            'videoCaption' => ['type' => Type::string()],
                            'videoCategoryId' => ['type' => Type::string()],
                            'videoDefinition' => ['type' => Type::string()],
                            'videoDimension' => ['type' => Type::string()],
                            'videoDuration' => ['type' => Type::string()],
                            'videoEmbeddable' => ['type' => Type::string()],
                            'videoLicense' => ['type' => Type::string()],
                            'videoSyndicated' => ['type' => Type::string()],
                            'videoType' => ['type' => Type::string()]
                        ],
                        'resolve' => function($args) {
                            return $this->search($args);
                        }
                    ]
                ]
            ]);
            $this->schema = new Schema($this->queries);
        }

        /**
         * Validate query and make query for execute to Google YouTube Data API v3.
         * @param string $query
         * @return string|null
         */
        private function make_query(string $query) {
            return $query;
        }

        private function format_error(Error $error) {
            echo "Format\n";
            print_r($error);
            return FormattedError::createFromException($error);
        }

        private function handle_error(array $errors, callable $formatter) {
            echo "Handle\n";
            print_r($formatter);
            print_r($errors);
            return array_map($formatter, $errors);
        }

        private function make_result($success, $error = null, $result = null) {
            $result = [];
            $result['success'] = $success;
            if (isset($error)) {
                $result['error'] = $error;
            }
            if (isset($result)) {
                $result['result'];
            }
        }

        private function search($args) {
            $keys = array_keys($args);
            return "good";
        }
    }