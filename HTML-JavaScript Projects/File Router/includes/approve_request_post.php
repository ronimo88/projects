<?php

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    require_once "dbh.php";
    require_once "functions.php";
    require_once "config_session.php";

    $id = $_SESSION['request_id'];
    $assignee_id = $_POST['assignee_id'];
    $current_assignee_id = $_POST['current_assignee_id'];
    $note = $_POST['note'];

    $errors = [];

    if ($errors) {

        $_SESSION['errors'] = $errors;
        header("Location: ../create_request.php");

    } else {


        assign_request($pdo, $id, $assignee_id);

        $current_username = get_user_by_id($pdo, $current_assignee_id)['username'];
        $new_username = get_user_by_id($pdo, $assignee_id)['username'];

        $text = "Assigned from $current_username to $new_username";
        add_note($pdo, $text, $_SESSION['request_id'], $_SESSION['user_id']);

        
        $text = "Request approved";
        add_note($pdo, $text, $_SESSION['request_id'], $_SESSION['user_id']);

        
        if ($note != "") {
            add_note($pdo, $note, $_SESSION['request_id'], $_SESSION['user_id']);
        }

        set_request_stage($pdo, $id, "Approved");


        $_SESSION["messages"] = ["Request has been approved"];


        header("Location: ../request.php?id=$id");
    }

} else {

    header("Location: ../index.php");
}


