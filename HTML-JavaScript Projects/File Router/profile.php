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

?>

<html>

<head>
    <title>File Router</title>
    <link rel="stylesheet" href="styles.css">
</head>

<body>

    <?php require_once "includes/linkbar.php" ?>

    <div class="main">

        <?php require_once "includes/messages.php";
        ?>

        <div class="header">
            <button onclick="location.href='home.php'">
                < </button>
                    Profile
        </div>

        <table>

            <form action="includes/change_username_post.php" method="POST">
                <tr>
                    <td>New Username</td>
                    <td><input name="username"></td>
                    <td><button>Change Username</button></td>
                </tr>
            </form>


            <form action="includes/change_password_post.php" method="POST">
                <tr>

                    <td>New Password</td>
                    <td><input name="password" type="password"></td>
                </tr>

                <tr>
                    <td>Confirm Password</td>
                    <td><input name="confirm_password" type="password"></td>
                    <td><button>Change Password</button></td>
                </tr>
            </form>

        </table>


    </div>

</body>

</html>