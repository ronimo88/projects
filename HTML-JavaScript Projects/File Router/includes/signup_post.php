<?php

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    require_once "dbh.php";
    require_once "functions.php";
    require_once "config_session.php";
    $username = $_POST['username'];
    $password = $_POST['password'];
    $confirm_password = $_POST['confirm_password'];
    $org_id = $_POST['org_id'];

    $errors = [];

    $user = get_user_by_username($pdo, $username);

    if ($user != null)
        array_push($errors, "Username already exists");

    if ($username == "")
        array_push($errors, "Username can't be blank");

    if ($password == "")
        array_push($errors, "Password can't be blank");

    if ($password != $confirm_password)
        array_push($errors, "The passwords don't match");

    if ($org_id == "")
        array_push($errors, "The org can't be blank");

    if ($errors) {

        $_SESSION['errors'] = $errors;
        $_SESSION['signup_username'] = $username;
        header("Location: ../signup.php");

    } else {
        $user = insert_user($pdo, $username, $password, false);
        $user_id = implode($user);
        create_org_membership($pdo, $org_id, $user_id);
        $_SESSION['messages'] = ["Thanks for signing up!"];
        header("Location: ../login.php");
    }


} else {
    header("Location: ../index.php");
    die();
}
