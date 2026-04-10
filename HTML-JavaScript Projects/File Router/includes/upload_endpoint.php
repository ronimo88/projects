<?php

require_once "config_session.php";

if (isset($_SESSION['request_id'])) {
    $request_id = $_SESSION['request_id'];
} else {
    header("Location: index.php");
}


if (isset($_FILES['uploadedFile'])) {
    $targetDirectory = "../requests/$request_id/"; // Specify the directory to save files
    $targetFile = $targetDirectory . basename($_FILES['uploadedFile']['name']);
    $imageFileType = strtolower(pathinfo($targetFile, PATHINFO_EXTENSION));
    $uploadOk = 1;

    // Check file size (e.g., limit to 5MB)
    if ($_FILES['uploadedFile']['size'] > 5000000) {
        echo "Sorry, your file is too large.";
        $uploadOk = 0;
    }


    $messages = [];

    if ($uploadOk == 0) {
        $text = "Sorry, your file was not uploaded.";
        array_push($messages, $text);
    } else {

        if (move_uploaded_file($_FILES['uploadedFile']['tmp_name'], $targetFile)) {

        } else {
            $text = "Sorry, there was an error uploading your file.";
            array_push($messages, $text);
        }
    }


    if ($messages) $_SESSION["messages"] = $messages;

    header("Location: ../request.php?id=" . $_SESSION['request_id'] );
} else {
    echo "error";
}


