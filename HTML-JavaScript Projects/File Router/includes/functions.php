<?php

function insert_user($pdo, $username, $password, $site_admin)
{
    $query = "INSERT INTO users (username, password, site_admin) VALUES (:username, :password, :site_admin)";
    $stmt = $pdo->prepare($query);

    $options = [
        'cost' => 12
    ];

    $hashed_password = password_hash($password, PASSWORD_BCRYPT, $options);

    $stmt->bindParam(":username", $username);
    $stmt->bindParam(":password", $hashed_password);
    $stmt->bindParam(":site_admin", $site_admin);
    $stmt->execute();
    $query = "SELECT LAST_INSERT_ID()";
    $stmt = $pdo->prepare($query);
    $stmt->execute();
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    return $result;
}

function get_user_by_username($pdo, $username)
{
    $query = "SELECT * FROM users WHERE username = :username";
    $stmt = $pdo->prepare($query);
    $stmt->bindParam(":username", $username);
    $stmt->execute();
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    return $result;
}

function change_username($pdo, $user_id, $username)
{
    $query = "UPDATE users SET username = :username WHERE id = :user_id";
    $stmt = $pdo->prepare($query);
    $stmt->bindParam(":user_id", $user_id);
    $stmt->bindParam(":username", $username);
    $stmt->execute();
}

function change_password($pdo, $user_id, $password)
{
    $query = "UPDATE users SET password = :password WHERE id = :user_id";
    $stmt = $pdo->prepare($query);

    $options = [
        'cost' => 12
    ];

    $hashed_password = password_hash($password, PASSWORD_BCRYPT, $options);

    $stmt->bindParam(":user_id", $user_id);
    $stmt->bindParam(":password", $hashed_password);
    $stmt->execute();
}

function create_org_membership(object $pdo, int $org_id, int $user_id) {
    $query = "INSERT INTO org_memberships(org_id, user_id) VALUES (:org_id, :user_id)";
    $stmt = $pdo->prepare($query);
    $stmt->bindParam(":org_id", $org_id);
    $stmt->bindParam(":user_id", $user_id);
    $stmt->execute();
}

function create_first_request(object $pdo, int $id, string $name, string $description, int $creator_id, int $assignee_id, int $approver_id, int $org_id)
{
    $query = "ALTER TABLE requests AUTO_INCREMENT = 0;";
    $stmt = $pdo->prepare($query);
    $stmt->execute();

    $query = "INSERT INTO requests(id, name, description, creator_id, assignee_id, approver_id, org_id) VALUES (:id, :name, :description, :assignee_id, :creator_id, :approver_id, :org_id)";
    $stmt = $pdo->prepare($query);
    $stmt->bindParam(":id", $id);
    $stmt->bindParam(":name", $name);
    $stmt->bindParam(":description", $description);
    $stmt->bindParam(":creator_id", $creator_id);
    $stmt->bindParam(":assignee_id", $assignee_id);
    $stmt->bindParam(":approver_id", $approver_id);
    $stmt->bindParam(":org_id", $org_id);
    $stmt->execute();
    $query = "SELECT LAST_INSERT_ID()";
    $stmt = $pdo->prepare($query);
    $stmt->execute();
    $result = $stmt->fetch(PDO::FETCH_ASSOC);

    $query = "ALTER TABLE requests AUTO_INCREMENT = 1;";

    return $result;
}

function create_request(object $pdo, string $name, string $description, int $creator_id, int $assignee_id, int $approver_id, int $org_id)
{
    $query = "INSERT INTO requests(name, description, creator_id, assignee_id, approver_id, org_id) VALUES (:name, :description, :creator_id, :assignee_id, :approver_id, :org_id)";
    $stmt = $pdo->prepare($query);
    $stmt->bindParam(":name", $name);
    $stmt->bindParam(":description", $description);
    $stmt->bindParam(":creator_id", $creator_id);
    $stmt->bindParam(":assignee_id", $assignee_id);
    $stmt->bindParam(":approver_id", $approver_id);
    $stmt->bindParam(":org_id", $org_id);
    $stmt->execute();
    $query = "SELECT LAST_INSERT_ID()";
    $stmt = $pdo->prepare($query);
    $stmt->execute();
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    return $result;
}

function edit_request(object $pdo, int $request_id, string $name, string $description, int $org_id, $approver_id)
{
    $query = "UPDATE requests SET name=:name, description=:description, org_id=:org_id, approver_id=:approver_id WHERE id=:id";
    $stmt = $pdo->prepare($query);
    $stmt->bindParam(":name", $name);
    $stmt->bindParam(":description", $description);
    $stmt->bindParam(":org_id", $org_id);
    $stmt->bindParam(":approver_id", $approver_id);
    $stmt->bindParam(":id", $request_id);
    $stmt->execute();
}

function assign_request(object $pdo, int $request_id, int $assignee_id)
{
    $query = "UPDATE requests SET assignee_id=:assignee_id WHERE id=:id";
    $stmt = $pdo->prepare($query);
    $stmt->bindParam(":assignee_id", $assignee_id);
    $stmt->bindParam(":id", $request_id);
    $stmt->execute();
}


function get_request_from_id(object $pdo, int $id)
{
    $query = "SELECT * FROM requests WHERE id = :id";
    $stmt = $pdo->prepare($query);
    $stmt->bindParam(":id", $id);
    $stmt->execute();
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    return $result;
}

function get_requests(object $pdo)
{
    $query = "SELECT * FROM requests";
    $stmt = $pdo->prepare($query);
    $stmt->execute();
    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
    return $result;
}

function get_my_org_requests(object $pdo, int $user_id)
{
    $query = "SELECT requests.id, requests.name, requests.description, requests.org_id, requests.creator_id, requests.approver_id, requests.assignee_id, requests.stage
    FROM requests INNER JOIN org_memberships ON requests.org_id=org_memberships.org_id AND org_memberships.user_id=:user_id";
    $stmt = $pdo->prepare($query);
    $stmt->bindParam(":user_id", $user_id);
    $stmt->execute();
    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
    return $result;

}

function get_filtered_requests(object $pdo, string $query)
{
    $stmt = $pdo->prepare($query);
    $stmt->execute();
    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
    return $result;
}

function get_request_by_id(object $pdo, int $id)
{
    $query = "SELECT * FROM requests WHERE id=:id";
    $stmt = $pdo->prepare($query);
    $stmt->bindParam(":id", $id);
    $stmt->execute();
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    return $result;
}


function get_requests_by_creator_id(object $pdo, int $creator_id)
{
    $query = "SELECT * FROM requests WHERE creator_id=:creator_id";
    $stmt = $pdo->prepare($query);
    $stmt->bindParam(":creator_id", $creator_id);
    $stmt->execute();
    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
    return $result;
}

function get_requests_by_assignee_id(object $pdo, int $assignee_id)
{
    $query = "SELECT * FROM requests WHERE assignee_id=:assignee_id AND stage != 'Approved' AND stage != 'Canceled'";
    $stmt = $pdo->prepare($query);
    $stmt->bindParam(":assignee_id", $assignee_id);
    $stmt->execute();
    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
    return $result;
}

function get_requests_by_approver_id(object $pdo, int $approver_id)
{
    $query = "SELECT * FROM requests WHERE approver_id=:approver_id AND stage != 'Approved' AND stage != 'Canceled'";
    $stmt = $pdo->prepare($query);
    $stmt->bindParam(":approver_id", $approver_id);
    $stmt->execute();
    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
    return $result;
}

function get_requests_order(object $pdo, string $order_by, string $dir)
{
    $query = "SELECT * FROM requests ORDER BY :order_by :dir";
    $stmt = $pdo->prepare($query);
    $stmt->bindParam(":order_by", $order_by);
    $stmt->bindParam(":dir", $dir);
    $stmt->execute();
    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
    return $result;
}

function set_request_stage(object $pdo, int $id, string $stage)
{
    $query = "UPDATE requests SET stage=:stage WHERE id=:id";
    $stmt = $pdo->prepare($query);
    $stmt->bindParam(":stage", $stage);
    $stmt->bindParam(":id", $id);
    $stmt->execute();
}

function get_user_by_id(object $pdo, int $id)
{
    $query = "SELECT * FROM users WHERE id=:id";
    $stmt = $pdo->prepare($query);
    $stmt->bindParam(":id", $id);
    $stmt->execute();
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    return $result;
}

function get_users(object $pdo)
{
    $query = "SELECT * FROM users";
    $stmt = $pdo->prepare($query);
    $stmt->execute();
    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
    return $result;
}

function get_site_admins(object $pdo)
{
    $query = "SELECT * FROM users WHERE site_admin=true";
    $stmt = $pdo->prepare($query);
    $stmt->execute();
    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
    return $result;
}

function get_users_not_assigned(object $pdo, $id)
{
    $query = "SELECT * FROM users WHERE id != :id";
    $stmt = $pdo->prepare($query);
    $stmt->bindParam(":id", $id);
    $stmt->execute();
    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
    return $result;
}


function get_notes_by_request_id(object $pdo, int $request_id)
{
    $query = "SELECT * FROM notes WHERE request_id=:request_id ORDER BY timestamp DESC";
    $stmt = $pdo->prepare($query);
    $stmt->bindParam(":request_id", $request_id);
    $stmt->execute();
    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
    return $result;
}

function add_note(object $pdo, string $text, int $request_id, int $user_id)
{
    $query = "INSERT INTO notes(text, request_id, user_id)  VALUES(:text, :request_id, :user_id)";
    $stmt = $pdo->prepare($query);
    $stmt->bindParam(":text", $text);
    $stmt->bindParam(":request_id", $request_id);
    $stmt->bindParam(":user_id", $user_id);
    $stmt->execute();
}

function delete_note(object $pdo, int $id)
{
    $query = "DELETE FROM notes WHERE id=:id";
    $stmt = $pdo->prepare($query);
    $stmt->bindParam(":id", $id);
    $stmt->execute();
}

function get_orgs(object $pdo)
{
    $query = "SELECT * FROM orgs";
    $stmt = $pdo->prepare($query);
    $stmt->execute();
    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
    return $result;
}

function get_org_by_id(object $pdo, int $id)
{
    $query = "SELECT * FROM orgs WHERE id=:id";
    $stmt = $pdo->prepare($query);
    $stmt->bindParam(":id", $id);
    $stmt->execute();
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    return $result;
}

function get_my_orgs(object $pdo, int $user_id)
{
    $query = "SELECT orgs.id, orgs.name FROM orgs INNER JOIN org_memberships ON orgs.id=org_memberships.org_id AND org_memberships.user_id=:user_id;";
    $stmt = $pdo->prepare($query);
    $stmt->bindParam(":user_id", $user_id);
    $stmt->execute();
    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
    return $result;
}

function get_org_users(object $pdo, int $org_id) {
    $query = "SELECT users.id, users.username FROM users INNER JOIN org_memberships ON users.id=org_memberships.user_id AND org_memberships.org_id=:org_id;";
    $stmt = $pdo->prepare($query);
    $stmt->bindParam(":org_id", $org_id);
    $stmt->execute();
    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
    return $result;
}
