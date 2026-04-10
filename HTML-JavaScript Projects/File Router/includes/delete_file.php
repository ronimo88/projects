<?php

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    require_once "config_session.php";

    if (isset($_SESSION['request_id'])) {
        $request_id = $_SESSION['request_id'];
    } else {
        header("Location: index.php");
    }


    $filename = $_POST['file'];
    $targetFile = "../requests/$request_id/" . $filename;

    $messages = [];

    if (file_exists($targetFile)) {
        if (unlink($targetFile)) {
            $text = "File '" . $filename . "' was deleted.";
            array_push($messages, $text);
        } else {
            $text = "Error deleting file '" . $filename . "'.";
            array_push($messages, $text);
        }
    } else {
        $text = "File '" . $filename . "' does not exist.";
        array_push($messages, $text);
    }

    $_SESSION['messages'] = $messages;

    header("Location: ../request.php?id=" . $_SESSION['request_id'] );

} else {
    header("Location: ../index.php");
}