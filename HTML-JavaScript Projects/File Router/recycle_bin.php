<?php

require_once "includes/config_session.php";

if (isset($_GET['id'])) {
    $request_id = $_GET['id'];
    $_SESSION['request_id'] = $request_id;
} else {
    header("Location: index.php");
}

if (!is_dir("requests/" . $request_id)) {
    mkdir("requests/" . $request_id);
    mkdir("requests/" . $request_id . "/Recycle Bin");
}

$path = getcwd() . "/requests" . "/" . $request_id . "/";
$context = null;
$deleted_files = scandir($path . "/Recycle Bin", SCANDIR_SORT_ASCENDING, $context);
$deleted_files = array_diff($deleted_files, array('.', '..'));

?>

<html>

<style>
    body {
        padding: 20px;
    }

    #messages {
        margin-bottom: 20px;
    }

    #file_table {
        border-collapse: collapse;
    }

    #file_table td {
        padding: 5px;
        font-weight: bold;
        border-style: solid;
        border-width: 1px;
    }

    button {
        margin-bottom: 10px;
    }
</style>

<script>

    function deleteConfirm() {
        return confirm("Are you sure want to delete this file?")
    }

</script>

<body>

    <?php require_once "includes/messages.php" ?>

    <h2>Deleted Files</h2>

    <table id="file_table">

        <?php

        foreach ($deleted_files as $file) {
            ?>
            <tr>

                <td><a href=" <?php echo "requests/$request_id/Recycle Bin/" . $file ?>"
                        target="_blank"><?php echo $file ?></a></td>

                <form action="includes/restore_file.php" method="post">
                    <input type="hidden" name="file" value="<?php echo $file ?>">
                    <td><button>Restore</button></td>
                </form>

                <form action="includes/delete_file.php" method="post" onsubmit="return deleteConfirm()">
                    <input type="hidden" name="file" value="<?php echo $file ?>">
                    <td><button>Permanently Delete</button></td>
                </form>

            </tr>
            <?php
        }

        if (!$deleted_files) {
            ?>
            <tr>
                <td>No Deleted Files</td>

            </tr>
            <?php
        }

        ?>

    </table>

    <br>

    <form action="request.php">
        <input type="hidden" name="id" value="<?php echo $request_id ?>">
        <button>Back</button>
    </form>

</body>

<script>
    const fileInput = document.getElementById('file_upload');

    fileInput.addEventListener('change', (event) => {
        document.getElementById('upload_form').submit();
    });


</script>

</html>