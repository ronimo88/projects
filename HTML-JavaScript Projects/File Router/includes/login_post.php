<?php

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    require_once "dbh.php";
    require_once "functions.php";
    require_once "config_session.php";

    $username = $_POST['username'];
    $password = $_POST['password'];


    $errors = [];

    if ($username == "")
        array_push($errors, "Username can't be blank");

    if ($password == "")
        array_push($errors, "Password can't be blank");

    $user = get_user_by_username($pdo, $username);

    if ($user) {
        if (!password_verify($password, $user['password'])) {
            array_push($errors, "Username or password is incorrect");
        }
    } else {
        array_push($errors, "Username or password is incorrect");
    }



    if ($errors) {

        $_SESSION['errors'] = $errors;
        header("Location: ../login.php");

    } else {

        $_SESSION['user_id'] = $user['id'];
        $_SESSION['username'] = $user['username'];

        header("Location: ../home.php");
    }

} else {
    header("Location: ../index.php");
    die();
}
