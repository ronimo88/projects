<?php

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    require_once "dbh.php";
    require_once "functions.php";
    require_once "config_session.php";

    $text = $_POST['text'];
    $request_id = $_SESSION['request_id'];
    $user_id = $_SESSION['user_id'];

    $errors = [];

    if ($text == "")
        array_push($errors, "The note can't be blank");


    if ($errors) {

        $_SESSION['errors'] = $errors;
        

    } else {
        add_note($pdo, $text, $request_id, $user_id);
    }

    header("Location: ../request.php?id=$request_id");

    

} else {

    header("Location: ../index.php");
}


