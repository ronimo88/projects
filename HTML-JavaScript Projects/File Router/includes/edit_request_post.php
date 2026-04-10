<?php

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    require_once "dbh.php";
    require_once "functions.php";
    require_once "config_session.php";

    $id = $_SESSION['request_id'];
    $name = $_POST['name'];
    $description = $_POST['description'];
    $org_id = $_POST['org_id'];
    $approver_id = $_POST['approver_id'];

    $errors = [];

    if ($name == "")
        array_push($errors, "The title can't be blank");

    if ($description == "")
        array_push($errors, "The description can't be blank");

    if ($org_id == "")
        array_push($errors, "The org can't be blank");
    
    if ($approver_id == "")
        array_push($errors, "The approver can't be blank");


    if ($errors) {

        $_SESSION['edit_request_errors'] = $errors;
        header("Location: ../request.php?id=$id");

    } else {

        edit_request($pdo, $id, $name, $description, $org_id, $approver_id);
        header("Location: ../request.php?id=$id");
    }



} else {

    header("Location: ../index.php");
}


