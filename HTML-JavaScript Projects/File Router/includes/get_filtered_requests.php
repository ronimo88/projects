<?php

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    require_once "dbh.php";
    require_once "functions.php";
    require_once "config_session.php";

    $id = $_POST["id"];
    $name = $_POST["name"];
    $description = $_POST["description"];
    $creator_id = $_POST["creator_id"];
    $approver_id = $_POST["approver_id"];
    $assignee_id = $_POST["assignee_id"];
    $stage = $_POST["stage"];
    $user_id = $_SESSION["user_id"];

    $site_admin = get_user_by_id($pdo, $user_id)['site_admin'];

    if ($site_admin) {
        $query = "SELECT * FROM requests ";

    } else {

        $query = "SELECT requests.id, requests.name, requests.description, requests.org_id, requests.creator_id, requests.approver_id, requests.assignee_id, requests.stage 
        FROM requests INNER JOIN org_memberships ON requests.org_id = org_memberships.org_id AND org_memberships.user_id = $user_id ";
    }

    if ($id != "" || $name != "" || $description != "" || $creator_id != "" || $approver_id != "" || $assignee_id != "" || $stage != "") {
        $query .= "WHERE id LIKE '%$id%' AND name LIKE '%$name%' AND description LIKE '%$description%' AND creator_id LIKE '%$creator_id%' AND approver_id LIKE '%$approver_id%' AND assignee_id LIKE '%$assignee_id%' AND stage LIKE '%$stage%'";
    }

    $requests = get_filtered_requests($pdo, $query);

    echo json_encode($requests);

} else {

    header("Location: ../index.php");
}

