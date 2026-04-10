<?php
require_once "config_session.php";
require_once "functions.php";
require_once "config_session.php";

?>

<div id="link_bar" style="align-items: bottom">
    <div style="max-width: 1200px; margin: 0 auto">
        <a href="home.php" style="font-size: 24px; margin-right:30px;">File Router</a>
        <a href="home.php">Requests</a>
        <a href="includes/logout.php">Logout</a>

        <a style="float:right; margin-top: 5px" href="profile.php">
            <?php
            echo $_SESSION['username'];
            if (get_user_by_id($pdo, $_SESSION['user_id'])['site_admin']) {
                echo " (Admin)";
            }
            ?>
        </a>
    </div>
</div>