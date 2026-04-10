<?php

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    require_once "dbh.php";
    require_once "functions.php";
    require_once "config_session.php";

    $org_id = $_POST['org_id'];
    $user_id = $_SESSION['user_id'];

    if ($org_id != "") {
        $result = get_org_users($pdo, $org_id);

        if ($result)
            echo json_encode($result);
        else
            echo "";
    } else {
        echo "";
    }


} else {

    header("Location: ../index.php");
}

