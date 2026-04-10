<?php

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    require_once "dbh.php";
    require_once "functions.php";
    require_once "config_session.php";

    $id = $_SESSION['request_id'];

    $text = "Request reopened";
    add_note($pdo, $text, $_SESSION['request_id'], $_SESSION['user_id']);

    set_request_stage($pdo, $id, "Draft");

    header("Location: ../request.php?id=$id");


} else {

    header("Location: ../index.php");
}


