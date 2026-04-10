<?php

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    require_once "dbh.php";
    require_once "functions.php";
    require_once "config_session.php";

    $tab = $_POST["tab"];
    $id = $_POST["id"];
    $user_id = $_SESSION["user_id"];
    $is_site_admin = get_user_by_id($pdo, $user_id)['site_admin'];

    switch ($tab) {
        case "my_assignments":
            $requests = get_requests_by_assignee_id($pdo, $id);
            break;
        case "my_requests":
            $requests = get_requests_by_creator_id($pdo, $id);
            break;
        case "my_approvals":
            $requests = get_requests_by_approver_id($pdo, $id);
            break;
        default:
            if ($is_site_admin) {
                $requests = get_requests($pdo);
            } else {
                $requests = get_my_org_requests($pdo, $user_id);
            }
    }

    echo json_encode($requests);

} else {

    header("Location: ../index.php");
}
