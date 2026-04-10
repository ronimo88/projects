<?php

require_once "dbh.php";
require_once "functions.php";
require_once "config_session.php";

$section = $_POST["section"];

$_SESSION["requests_tab"] = $section;
echo $section;







