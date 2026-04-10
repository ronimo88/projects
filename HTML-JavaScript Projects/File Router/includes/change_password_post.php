<?php

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    require_once "dbh.php";
    require_once "functions.php";
    require_once "config_session.php";

    $password = $_POST['password'];
    $confirm_password = $_POST['confirm_password'];

    $errors = [];

    if ($password == "")
        array_push($errors, "Password can't be blank");

    if ($password != $confirm_password)
        array_push($errors, "The passwords don't match");


    if (empty($errors)) {

        change_password($pdo, $_SESSION['user_id'], $password);
        $_SESSION["messages"] = ["Password successfully changed"];

    } else {
        $_SESSION['errors'] = $errors;

    }

    
    header("Location: ../profile.php");

} else {
    header("Location: ../index.php");
    die();
}
