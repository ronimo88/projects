<?php

require_once "includes/dbh.php";
require_once "includes/functions.php";
require_once "includes/config_session.php";

if (isset($_SESSION['user_id'])) {
    $user_id = $_SESSION['user_id'];
} else {
    header('Location: home.php');
    die();
}

$users = get_users($pdo);

?>

<html>

<head>
    <title>File Router</title>
    <link rel="stylesheet" href="styles.css">
</head>

<body>

    <?php require_once "includes/linkbar.php" ?>

    <div class="main">

        <div class="header">
            <button onclick="location.href='home.php'">
                < </button>
                    Create Request
        </div>

        <?php require_once "includes/messages.php"; ?>

        <div >
            <form action="includes/create_request_post.php" method="post">

                <table style="width: 100%; max-width:500px">

                    <tr>

                        <td style="width:0">Title</td>

                        <td><input name="name"></td>
                    </tr>

                    <tr>
                        <td>Description</td>
                        <td><textarea name="description"></textarea></td>
                    </tr>

                    <tr>
                        <td>Assign To</td>
                        <td>
                            <select name='assignee_id'>
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

                <button>Create</button>

                <br><br>

            </form>

        </div>

        <button onclick="location.href='home.php'">Cancel</button>

    </div>

</body>

</html>