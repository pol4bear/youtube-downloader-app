<?php
require_once 'base.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

function isValidEmail(string $email)
{
  $emailRegex =
    '/^[_\.0-9a-zA-Z-]+@([0-9a-zA-Z][0-9a-zA-Z-]+\.)+[a-zA-Z]{2,6}$/i';
  return @preg_match($emailRegex, $email) !== false;
}

function isEmailAvailable(string $email)
{
  if (!isValidEmail($email)) {
    badRequest();
  }

  $conn = getDBConnector();

  if (!$conn) {
    return getError(4);
  }

  $stmt = $conn->prepare('SELECT * FROM users WHERE email=?');
  $stmt->bind_param('s', $email);
  if (!$stmt->execute()) {
    return getError(4);
  }

  $result = $stmt->get_result();

  if ($result === false) {
    $stmt->close();
    return getError(4);
  }

  if ($result->num_rows == 0) {
    $stmt->close();
    return [200, makeResult(true, ['email' => $email])];
  }

  $stmt->close();
  return getError(5);
}

function emailVerification(string $auth)
{
  session_start();

  if (!isset($_SESSION['authTime'])) {
    unset($_SESSION['authEmail']);
    unset($_SESSION['authTime']);
    badRequest();
  }

  if (time() - $_SESSION['authTime'] > 300) {
    unset($_SESSION['authEmail']);
    unset($_SESSION['authTime']);
    badRequest();
  }

  if (!isset($_SESSION['auth'])) {
    unset($_SESSION['authEmail']);
    unset($_SESSION['authTime']);
    badRequest();
  }

  if ($auth === $_SESSION['auth']) {
    unset($_SESSION['auth']);
    return [200, makeResult(true, ['email' => $_SESSION['email']])];
  }

  return getError(7);
}

function sendAuthEmail(string $email)
{
  global $config;

  session_start();
  $random = rand(0, 9999);
  $auth = str_pad($random, 4, '0', STR_PAD_LEFT);
  $_SESSION['auth'] = $auth;
  $_SESSION['authEmail'] = $email;
  $_SESSION['authTime'] = time();

  $mail = new PHPMailer(true);

  try {
    $mail->isSMTP();
    $mail->Host = $config['smtp_server'];
    $mail->SMTPAuth = true;
    $mail->Username = $config['email_id'];
    $mail->Password = $config['email_pw'];
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port = $config['smtp_port'];

    $mail->setFrom($config['email_id'], 'YouTube Downloader');
    $mail->addAddress($email);

    $mail->isHTML(true);
    $mail->Subject = 'YouTube Downloader app verification code: ' . $auth;
    $mail->Body =
      'YouTube Downloader app verification code: <b>' . $auth . '</b>';
    $mail->AltBody = 'YouTube Downloader app verification code: ' . $auth;

    $mail->send();
    return [200, makeResult(true, ['email' => $email])];
  } catch (Exception $e) {
    return getError(6);
  }
}

function register(string $username, string $password, string $salt)
{
  session_start();
  $email = $_SESSION['authEmail'];
  if ($email == null) {
    badRequest();
  }

  $conn = getDBConnector();

  if (!$conn) {
    return getError(4);
  }

  $stmt = $conn->prepare(
    'INSERT INTO users (email, username, password, salt) VALUES(?, ?, ?, ?)'
  );
  $stmt->bind_param('ssss', $email, $username, $password, $salt);
  if (!$stmt->execute()) {
    $stmt->close();
    return getError(5);
  }

  session_unset();
  session_destroy();
  $stmt->close();

  return [200, makeResult(true, ['email' => $email])];
}

function unregister()
{
  session_start();
  $email = $_SESSION['email'];

  if (!isset($email)) {
    badRequest();
  }

  $conn = getDBConnector();
  if (!$conn) {
    return getError(4);
  }

  $conn->query("DELETE FROM users WHERE email=\"" . $email . "\"");

  return [200, makeResult(true, ['email' => $email])];
}

function changePassword(string $password, string $salt)
{
  session_start();
  $email = $_SESSION['authEmail'];
  if ($email == null) {
    badRequest();
  }

  $conn = getDBConnector();

  if (!$conn) {
    return getError(4);
  }

  $stmt = $conn->prepare('UPDATE users SET password=?, salt=? WHERE email=?');
  $stmt->bind_param('sss', $password, $salt, $email);
  if (!$stmt->execute()) {
    return getError(5);
  }

  session_unset();
  session_destroy();

  return [200, makeResult(true, ['email' => $email])];
}

function changeInfo($username, $password, $newPassword, $salt)
{
  session_start();
  $email = $_SESSION['email'];
  if ($email == null) {
    badRequest();
  }

  $conn = getDBConnector();

  if (!$conn) {
    return getError(4);
  }

  $stmt = $conn->prepare(
    'SELECT no, email, username, password, rank FROM users WHERE email=?'
  );
  $stmt->bind_param('s', $email);

  if (!$stmt->execute()) {
    return getError(4);
  }

  $result = $stmt->get_result();

  if ($result->num_rows == 0) {
    return getError(8);
  }
  $row = $result->fetch_array();
  if ($row[3] != $password) {
    return getError(8);
  }

  if (
    isset($newPassword) &&
    isset($salt) &&
    $newPassword != '' &&
    $salt != ''
  ) {
    $stmt = $conn->prepare('UPDATE users SET password=?, salt=? WHERE email=?');
    $stmt->bind_param('sss', $newPassword, $salt, $email);
    if (!$stmt->execute()) {
      return getError(5);
    }
  }

  if (isset($username)) {
    $_SESSION['username'] = $username;
    $stmt = $conn->prepare('UPDATE users SET username=? WHERE email=?');
    $stmt->bind_param('ss', $username, $email);
    if (!$stmt->execute()) {
      return getError(5);
    }
  }

  return [200, makeResult(true, ['email' => $email])];
}

function getSalt(string $email)
{
  $conn = getDBConnector();

  if (!$conn) {
    return getError(4);
  }

  $stmt = $conn->prepare('SELECT salt FROM users WHERE email=?');
  $stmt->bind_param('s', $email);
  if (!$stmt->execute()) {
    return getError(4);
  }

  $result = $stmt->get_result();

  if ($result === false) {
    return getError(4);
  }

  if ($result->num_rows == 0) {
    return getError(8);
  }
  $row = $result->fetch_array();

  return [200, makeResult(true, ['salt' => $row[0]])];
}

function login(string $email, string $password, bool $remember)
{
  $conn = getDBConnector();

  if (!$conn) {
    return getError(4);
  }

  $stmt = $conn->prepare(
    'SELECT no, email, username, password, rank FROM users WHERE email=?'
  );
  $stmt->bind_param('s', $email);

  if (!$stmt->execute()) {
    return getError(4);
  }

  $result = $stmt->get_result();

  if ($result->num_rows == 0) {
    return getError(8);
  }
  $row = $result->fetch_array();
  if ($row[3] != $password) {
    return getError(8);
  }

  if ($remember) {
    ini_set('session.cookie_lifetime', 60 * 60 * 24 * 365);
    ini_set('session.gc_maxlifetime', 60 * 60 * 24 * 365);
  }
  session_start();
  $_SESSION['no'] = $row[0];
  $_SESSION['email'] = $row[1];
  $_SESSION['username'] = $row[2];
  $_SESSION['rank'] = $row[4];

  return [
    200,
    makeResult(true, [
      'email' => $row[1],
      'username' => $row[2],
      'rank' => $row[4],
    ]),
  ];
}

function isLoggedIn()
{
  session_start();
  if (!isset($_SESSION['email'])) {
    return getError(9);
  }

  return [
    200,
    makeResult(true, [
      'email' => $_SESSION['email'],
      'username' => $_SESSION['username'],
      'rank' => $_SESSION['rank'],
    ]),
  ];
}

function getMessages($page, $mode)
{
  session_start();
  if (!isset($_SESSION['email'])) {
    return getError(9);
  }

  $column = null;
  $query = null;
  switch ($mode) {
    case 'Received':
      $column = 'sender';
      $query =
        'SELECT SQL_CALC_FOUND_ROWS no, sender, title, content, time FROM messages WHERE receiver=? AND deleted_by_receiver=FALSE ORDER BY no DESC LIMIT ?, 10';
      break;
    case 'Sent':
      $column = 'receiver';
      $query =
        'SELECT SQL_CALC_FOUND_ROWS no, receiver, title, content, time FROM messages WHERE sender=? AND deleted_by_sender=FALSE ORDER BY no DESC LIMIT ?, 10';
      break;
    default:
      badRequest();
  }

  $conn = getDBConnector();

  if (!$conn) {
    return getError(4);
  }

  $start = ($page - 1) * 10;
  $stmt = $conn->prepare($query);
  $stmt->bind_param('si', $_SESSION['email'], $start);

  if (!$stmt->execute()) {
    $stmt->close();
    return getError(4);
  }
  $result = $stmt->get_result();
  $messages = [];
  while ($row = $result->fetch_array()) {
    $message = [
      'no' => $row['no'],
      $column => $row[$column],
      'time' => $row['time'],
      'title' => $row['title'],
      'content' => $row['content'],
    ];
    array_push($messages, $message);
  }
  $count = $conn->query('SELECT FOUND_ROWS() as count')->fetch_array()['count'];

  $stmt->close();
  return [
    200,
    makeResult(true, ['count' => (int) $count, 'messages' => $messages]),
  ];
}

function sendMessage($receiver, $title, $content)
{
  session_start();
  if (!isset($_SESSION['email'])) {
    return getError(9);
  }

  if ($receiver == $_SESSION['email']) {
    return getError(10);
  }

  $email_validate = json_decode(isEmailAvailable($receiver)[1], true);
  if ($email_validate['success'] || $email_validate['result']['code'] != 5) {
    return getError(8);
  }

  $conn = getDBConnector();

  if (!$conn) {
    return getError(4);
  }

  $title = htmlspecialchars($title);
  $content = htmlspecialchars($content);

  $stmt = $conn->prepare(
    'INSERT INTO messages (sender, receiver, title, content, time) VALUES(?, ?, ?, ?, UTC_TIMESTAMP())'
  );
  $stmt->bind_param('ssss', $_SESSION['email'], $receiver, $title, $content);

  if (!$stmt->execute()) {
    $stmt->close();
    return getError(4);
  }

  $stmt->close();

  return [200, makeResult(true, ['receiver' => $receiver, 'title' => $title])];
}

function deleteMessage($no)
{
  session_start();
  if (!isset($_SESSION['email'])) {
    return getError(9);
  }

  $conn = getDBConnector();

  if (!$conn) {
    return getError(4);
  }

  $stmt = $conn->prepare('SELECT sender, receiver FROM messages WHERE no=?');
  $stmt->bind_param('i', $no);

  if (!$stmt->execute()) {
    $stmt->close();
    return getError(4);
  }

  $result = $stmt->get_result();
  if ($result->num_rows == 0) {
    badRequest();
  }

  $row = $result->fetch_array();

  $query = null;
  if ($row['sender'] == $_SESSION['email']) {
    $query = 'UPDATE messages SET deleted_by_sender=TRUE WHERE no=?';
  } elseif ($row['receiver'] == $_SESSION['email']) {
    $query = 'UPDATE messages SET deleted_by_receiver=TRUE WHERE no=?';
  } else {
    badRequest();
  }

  $stmt = $conn->prepare($query);
  $stmt->bind_param('i', $no);

  if (!$stmt->execute()) {
    $stmt->close();
    return getError(4);
  }

  return [200, makeResult(true, ['no' => $no])];
}
