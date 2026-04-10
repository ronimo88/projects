<?php

require_once "config_session.php";
session_destroy();
header("Location: ../login.php");