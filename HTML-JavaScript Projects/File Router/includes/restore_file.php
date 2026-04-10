<?php

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    require_once "config_session.php";

    if (isset($_SESSION['request_id'])) {
        $request_id = $_SESSION['request_id'];
    } else {
        header("Location: index.php");
    }

    $filename = $_POST['file'];
    $targetDirectory = "../requests/$request_id/"; // Specify the directory to save files
    $targetFile = $targetDirectory . $filename;

    $messages = [];

    if (rename("../requests/$request_id/Recycle Bin/" . $filename, $targetFile)) {
        $text = "File '" . $filename . "' was restored.";
        array_push($messages, $text);
        echo $text;
    } else {
        $text = "There was an error restoring the file.";
        array_push($messages, $text);
        echo $text;
    }

    $_SESSION["messages"] = $messages;

    header("Location: ../recycle_bin.php?id=" . $_SESSION['request_id'] );


} else {
    header("Location: ../index.php");
}