<?php
if (isset($_SESSION["messages"])) {
    ?>
    <div id="messages"> <?php

    foreach ($_SESSION["messages"] as $message) {
        echo "<div>" . $message . "</div>";
    }

    ?> </div> <?php
}

unset($_SESSION["messages"]);


if (isset($_SESSION["errors"])) {
    ?>
    <div id="errors"> <?php

    foreach ($_SESSION["errors"] as $error) {
        echo "<div>" . $error . "</div>";
    }

    ?> </div> <?php
}

unset($_SESSION["errors"]);

if (isset($_SESSION["create_request_errors"])) {
    ?>
    <div id="errors"> <?php

    foreach ($_SESSION["create_request_errors"] as $error) {
        echo "<div>" . $error . "</div>";
    }

    ?> </div> <?php
}

unset($_SESSION["create_request_errors"]);

if (isset($_SESSION["edit_request_errors"])) {
    ?>
    <div id="errors"> <?php

    foreach ($_SESSION["edit_request_errors"] as $error) {
        echo "<div>" . $error . "</div>";
    }

    ?> </div> <?php
}

unset($_SESSION["edit_request_errors"]);

