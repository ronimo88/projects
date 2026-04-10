<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {

    require_once "dbh.php";
    require_once "functions.php";
    require_once "config_session.php";

    $username = $_POST['username'];

    $errors = [];

    if ($username == "")
        array_push($errors, "Username can't be blank");

    $user = get_user_by_username($pdo, $username);

    if ($user) {
        array_push($errors, "Username already exists");

    }


    if (empty($errors)) {

        change_username($pdo, $_SESSION['user_id'], $username);
        $_SESSION['username'] = $username;
        $_SESSION["messages"] = ["Username successfully changed"];

    } else {
        $_SESSION['errors'] = $errors;

    }

    header("Location: ../profile.php");

} else {
    header("Location: ../index.php");
    die();
}

