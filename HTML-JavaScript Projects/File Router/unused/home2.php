<?php

require_once "includes/dbh.php";
require_once "includes/functions.php";
require_once "includes/config_session.php";

if (isset($_SESSION['user_id'])) {
    $user_id = $_SESSION['user_id'];
} else {
    header('Location: index.php');
    die();
}

$order_by = "id";
$dir = "DESC";


$requests = get_requests_order($pdo, $order_by, $dir);
$my_requests = get_requests_by_creator_id($pdo, $user_id);
$my_assignments = get_requests_by_assignee_id($pdo, $user_id);
$my_approvals = get_requests_by_approver_id($pdo, $user_id);
$users = get_users($pdo);

?>

<html>

<head>
    <title>File Router</title>
    <link rel="stylesheet" href="styles.css">
</head>


<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js" type="text/javascript"></script>

<script>

    function selectTab(section) {
        location.href = "home.php?type=" + section;
        document.getElementById(section + "_button").style.backgroundColor = "rgb(16, 48, 80)";
    }


</script>

<?php
$tab = "my_assignments";

if (isset($_GET["type"])) {
    $tab = $_GET["type"];
} else {
    header("Location: home.php?type=my_assignments");
}

?>

<body onload(selectTab(<?php echo $tab ?> ))>

    <?php require_once "includes/linkbar.php" ?>

    <div class="main">

        <?php
        if (!isset($_SESSION['create_request_errors'])) {
            require_once "includes/messages.php";
        }

        ?>

        <div class="header" style="margin-bottom: 20px">
            <div style="width: fit-content; display: inline-block">Requests </div>
            <button style="float: right"
                onclick="document.getElementById('new_request_overlay').style.display = 'unset'">New request</button>
            <div style="float: right; display: inline-block">

            </div>
        </div>

        <div class="tabs">
            <div class="tab" id="my_assignments_button" onclick="selectTab('my_assignments')">My Assignments</div>

            <div class="tab" id="my_requests_button" onclick="selectTab('my_requests')">My Requests</div>

            <div class="tab" id="all_requests_button" onclick="selectTab('all_requests')">All Requests</div>
        </div>

        <br>

        <?php if (isset($_GET["type"]) && $_GET["type"] == "my_assignments") { ?>

            <div id="my_assignments_section">


                <div class="header2">Assigned To Me</div> <?php


                if ($my_assignments) {

                    ?>
                    <table id="request_table">
                        <th>ID</th>
                        <th>Title</th>
                        <th>Created By</th>
                        <th>Approver</th>
                        <th>Stage</th>

                        <?php

                        foreach ($my_assignments as $request) {
                            ?>
                            <tr>

                                <td style="width: 100px">
                                    <a href="request.php?id=<?php echo $request['id'] ?>">
                                        <?php echo $request["id"]; ?>
                                    </a>
                                </td>

                                <td id="request_td">

                                    <?php echo $request["name"]; ?>

                                </td>

                                <td style="width: 200px">
                                    <?php

                                    $creator = get_user_by_id($pdo, $request['creator_id']);
                                    $creator_name = $creator['username'];
                                    echo $creator_name ?>
                                </td>

                                <td style="width: 200px">
                                    <?php
                                    $approver = get_user_by_id($pdo, $request['approver_id']);
                                    $approver_name = $approver['username'];
                                    echo $approver_name ?>
                                </td>

                                <td style="width: 100px">
                                    <?php
                                    $stage = $request['stage'];
                                    echo $stage ?>
                                </td>

                            </tr>

                            <?php
                        }


                        ?>
                    </table> <?php
                } else {

                    ?>
                    <tr>
                        <td>No requests</td>
                    </tr>
                    <br><br><?php
                }

                ?>

            </div>
        <?php } ?>

        <?php if (isset($_GET["type"]) && $_GET["type"] == "my_requests") { ?>

            <div id="my_requests_section">

                <div class="header2">My Created Requests</div>

                <?php

                if ($my_requests) {

                    ?>
                    <table id="request_table">
                        <th>ID</th>
                        <th>Title</th>
                        <th>Assigned To</th>
                        <th>Approver</th>
                        <th>Stage</th>

                        <?php

                        foreach ($my_requests as $request) {
                            ?>
                            <tr>

                                <td style="width: 100px">
                                    <a href="request.php?id=<?php echo $request['id'] ?>">
                                        <?php echo $request["id"]; ?>
                                    </a>
                                </td>

                                <td id="request_td">

                                    <?php echo $request["name"]; ?>

                                </td>

                                <td style="width: 200px">
                                    <?php
                                    $assignee = get_user_by_id($pdo, $request['assignee_id']);
                                    $assignee_name = $assignee['username'];
                                    echo $assignee_name ?>
                                </td>


                                <td style="width: 200px">
                                    <?php
                                    $approver = get_user_by_id($pdo, $request['approver_id']);
                                    $approver_name = $approver['username'];
                                    echo $approver_name ?>
                                </td>

                                <td style="width: 100px">
                                    <?php
                                    $stage = $request['stage'];
                                    echo $stage ?>
                                </td>

                            </tr>

                            <?php
                        }

                        ?>
                    </table>

                    <?php
                } else {

                    ?>
                    <tr>
                        <td>No requests</td>
                    </tr>
                    <br><br> <?php
                }

                ?>

            </div>

        <?php } ?>

        <?php if (isset($_GET["type"]) && $_GET["type"] == "all_requests") { ?>


            <div id="all_requests_section">

                <div class="header2">All Requests</div> <?php

                if ($requests) {

                    ?>
                    <table id="request_table">
                        <th>ID</th>
                        <th>Title</th>
                        <th>Created By</th>
                        <th>Assigned To</th>
                        <th>Approver</th>
                        <th>Stage</th>

                        <?php

                        foreach ($requests as $request) {
                            ?>
                            <tr>

                                <td style="width: 100px">
                                    <a href="request.php?id=<?php echo $request['id'] ?>">
                                        <?php echo $request["id"]; ?>
                                    </a>
                                </td>

                                <td id="request_td">

                                    <?php echo $request["name"]; ?>

                                </td>

                                <td style="width: 200px">
                                    <?php

                                    $creator = get_user_by_id($pdo, $request['creator_id']);
                                    $creator_name = $creator['username'];
                                    echo $creator_name ?>
                                </td>

                                <td style="width: 200px">
                                    <?php

                                    $assignee = get_user_by_id($pdo, $request['assignee_id']);
                                    $assignee_name = $assignee['username'];
                                    echo $assignee_name ?>
                                </td>

                                <td style="width: 200px">
                                    <?php
                                    $approver = get_user_by_id($pdo, $request['approver_id']);
                                    $approver_name = $approver['username'];
                                    echo $approver_name ?>
                                </td>

                                <td style="width: 100px">
                                    <?php
                                    $stage = $request['stage'];
                                    echo $stage ?>
                                </td>

                            </tr>

                            <?php
                        }


                        ?>
                    </table> <?php
                } else {

                    ?>
                    <tr>
                        <td>No requests</td>
                    </tr> <?php
                }

                ?>

            </div>

        </div>

    <?php } ?>

    <?php //Create Form ?>

    <?php
    $overlay_display = "none";
    if (isset($_SESSION['create_request_errors'])) {
        $overlay_display = "unset";
    }
    ?>

    <div class="overlay" id="new_request_overlay" style="display: <?php echo $overlay_display ?>">

        <div id="new_request">

            <?php require_once "includes/messages.php"; ?>

            <div class="header2">Create Request</div>

            <div>
                <form action="includes/create_request_post.php" method="post">

                    <table style="width: 100%; max-width:500px">

                        <tr>

                            <td style="width:0">Title</td>

                            <td><input name="name"></td>
                        </tr>

                        <tr>
                            <td>
                                <div style="display: flex; align-items: center;">
                                    <div style=" display: inline-block; margin-right: 5px">Description </div>

                                    <div class="tooltip">?
                                        <span class="tooltiptext">Describe the purpose of your request <br> Also include
                                            any instructions for the approver.</span>
                                    </div>
                                </div>
                            </td>

                            <td><textarea name="description" style="width: 500px"></textarea></td>
                        </tr>

                        <tr>
                            <td>Approver</td>
                            <td>
                                <select name='approver_id'>
                                    <?php

                                    foreach ($users as $user) {
                                        $id = $user['id'];
                                        $username = $user['username'];
                                        echo "<option value='$id'>$username</option>";
                                    }

                                    ?>
                                </select>

                            </td>
                        </tr>

                        <input type="hidden" name="creator_id" value="<?php echo $user_id ?>">

                    </table>

                    <button style="float:right">Continue</button>

                </form>

            </div>


            <button onclick="location.href='home.php'">Cancel</button>

        </div>
    </div>

</body>


<?php if (isset($_GET["type"])) { ?>

    <script>
        document.getElementById("<?php echo $_GET["type"]?>_button").style.backgroundColor = "rgb(16, 48, 80)";
    </script>

<?php } ?>

</script>


</html>