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

$user = get_user_by_id($pdo, $user_id);
$is_site_admin = $user['site_admin'];

$users = get_users($pdo);

if ($is_site_admin) {
    $my_orgs = get_orgs($pdo);
} else {
    $my_orgs = get_my_orgs($pdo, $user_id);
}

$org_list = "";

foreach ($my_orgs as $key => $org) {
    $org_list .= $org["name"];

    if ($key != array_key_last($my_orgs)) {
        $org_list .= ", ";
    }
}

$orgs = get_orgs($pdo);



?>

<html>

<head>
    <title>File Router</title>
    <link rel="stylesheet" href="styles.css">
</head>


<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js" type="text/javascript"></script>

<script>

    let dir_up = true;

    function selectTab(tab) {

        id = "<?php echo $user_id; ?>";

        $.ajax({
            url: 'includes/get_requests.php', // Path to your PHP file
            type: 'POST', // or 'GET'
            data: {
                tab: tab,
                id: id
            },
            success: function (response) {
                // Handle the response from the PHP script
                console.log(response);
                requests = JSON.parse(response);
                get_request_table(requests, tab);
            },
            error: function (xhr, status, error) {
                console.error("AJAX Error: " + status + error);
            }
        });

        $.ajax({
            url: 'includes/save_tab.php', // Path to your PHP file
            type: 'POST', // or 'GET'
            data: {
                section: tab
            },
            success: function (response) {
                // Handle the response from the PHP script
                console.log(response);
            },
            error: function (xhr, status, error) {
                console.error("AJAX Error: " + status + error);
            }
        });


    }

    function selectFilter(id, name, description, creator_id, approver_id, assignee_id, stage) {

        $.ajax({
            url: 'includes/get_filtered_requests.php', // Path to your PHP file
            type: 'POST', // or 'GET'
            data: {
                id: id,
                name: name,
                description: description,
                creator_id: creator_id,
                approver_id: approver_id,
                assignee_id: assignee_id,
                stage: stage
            },
            success: function (response) {
                // Handle the response from the PHP script
                console.log(response);
                requests = JSON.parse(response);
                get_request_table(requests, "filter");
            },
            error: function (xhr, status, error) {
                console.error("AJAX Error: " + status + error);
            }
        });

        $.ajax({
            url: 'includes/save_tab.php', // Path to your PHP file
            type: 'POST', // or 'GET'
            data: {
                section: "filter"
            },
            success: function (response) {
                // Handle the response from the PHP script
                console.log(response);
            },
            error: function (xhr, status, error) {
                console.error("AJAX Error: " + status + error);
            }
        });


    }

    function get_request_table(requests, tab) {

        document.getElementById("my_assignments_button").style.backgroundColor = "gray";
        document.getElementById("my_requests_button").style.backgroundColor = "gray";
        document.getElementById("my_approvals_button").style.backgroundColor = "gray";
        document.getElementById("all_requests_button").style.backgroundColor = "gray";
        document.getElementById("filter_button").style.backgroundColor = "gray";

        document.getElementById(tab + "_button").style.backgroundColor = "rgb(16, 48, 80)";

        var section = document.getElementById("requests_section");
        section.innerHTML = "";

        if (tab == "all_requests" || tab == "filter") {
            var header = createElement("div", section);
            header.className = "header2";

            orgList = '<?php echo $org_list ?>';
            isSiteAdmin = <?php echo $is_site_admin ?>;

            if (isSiteAdmin) {
                header.innerHTML = "Showing all orgs";
            } else {
                header.innerHTML = "Showing my orgs: " + orgList;
            }
        }

        var users = <?php echo json_encode($users) ?>;
        var orgs = <?php echo json_encode($orgs) ?>

        if (requests.length > 0) {

            request_table = createElement("table", section);
            request_table.id = "request_table"

            var th, a;
            th = createElement("th", request_table);
            a = createElement('a', th);
            a.href = "javascript:sortTable('0')";
            a.innerHTML = "ID";

            th = createElement("th", request_table);
            a = createElement('a', th);
            a.href = "javascript:sortTable('1')";
            a.innerHTML = "Title";

            th = createElement("th", request_table);
            a = createElement('a', th);
            a.href = "javascript:sortTable('2')";
            a.innerHTML = "Site";

            th = createElement("th", request_table);
            a = createElement('a', th);
            a.href = "javascript:sortTable('3')";
            a.innerHTML = "Creator";

            th = createElement("th", request_table);
            a = createElement('a', th);
            a.href = "javascript:sortTable('4')";
            a.innerHTML = "Approver";

            th = createElement("th", request_table);
            a = createElement('a', th);
            a.href = "javascript:sortTable('5')";
            a.innerHTML = "Assignee";

            th = createElement("th", request_table);
            a = createElement('a', th);
            a.href = "javascript:sortTable('6')";
            a.innerHTML = "Stage";

            requests.forEach(request => {

                var creator = "";
                var assignee = "";
                var approver = "";
                var org_name = "";

                users.forEach(user => {
                    if (user['id'] == request["creator_id"]) {
                        creator = user['username']
                    }

                    if (user['id'] == request["assignee_id"]) {
                        assignee = user['username']
                    }

                    if (user['id'] == request["approver_id"]) {
                        approver = user['username']
                    }
                });

                orgs.forEach(org => {

                    if (org['id'] == request["org_id"]) {
                        org_name = org['name'];
                    }
                })

                var tr, td, a;
                tr = createElement("tr", request_table);
                tr.setAttribute("onclick", "window.location='request.php?id=" + request['id'] + "'")

                //request.php?id=" + request['id']

                td = createElement("td", tr);
                td.style = "width: 100px"
                a = createElement("a", td);
                a.href = "request.php?id=" + request['id'];
                a.innerHTML = request["id"];

                td = createElement("td", tr);
                td.innerHTML = request["name"];

                td = createElement("td", tr);
                td.style = "width: 100px"
                td.innerHTML = org_name;

                td = createElement("td", tr);
                td.style = "width: 100px"
                td.innerHTML = creator;

                td = createElement("td", tr);
                td.style = "width: 100px"
                td.innerHTML = approver;


                td = createElement("td", tr);
                td.style = "width: 100px"
                td.innerHTML = assignee;

                td = createElement("td", tr);
                td.style = "width: 50px"
                td.innerHTML = request["stage"];
            });

            dir_up = true;
            sortTable(0);



        } else {
            var div = createElement("div", section);
            div.innerHTML = "No Requests";

        }

    }

    function sortTable(column) {

        const table = document.getElementById("request_table");
        const rows = Array.from(table.rows); // Exclude header row
        var columnIndex = column;

        const sortedRows = rows.sort((rowA, rowB) => {
            var cellA, cellB;

            if (dir_up) {
                cellA = rowA.cells[columnIndex].innerText;
                cellB = rowB.cells[columnIndex].innerText;
            } else {
                cellA = rowB.cells[columnIndex].innerText;
                cellB = rowA.cells[columnIndex].innerText;
            }

            // Basic comparison for string or numeric values
            // You might need more sophisticated logic for dates or complex data
            return cellA.localeCompare(cellB, undefined, { numeric: true, sensitivity: 'base' });
        });

        // Remove existing rows and append sorted rows
        sortedRows.forEach(row => table.appendChild(row));

        dir_up = !dir_up;

    }

    function createElement(type, parent) {
        var elmnt = document.createElement(type);
        parent.appendChild(elmnt);
        return elmnt;
    }

    function filterRequests(event) {
        event.preventDefault();

        const id = document.getElementById('filter_id').value;
        const name = document.getElementById('filter_name').value;
        const description = document.getElementById('filter_description').value;
        const creator_id = document.getElementById('filter_creator_id').value;
        const approver_id = document.getElementById('filter_approver_id').value;
        const assignee_id = document.getElementById('filter_assignee_id').value;
        const stage = document.getElementById('filter_stage').value;

        selectFilter(id, name, description, creator_id, approver_id, assignee_id, stage);
        document.getElementById('filter_overlay').style.display = 'none'

        console.log("filtering");
    }

    function clearFilters() {

        document.getElementById('filter_id').value = "";
        document.getElementById('filter_name').value = "";
        document.getElementById('filter_description').value = "";
        document.getElementById('filter_creator_id').value = "";
        document.getElementById('filter_approver_id').value = "";
        document.getElementById('filter_assignee_id').value = "";
        document.getElementById('filter_stage').value = "";
    }

    function orgChanged() {

        var approver_select = document.getElementById("approver_id");

        approver_select.innerHTML = "<option value=''></option>";


        var org_select = document.getElementById("org_id");
        var org_id = org_select.value;

        $.ajax({
            url: 'includes/get_org_users.php', // Path to your PHP file
            type: 'POST', // or 'GET'
            data: {
                org_id: org_id
            },
            success: function (response) {
                // Handle the response from the PHP script
                console.log(response);

                if (response != "") {
                    var users = JSON.parse(response);
                    users.forEach(user => {
                        var option = createElement("option", approver_select);
                        option.value = user['id'];
                        option.innerHTML = user['username'];
                    });
                }
            },
            error: function (xhr, status, error) {
                console.error("AJAX Error: " + status + error);
            }
        });
    }

</script>

<body>

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
            <div class="tab" id="my_assignments_button" onclick="selectTab('my_assignments')">My Assignments
            </div>

            <div class="tab" id="my_requests_button" onclick="selectTab('my_requests')">My Requests</div>

            <div class="tab" id="my_approvals_button" onclick="selectTab('my_approvals')">My Approvals</div>

            <div class="tab" id="all_requests_button" onclick="selectTab('all_requests')">All Requests</div>

            <div class="tab" id="filter_button"
                onclick="document.getElementById('filter_overlay').style.display = 'unset'">Custom Filters</div>

        </div>



        <br>


        <div id="requests_section"></div>

    </div>

    //Create Form

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
                            <td>Org</td>
                            <td>
                                <select id="org_id" name='org_id' onchange="orgChanged()">
                                    <option value=""></option>

                                    <?php

                                    foreach ($my_orgs as $org) {
                                        $id = $org['id'];
                                        $org_name = $org['name'];
                                        echo "<option value='$id'>$org_name</option>";
                                    }

                                    ?>
                                </select>

                            </td>
                        </tr>

                        <tr>
                            <td>Approver</td>
                            <td>
                                <select id="approver_id" name='approver_id'>
                                    <option value=""></option>
         
                                </select>

                            </td>
                        </tr>



                    </table>

                    <button style="float:right">Continue</button>

                </form>

            </div>

            <button onclick="location.href='home.php'">Cancel</button>

        </div>
    </div>

    //Filter

    <div class="overlay" id="filter_overlay" style="display: none">
        <div id="filter">
            <div class="header2">Custom Filters</div>

            <form onsubmit="filterRequests(event)">
                <table style="width: 100%; max-width:500px">

                    <tr>
                        <td>ID</td>

                        <td><input id="filter_id" name="id"></td>
                    </tr>

                    <tr>
                        <td style="width:0">Title</td>

                        <td><input id="filter_name" name="name"></td>
                    </tr>

                    <tr>
                        <td>
                            <div style="display: flex; align-items: center;">
                                <div style=" display: inline-block; margin-right: 5px">Description </div>
                            </div>
                        </td>

                        <td><textarea id="filter_description" name="description" style="width: 500px"></textarea></td>
                    </tr>

                    <tr>
                        <td>Creator</td>
                        <td>
                            <select id="filter_creator_id" name='creator_id'>
                                <option value=""></option>

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
                            <select id="filter_approver_id" name='approver_id'>
                                <option value=""></option>
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
                        <td>Assignee</td>
                        <td>
                            <select id="filter_assignee_id" name='assignee_id'>
                                <option value=""></option>
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
                        <td>Stage</td>
                        <td>
                            <select id="filter_stage" name='stage'>
                                <option value=""></option>
                                <option value="Draft">Draft</option>
                                <option value="Routed">Routed</option>
                                <option value="Approved">Approved</option>
                                <option value="Canceled">Canceled</option>
                            </select>

                        </td>
                    </tr>



                </table>

                <button style="float:right">Apply</button>
            </form>

            <button onclick="document.getElementById('filter_overlay').style.display = 'none'">Cancel</button>
            <button onclick="clearFilters()">Clear Filters</button>

        </div>





    </div>

</body>


<script>



    $(document).ready(function () {

        <?php

        if (isset($_SESSION["requests_tab"])) {

            ?> selectTab("<?php echo $_SESSION["requests_tab"] ?>"); <?php

        } else {

            $_SESSION["requests_tab"] = "my_assignments";
            ?> selectTab("my_assignments"); <?php
        }

        ?>
    });

</script>

</html>