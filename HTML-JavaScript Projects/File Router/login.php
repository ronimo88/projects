<?php

require_once "includes/dbh.php";
require_once "includes/functions.php";
require_once "includes/config_session.php";

if (isset($_SESSION['user_id'])) {
    header('Location: home.php');
    die();
}

if (!get_site_admins($pdo)) {
    insert_user($pdo, 'admin', 'admin', true);
}

?>

<html>

<head>
    <title>File Router</title>
    <link rel="stylesheet" href="styles.css">
</head>

<style>

</style>

<body>

    <div id="link_bar" style="align-items: bottom">
        <div style="max-width: 1200px; margin: 0 auto">
            <a href="home.php" style="font-size: 24px; margin-right:30px">File Router</a>
        </div>
    </div>

    <div class="main">

        <div class="header">
            Login
            <div style="float:right">
                <form action="signup.php">
                    <button>Signup</button>
                </form>
            </div>
        </div>

        <?php require_once "includes/messages.php"; ?>

        <div>
            <div>

                <form action="includes/login_post.php" method="POST">
                    <table>
                        <tr>
                            <td>Username</td>
                            <td><input id="username" name="username"></td>
                        </tr>
                        <tr>
                            <td>Password</td>
                            <td><input id="password" type="password" name="password"></td>
                        </tr>
                    </table>
                    <button>Login</button>

                </form>


            </div>
        </div>



    </div>
</body>

</html>