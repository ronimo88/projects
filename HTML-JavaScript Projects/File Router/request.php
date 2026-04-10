<?php

require_once "includes/config_session.php";
require_once "includes/dbh.php";
require_once "includes/functions.php";

if (isset($_GET['id'])) {
    $request_id = $_GET['id'];
    $request = get_request_from_id($pdo, $request_id);
    $_SESSION['request_id'] = $request_id;

    if ($request == null) {
        header("Location: index.php");
        $_SESSION['errors'] = ["Request Not Found"];
        die();
    }

} else {
    header("Location: index.php");
    die();
}


if (!is_dir("requests/" . $request_id)) {
    mkdir("requests/" . $request_id);
    //mkdir("requests/" . $request_id . "/Recycle Bin");
}



$users = get_users($pdo);
$user_id = $_SESSION["user_id"];
$user = get_user_by_id($pdo, $user_id);
$is_site_admin = $user['site_admin'];


$notes = get_notes_by_request_id($pdo, $request_id);

//Request Info

$name = $request['name'];
$description = $request['description'];
$creator_id = $request['creator_id'];
$creator = get_user_by_id($pdo, $creator_id)['username'];
$assignee_id = $request['assignee_id'];
$assignee = get_user_by_id($pdo, $assignee_id)['username'];
$approver_id = $request['approver_id'];
$approver = get_user_by_id($pdo, $approver_id)['username'];
$org_id = $request['org_id'];
$org = get_org_by_id($pdo, $org_id)['name'];
$stage = $request['stage'];

//Files
$path = getcwd() . "/requests" . "/" . $request_id . "/";
$context = null;
$files = scandir($path, SCANDIR_SORT_ASCENDING, $context);
$files = array_diff($files, array('.', '..'));

$can_edit = ($user_id == $request['creator_id'] || $user_id == $request['assignee_id'] || $is_site_admin) && $stage != "Approved" && $stage != "Canceled";


if ($is_site_admin) {
    $my_orgs = get_orgs($pdo);
} else {
    $my_orgs = get_my_orgs($pdo, $user_id);
}

$org_list = "";

foreach ($my_orgs as $key => $_org) {
    $org_list .= $_org["name"];

    if ($key != array_key_last($my_orgs)) {
        $org_list .= ", ";
    }
}

$orgs = get_orgs($pdo);


?>

<html>

<head>
    <title>File Router</title>
    <link rel="stylesheet" href="styles.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js" type="text/javascript"></script>
</head>

<style>

</style>

<script>

    function file_upload() {
        document.getElementById('file_upload').click();
    }

    function deleteConfirm() {
        return confirm("Are you sure want to delete this file?")
    }

    function notesDeleteConfirm() {
        return confirm("Are you sure want to delete this note?")
    }

    function reopenConfirm() {
        return confirm("Are you sure want to reopen this request?")
    }

    function cancelRequestConfirm() {
        return confirm("Are you sure want to cancel this request?")
    }

    function newNoteClose() {
        document.getElementById("new_note_overlay").style.display = "none";
    }

    function showNewNote() {
        document.getElementById("new_note_overlay").style.display = "unset";
    }


    function createElement(type, parent) {
        var elmnt = document.createElement(type);
        parent.appendChild(elmnt);
        return elmnt;
    }


    function orgChanged() {

        var approver_select = document.getElementById("approver_id");
        approver_select.innerHTML = "<option value=''></option>";

        var assignee_select = document.getElementById("assignee_id");
        assignee_select.innerHTML = "";

        var org_select = document.getElementById("org_id");
        var org_id = org_select.value;

        $.ajax({
            url: 'includes/get_org_users.php', // Path to your PHP file
            type: 'POST', // or 'GET'
            data: {
                org_id: org_id
            },
            success: function (response) {
                // Handle the response from the PHP script
                console.log(response);

                if (response != "") {
                    var users = JSON.parse(response);

                    users.forEach(user => {
                        var option;

                        option = createElement("option", approver_select);
                        option.value = user['id'];
                        option.innerHTML = user['username'];

                        if (user['id'] == '<?php echo $request["approver_id"] ?>') {
                            option.selected = true;
                        }

                        option = createElement("option", assignee_select);
                        option.value = user['id'];
                        option.innerHTML = user['username'];

                        if (user['id'] == '<?php echo $request["assignee_id"] ?>') {
                            option.selected = true;
                        }
                    });
                }
            },
            error: function (xhr, status, error) {
                console.error("AJAX Error: " + status + error);
            }
        });
    }




</script>

<body>


    <?php require_once "includes/linkbar.php" ?>

    <div class="main">

        <div class="header">

            <div style="width: fit-content; display: inline-block">
                <button onclick="location.href='home.php'">
                    < </button>
                        Request - <?php echo $request_id ?>
            </div>

            <?php if (($user_id == $creator_id || $is_site_admin) && $request['stage'] != "Approved") { ?>
                <div style="float:right">
                    <form action="includes/cancel_request_post.php" onsubmit="return cancelRequestConfirm()" method="post">
                        <input type="hidden" name="current_assignee_id" value="<?php echo $request['assignee_id'] ?>">
                        <input type="hidden" name="assignee_id" value="<?php echo $request['creator_id'] ?>">
                        <button style="background-color: rgba(255, 192, 0, 1); color:black">Cancel Request</button>
                    </form>

                </div>
            <?php } ?>

        </div>

        <?php
        if (!isset($_SESSION['edit_request_errors'])) {
            require_once "includes/messages.php";
        }
        ?>


        <div style="display: flex">

            <div class="left_section">

                <div class="block">

                    <div class="header2">Instructions for <?php echo $assignee ?></div>

                    <?php

                    if ($stage == "Approved") {
                        ?>
                        This request is approved.<br><br>
                        If it needs to be rerouted, you can select Reopen Request.

                        <?php


                    } else if ($assignee_id == $creator_id) {
                        ?>
                            Use the Upload button below to upload any files you need approved.<br><br>
                            Press the Assign Request button to assign the request to the next person required to review the
                            request.

                        <?php
                    } else if ($assignee_id == $approver_id) {
                        ?>
                                Review the request and perform any requirements in the description. <br><br>
                                Review the files in the files section<br><br>
                                To approve the request, click the Approve button.<br><br>
                                Click the Assign Request to reassign the request to another user.

                        <?php
                    } else {
                        ?>
                                Review the request and perform any requirements in the description. <br><br>
                                Review the files in the files section<br><br>
                                Click the Assign Request to reassign the request to another user.

                        <?php

                    }
                    ?>

                </div>

                <div class="block">

                    <?php

                    if ($can_edit) {
                        ?>
                        <button style="float:right"
                            onclick=" document.getElementById('edit_request_overlay').style.display='unset'">Edit</button>

                    <?php } ?>

                    <div style="margin-bottom: 20px">
                        <div><?php echo "Creator " ?></div>
                        <div style="font-weight: bold"><?php echo $creator ?></div>
                    </div>

                    <div style="margin-bottom: 20px; margin-top: 20px">
                        <div><?php echo "Title " ?></div>
                        <div style="font-weight: bold"><?php echo $name ?></div>
                    </div>

                    <div style="margin-bottom: 20px">
                        <div><?php echo "Description " ?></div>
                        <div style="font-weight: bold"><?php echo $description ?></div>
                    </div>

                    <div style="margin-bottom: 20px">
                        <div><?php echo "Org " ?></div>
                        <div style="font-weight: bold"><?php echo $org ?></div>
                    </div>


                    <div style="margin-bottom: 20px">
                        <div><?php echo "Approver " ?></div>
                        <div style="font-weight: bold"><?php echo $approver ?></div>
                    </div>

                </div>

                <div class="block">

                    <div>
                        <form id="upload_form" action="includes/upload_endpoint.php" method="post"
                            enctype="multipart/form-data" style="display: none">
                            <input type="file" id="file_upload" name="uploadedFile" multiple />
                        </form>
                    </div>

                    <?php if ($can_edit) { ?>
                        <div style="display: inline-block; float:right">
                            <button onclick="file_upload()">Upload</button>
                        </div>
                    <?php } ?>

                    <div class="header2">
                        Files
                    </div>



                    <div id="file_table">

                        <?php

                        foreach ($files as $file) {
                            ?>


                            <div class="file_div">


                                <div style="font-weight:bold; width: 100%">
                                    <a href=" <?php echo "requests/$request_id/" . $file ?>" target="_blank">
                                        <?php echo $file ?></a>
                                </div>


                                <?php if ($can_edit) { ?>
                                    <div>

                                        <form method="post" onsubmit="return deleteConfirm()">
                                            <input type="hidden" name="file" value="<?php echo $file ?>">
                                            <button class="fa" style="font-size:20px; background-color:rgb(128,0,0)"
                                                formaction="includes/delete_file.php">&#xf014;</button>
                                        </form>

                                    </div>
                                <?php } ?>

                            </div>


                            <?php
                        }

                        if (!$files) {
                            ?>
                            <div style="font-weight: bold">No Files Uploaded</div>

                            <?php
                        }

                        ?>

                    </div>

                </div>


            </div>

            <div class="right_section">

                <div class="block">

                    <?php
                    if ($can_edit) {

                        if ($user_id == $approver_id && $user_id == $assignee_id && $stage == "Routed") {
                            ?>
                            <button style="float:right; background-color: lime; color:black; margin-left: 10px;"
                                onclick="document.getElementById('approve_request_overlay').style.display = 'unset'">
                                Approve
                            </button>
                            <?php
                        }

                        ?>

                        <button style="float:right"
                            onclick="document.getElementById('assign_request_overlay').style.display = 'unset'">Assign
                            Request
                        </button>
                    <?php }

                    if (($stage == "Approved" || $stage == "Canceled") && ($user_id == $assignee_id || $is_site_admin)) {
                        ?>
                        <form action="includes/reopen_request_post.php" onsubmit="return reopenConfirm()" method="post">
                            <button style="float:right">Reopen Request </button>
                        </form>
                        <?php
                    }


                    ?>

                    <div>
                        <div><?php echo "Stage " ?></div>
                        <div style="font-weight: bold"><?php echo $stage ?></div>
                    </div>

                    <br>

                    <div>
                        <div><?php echo "Assigned To " ?></div>
                        <div style="font-weight: bold"><?php echo $assignee ?></div>
                    </div>



                </div>




                <div class="block">

                    <div class="header2">
                        Notes

                        <?php if ($can_edit) { ?>

                            <button style="float:right" onclick="showNewNote()">Add Note</button>
                        <?php } ?>

                    </div>

                    <?php

                    foreach ($notes as $note) {
                        ?>
                        <div class="note_div"> <?php
                        $username = get_user_by_id($pdo, $note['user_id'])['username'];
                        ?>

                            <div style="width: 100%">
                                <div style="font-weight:bold"> <?php
                                echo $note['text'];
                                ?> </div>

                                <div> <?php
                                echo $username;
                                echo ": ";
                                echo $note['timestamp'];
                                ?> </div>
                            </div>


                            <?php if ($can_edit) { ?>
                                <div>

                                    <form method="post" onsubmit="return notesDeleteConfirm()">
                                        <input type="hidden" name="note_id" value="<?php echo $note['id'] ?>">
                                        <button class="fa" style="font-size:20px; background-color:rgb(128,0,0)"
                                            formaction="includes/delete_note.php">&#xf014;</button>
                                    </form>

                                </div>
                            <?php } ?>

                        </div> <?php

                    }

                    ?>


                </div>

            </div>

        </div>

        <br>


    </div>


    <?php
    $overlay_display = "none";

    if (isset($_SESSION['edit_request_errors'])) {
        $overlay_display = "unset";
    }

    ?>

    //Edit Request

    <div class="overlay" id="edit_request_overlay" style="display: <?php echo $overlay_display ?>">

        <div id="edit_request">

            <?php
            if (isset($_SESSION['edit_request_errors'])) {
                require_once "includes/messages.php";
            }

            ?>
            <div class="header2"> Edit Request </div>

            <form action="includes/edit_request_post.php" style="margin-top: 0" method="post">

                <div style="margin-bottom: 20px; margin-top: 20px">
                    <div><?php echo "Title " ?></div>
                    <input style='font-weight: bold' name="name" value="<?php echo $request['name'] ?>">
                </div>

                <div style="margin-bottom: 20px">
                    <div><?php echo "Description " ?></div>
                    <textarea style='font-weight: bold; width: 500px'
                        name="description"><?php echo $request['description'] ?></textarea>
                </div>



                <div style="margin-bottom: 20px">
                    <div>Org</div>
                    <select id="org_id" name='org_id' onchange="orgChanged()">
                        <option value=""></option>

                        <?php

                        foreach ($my_orgs as $org) {
                            $id = $org['id'];
                            $org_name = $org['name'];
                            $selected = "";
                            if ($request['org_id'] == $org["id"])
                                $selected = "selected";
                            echo "<option value='$id' $selected>$org_name</option>";
                        }

                        ?>
                    </select>

                </div>

                <div style="margin-bottom: 20px">
                    <div>Approver</div>
                    <select id="approver_id" name='approver_id'>
                        <option value=""></option>

                    </select>
                </div>

                <?php

                ?>

                <button style="float:right;">Save</button>
            </form>

            <button onclick="location.href='request.php?id=<?php echo $request_id ?>'">Cancel</button>

        </div>
    </div>

    //New Note

    <div class="overlay" id="new_note_overlay">
        <div id="new_note">
            <div class="header2"> New Note </div>

            <div style="margin-bottom: 20px">

                <form action="includes/add_note_post.php" method="post">

                    <textarea name="text" style="height: 300px; width: 500px; margin-bottom: 10px;"></textarea>
                    <div>

                        <button style="float:right">Add Note</button>


                    </div>
                </form>

                <button onclick="newNoteClose()">Cancel</button>

            </div>
        </div>
    </div>

    //Assign Request

    <div class="overlay" id="assign_request_overlay">

        <div id="assign_request">

            <div class="header2"><?php echo "Assign Request " ?></div>

            <form action="includes/assign_request_post.php" method="post">

                <div style="margin-bottom: 20px">
                    <div>Assignee</div>
                    <select id="assignee_id" name='assignee_id'>

                    </select>
                </div>

                <div>Note</div>

                <div>
                    <textarea name="note" style="width: 500px; margin-bottom: 10px"></textarea>
                </div>

                <button style="float:right">Save</button>


                <input type="hidden" name="current_assignee_id" value="<?php echo $request['assignee_id'] ?>">

            </form>

            <button onclick="location.href='request.php?id=<?php echo $request_id ?>'">Cancel</button>


        </div>
    </div>


    //Approve Request

    <div class="overlay" id="approve_request_overlay">

        <div id="approve_request">

            <div class="header2"><?php echo "Approve Request " ?></div>

            <form action="includes/approve_request_post.php" method="post">

                <div>Note</div>

                <div>
                    <textarea name="note" style="width: 500px; margin-bottom: 10px"></textarea>
                </div>

                <button style="float:right">Save</button>


                <input type="hidden" name="current_assignee_id" value="<?php echo $request['assignee_id'] ?>">
                <input type="hidden" name="assignee_id" value="<?php echo $request['creator_id'] ?>">

            </form>

            <button onclick="location.href='request.php?id=<?php echo $request_id ?>'">Cancel</button>


        </div>
    </div>

</body>

<script>
    const fileInput = document.getElementById('file_upload');

    fileInput.addEventListener('change', (event) => {
        document.getElementById('upload_form').submit();
    });

    orgChanged();


</script>

</html>