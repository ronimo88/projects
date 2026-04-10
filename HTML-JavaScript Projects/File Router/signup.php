<?php

require_once "includes/dbh.php";
require_once "includes/functions.php";
require_once "includes/config_session.php";

if (isset($_SESSION['user_id'])) {
    header('Location: home.php');
    die();
}

$username = "";

if (isset($_SESSION['signup_username'])) {
    $username = $_SESSION['signup_username'];
}

unset($_SESSION['signup_username']);

$orgs = get_orgs($pdo);

?>

<html>

<head>
    <link rel="stylesheet" href="styles.css">
</head>

<style>

</style>

<body>

    <div id="link_bar" style="align-items: bottom">
        <div style="max-width: 1200px; margin: 0 auto">
            <a href="home.php" style="font-size: 24px; margin-right:30px">Test Maker</a>
        </div>
    </div>

    <div class="main">

        <div class="header">Signup</div>

        <?php require_once "includes/messages.php"; ?>

        <form action="includes/signup_post.php" method="POST">
            <table>
                <tr>
                    <td>Username</td>
                    <td><input id="username" name="username" value="<?php echo $username ?>"></td>
                </tr>

                <tr>
                    <td>Password</td>
                    <td><input type="password" id="password" name="password"></td>
                </tr>

                <tr>
                    <td>Confirm Password</td>
                    <td><input type="password" id="confirm_password" name="confirm_password"></td>
                </tr>

                <tr>
                    <td>Org</td>
                    <td>
                        <select name="org_id">
                            <?php
                            foreach ($orgs as $key => $org) {
                                ?>
                                <option value="<?php echo $org['id'] ?>"><?php echo $org['name'] ?></option>
                                <?php
                            }
                            ?>
                        </select>
                    </td>
                </tr>

            </table>
            <button>Submit</button>
        </form>

        <br>

        <form action="login.php">
            <button>Back to login</button>
        </form>

    </div>
</body>

</html>