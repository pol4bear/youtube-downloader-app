<?php
require_once 'vendor/autoload.php';
use Yosymfony\Toml\Toml;

// Parse config from config.toml
$config = Toml::ParseFile(__DIR__ . '/config.toml');
initializeConfig();
$url = $config['url'];

/**
 * Initialize configs that are not exist as default
 */
function initializeConfig()
{
  global $config;

  $defaults = [
    'token' => null,
    'max_results' => 10,
    'region_code' => 'KR',
    'quality' => 'best',
    'url' => 'https://youtube.com/watch?v=',
  ];

  $keys = array_keys($defaults);

  foreach ($keys as $key) {
    if (!isset($config[$key])) {
      $config[$key] = $defaults[$key];
    }
  }
}

/**
 * Get error message and response code by error code.
 *
 * @param int $code
 * @return array|null
 */
function getError(int $code)
{
  $responseCode = 500;
  $error = ['code' => $code];
  switch ($code) {
    case 1:
      $responseCode = 400;
      $error['message'] = 'Bad request.';
      break;
    case 2:
      $responseCode = 503;
      $error['message'] = 'Daily API request limit try again later.';
      break;
    case 3:
      $responseCode = 404;
      $error['message'] = 'Requested item(s) not found';
      break;
    case 4:
      $responseCode = 503;
      $error['message'] = 'Cannot connect to database server.';
      break;
    case 5:
      $responseCode = 200;
      $error['message'] = 'Email is already in use.';
      break;
    case 6:
      $responseCode = 503;
      $error['message'] = "Error while sending email.";
      break;
    case 7:
      $responseCode = 200;
      $error['message'] = 'Verification failed.';
      break;
    default:
      return null;
  }

  return [$responseCode, makeResult(false, $error)];
}

/**
 * Add headers to make client detect data as json and allow CORS.
 */
function addApiHeader()
{
  $url = parse_url($_SERVER['HTTP_REFERER']);
  header('Content-Type: application/json; charset=UTF-8');
  if (count($url))
    header('Access-Control-Allow-Origin: '.$url['scheme'].'://'.$url['host'].':'.$url['port']);
  else
    header('Access-Control-Allow-Origin: *');
  header('Access-Control-Allow-Credentials: true');
}

/**
 * Make success/error result.
 * Return success/error result.
 *
 * @param bool $success
 * @param $result
 * @return false|string
 */
function makeResult(bool $success, $result)
{
  $result = [
    'success' => $success,
    'result' => $result,
  ];
  return json_encode($result, JSON_UNESCAPED_UNICODE);
}

/**
 * Print bad request result and exit.
 */
function badRequest()
{
  header('Content-Type: application/json; charset=UTF-8');
  $error = getError(1);
  http_response_code($error[0]);
  echo $error[1];
  exit(1);
}

/**
 * Get location info via ip.
 *
 * @param null $ip
 * @param string $purpose
 * @param bool $deep_detect
 * @return array|string|null
 */
function getIpInfo($ip = null, $purpose = 'location', $deep_detect = true)
{
  $output = null;
  if (filter_var($ip, FILTER_VALIDATE_IP) === false) {
    $ip = $_SERVER['REMOTE_ADDR'];
    if ($deep_detect) {
      if (filter_var(@$_SERVER['HTTP_X_FORWARDED_FOR'], FILTER_VALIDATE_IP)) {
        $ip = $_SERVER['HTTP_X_FORWARDED_FOR'];
      }
      if (filter_var(@$_SERVER['HTTP_CLIENT_IP'], FILTER_VALIDATE_IP)) {
        $ip = $_SERVER['HTTP_CLIENT_IP'];
      }
    }
  }
  $purpose = str_replace(
    ['name', "\n", "\t", ' ', '-', '_'],
    null,
    strtolower(trim($purpose))
  );
  $support = [
    'country',
    'countrycode',
    'state',
    'region',
    'city',
    'location',
    'address',
  ];
  $continents = [
    'AF' => 'Africa',
    'AN' => 'Antarctica',
    'AS' => 'Asia',
    'EU' => 'Europe',
    'OC' => 'Australia (Oceania)',
    'NA' => 'North America',
    'SA' => 'South America',
  ];
  if (filter_var($ip, FILTER_VALIDATE_IP) && in_array($purpose, $support)) {
    $ipdat = @json_decode(
      file_get_contents('http://www.geoplugin.net/json.gp?ip=' . $ip)
    );
    if (@strlen(trim($ipdat->geoplugin_countryCode)) == 2) {
      switch ($purpose) {
        case 'location':
          $output = [
            'city' => @$ipdat->geoplugin_city,
            'state' => @$ipdat->geoplugin_regionName,
            'country' => @$ipdat->geoplugin_countryName,
            'country_code' => @$ipdat->geoplugin_countryCode,
            'continent' => @$continents[
              strtoupper($ipdat->geoplugin_continentCode)
            ],
            'continent_code' => @$ipdat->geoplugin_continentCode,
          ];
          break;
        case 'address':
          $address = [$ipdat->geoplugin_countryName];
          if (@strlen($ipdat->geoplugin_regionName) >= 1) {
            $address[] = $ipdat->geoplugin_regionName;
          }
          if (@strlen($ipdat->geoplugin_city) >= 1) {
            $address[] = $ipdat->geoplugin_city;
          }
          $output = implode(', ', array_reverse($address));
          break;
        case 'city':
          $output = @$ipdat->geoplugin_city;
          break;
        case 'state':
          $output = @$ipdat->geoplugin_regionName;
          break;
        case 'region':
          $output = @$ipdat->geoplugin_regionName;
          break;
        case 'country':
          $output = @$ipdat->geoplugin_countryName;
          break;
        case 'countrycode':
          $output = @$ipdat->geoplugin_countryCode;
          break;
      }
    }
  }
  return $output;
}

function getDBConnector() {
  global $config;
  $conn = new mysqli(
      $config['db_host'],
      $config['db_username'],
      $config['db_password'],
      $config['db_name']
  );

  if ($conn->connect_error)
    return null;

  return $conn;
}
?>
