<?php

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    require_once "dbh.php";
    require_once "functions.php";
    require_once "config_session.php";

    $name = $_POST['name'];
    $description = $_POST['description'];
    $creator_id = $_SESSION['user_id'];
    $approver_id = $_POST['approver_id'];
    $org_id = $_POST['org_id'];

    $errors = [];

    if ($name == "")
        array_push($errors, "The title can't be blank");

    if ($description == "")
        array_push($errors, "The description can't be blank");

    if ($org_id == "")
        array_push($errors, "The org cannot be empty");

    if ($approver_id == "")
        array_push($errors, "The approver can't be blank");



    if ($errors) {

        $_SESSION['create_request_errors'] = $errors;
        header("Location: ../home.php");

    } else {

        if (!get_requests($pdo)) {
            $id = 101;
            $request = create_first_request($pdo, $id, $name, $description, $creator_id, $creator_id, $approver_id, $org_id);
        } else {
            $request = create_request($pdo, $name, $description, $creator_id, $creator_id, $approver_id, $org_id);
            $id = implode($request);
        }

        $folder_path = "../requests/$id";

        // List of name of files inside specified folder
        $files = glob($folder_path . '/*');

        // Deleting all the files in the list
        foreach ($files as $file) {
            echo $file;

            if (is_file($file))

                // Delete the given file
                unlink($file);
        }

        header("Location: ../request.php?id=$id");
    }



} else {

    header("Location: ../index.php");
}


