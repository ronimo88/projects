<?php

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    require_once "dbh.php";
    require_once "functions.php";
    require_once "config_session.php";

    $note_id = $_POST["note_id"];

    delete_note($pdo, $note_id);

    header("Location: ../request.php?id=" . $_SESSION['request_id'] );

} else {
    header("Location: ../index.php");
}