<?php
require_once "base.php";

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

function isValidEmail(string $email) {
    $emailRegex = "/^[_\.0-9a-zA-Z-]+@([0-9a-zA-Z][0-9a-zA-Z-]+\.)+[a-zA-Z]{2,6}$/i";
    return @preg_match($emailRegex, $email) !== FALSE;
}

function isEmailAvailable(string $email) {
    if (!isValidEmail($email))
        badRequest();

    $conn = getDBConnector();

    if (!$conn)
        return getError(4);

    $stmt = $conn->prepare("SELECT * FROM users WHERE email=?");
    $stmt->bind_param("s", $email);
    if (!$stmt->execute())
        return getError(4);

    $result = $stmt->get_result();

    if ($result === false)
        return getError(4);

    if (count($result->fetch_array()) == 0)
        return [200, makeResult(true, array('email' => $email))];

    return getError(5);
}

function emailVerification(string $auth) {
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

function sendAuthEmail(string $email) {
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
        $mail->Host       = $config['smtp_server'];
        $mail->SMTPAuth   = true;
        $mail->Username   = $config['email_id'];
        $mail->Password   = $config['email_pw'];
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port       = $config['smtp_port'];

        $mail->setFrom($config['email_id'], 'YouTube Downloader');
        $mail->addAddress($email);

        $mail->isHTML(true);
        $mail->Subject = 'YouTube Downloader app verification code: '.$auth;
        $mail->Body    = 'YouTube Downloader app verification code: <b>'.$auth.'</b>';
        $mail->AltBody = 'YouTube Downloader app verification code: '.$auth;

        $mail->send();
        return [200, makeResult(true, ['email' => $email])];
    }
    catch(Exception $e) {return getError(6);}
}

function register(string $username, string $password, string $salt) {
    session_start();
    $email = $_SESSION['authEmail'];
    if ($email == null)
        badRequest();

    $conn = getDBConnector();

    if (!$conn)
        return getError(4);

    $stmt = $conn->prepare("INSERT INTO users (email, username, password, salt) VALUES(?, ?, ?, ?)");
    $stmt->bind_param("ssss", $email, $username, $password, $salt);
    if (!$stmt->execute())
        return getError(5);

    session_unset();
    session_destroy();

    return [200, makeResult(true, ['email' => $email])];
}

function changePassword(string $password, string $salt) {
    session_start();
    $email = $_SESSION['authEmail'];
    if ($email == null)
        badRequest();

    $conn = getDBConnector();

    if (!$conn)
        return getError(4);

    $stmt = $conn->prepare("UPDATE users SET password=?, salt=? WHERE email=?");
    $stmt->bind_param("sss", $password, $salt, $email);
    if (!$stmt->execute())
        return getError(5);

    session_unset();
    session_destroy();

    return [200, makeResult(true, ['email' => $email])];
}

function changeInfo($username, $password, $newPassword, $salt)
{
    session_start();
    $email = $_SESSION['email'];
    if ($email == null)
        badRequest();

    $conn = getDBConnector();

    if (!$conn)
        return getError(4);

    $stmt = $conn->prepare("SELECT no, email, username, password, rank FROM users WHERE email=?");
    $stmt->bind_param("s", $email);

    if (!$stmt->execute())
        return getError(4);

    $result = $stmt->get_result();

    $row = $result->fetch_array();
    if (count($row) == 0) {
        return getError(8);
    } else if ($row[3] != $password) {
        return getError(8);
    }

    if (isset($newPassword) && isset($salt)) {
    $stmt = $conn->prepare("UPDATE users SET password=?, salt=? WHERE email=?");
    $stmt->bind_param("sss", $newPassword, $salt, $email);
    if (!$stmt->execute())
        return getError(5);
    }

    if (isset($username)) {
        $_SESSION['username'] = $username;
        $stmt = $conn->prepare("UPDATE users SET username=? WHERE email=?");
        $stmt->bind_param("ss", $username, $email);
        if (!$stmt->execute())
            return getError(5);
    }

    return [200, makeResult(true, ['email' => $email])];
}

function getSalt(string $email) {
    $conn = getDBConnector();

    if (!$conn)
        return getError(4);

    $stmt = $conn->prepare("SELECT salt FROM users WHERE email=?");
    $stmt->bind_param("s", $email);
    if (!$stmt->execute())
        return getError(4);

    $result = $stmt->get_result();

    if ($result === false)
        return getError(4);

    $row = $result->fetch_array();
    if (count($row) == 0)
        return getError(8);

    return [200, makeResult(true, array('salt' => $row[0]))];
}

function login(string $email, string $password, bool $remember) {
    $conn = getDBConnector();

    if (!$conn)
        return getError(4);

    $stmt = $conn->prepare("SELECT no, email, username, password, rank FROM users WHERE email=?");
    $stmt->bind_param("s", $email);

    if (!$stmt->execute())
        return getError(4);

    $result = $stmt->get_result();

    $row = $result->fetch_array();
    if (count($row) == 0) {
        return getError(8);
    }
    else if ($row[3] != $password) {
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

    return [200, makeResult(true, ['email' => $row[1], 'username' => $row[2], 'rank' => $row[4]])];
}

function isLoggedIn() {
    session_start();
    if (!isset($_SESSION['email']))
        return getError(9);

    return [200, makeResult(true, ['email' => $_SESSION['email'], 'username' => $_SESSION['username'], 'rank' => $_SESSION['rank']])];
}
