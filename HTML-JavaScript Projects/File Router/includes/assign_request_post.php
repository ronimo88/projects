<?php

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    require_once "dbh.php";
    require_once "functions.php";
    require_once "config_session.php";

    $id = $_SESSION['request_id'];
    $assignee_id = $_POST['assignee_id'];
    $current_assignee_id = $_POST['current_assignee_id'];
    $note = $_POST['note'];
    $stage = get_request_by_id($pdo, $id)["stage"];

    $errors = [];

    if ($assignee_id == "") {
        array_push($errors, "The assignee can't be blank");
    }

    if ($errors) {

        $_SESSION['errors'] = $errors;
        header("Location: ../request.php?id=$id");

    } else {

       // if ($assignee_id != $current_assignee_id) {

            assign_request($pdo, $id, $assignee_id);

            $current_username = get_user_by_id($pdo, $current_assignee_id)['username'];
            $new_username = get_user_by_id($pdo, $assignee_id)['username'];

            $text = "Assigned from $current_username to $new_username";

            add_note($pdo, $text, $_SESSION['request_id'], $_SESSION['user_id']);

            if ($note != "") {
                add_note($pdo, $note, $_SESSION['request_id'], $_SESSION['user_id']);
            }

            

            if ( $stage == "Draft" || $stage == "Approved") {
                set_request_stage($pdo, $id, "Routed");
            }

            $_SESSION["messages"] = ["Request has been reassigned"];
       // }

        header("Location: ../request.php?id=$id");
    }

} else {

    header("Location: ../index.php");
}


