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
    if (!isset($_SESSION['auth']))
        badRequest();

    if ($auth === $_SESSION['auth']) {
        session_cache_expire(0);
        unset($_SESSION['auth']);
        return [200, makeResult(true, ['email' => $_SESSION['email']])];
    }

    return getError(7);
}

function sendAuthEmail(string $email) {
    global $config;

    session_start();
    session_cache_expire(60 * 5);
    $random = rand(0, 9999);
    $auth = str_pad($random, 4, '0', STR_PAD_LEFT);
    $_SESSION['auth'] = $auth;
    $_SESSION['email'] = $email;

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
