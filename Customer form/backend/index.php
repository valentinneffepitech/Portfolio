<?php

$env = parse_ini_file('.env');

extract($env);

$pdo = new PDO('mysql:host=' . $DBHOST . ';dbname=' . $DBNAME, $DBUSER, $DBPASS);

$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, DELETE");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

function login()
{
    global $pdo;

    $sql = "SELECT * FROM admin WHERE login = :login";

    $query = $pdo->prepare($sql);
    $query->bindParam(':login', $_POST['login'], PDO::PARAM_STR);

    try {
        $query->execute();
        $admin = $query->fetch(PDO::FETCH_ASSOC);

        if (!$admin) {
            http_response_code(404);
            echo json_encode(['error' => 'User not found']);
            return;
        }

        $hash = md5($_POST['password']);

        if ($hash == $admin['password']) {
            http_response_code(200);
            echo json_encode(['success' => 'Access Granted']);
        } else {
            http_response_code(403);
            echo json_encode(['error' => 'Access Denied']);
        }
    } catch (PDOException $e) {
        http_response_code(500);
    }
}

function uploadFile($name)
{
    $tmp = $_FILES['photo']['tmp_name'];

    $allowed_extension = [
        'jpg',
        'png',
        'svg',
        'gif'
    ];

    if (substr($_FILES['photo']['type'], -4) == 'jpeg') {
        $extension = substr($_FILES['photo']['type'], -4);
    } elseif (in_array(substr($_FILES['photo']['type'], -3), $allowed_extension)) {
        $extension = substr($_FILES['photo']['type'], -3);
    }

    $filename = "./uploads/" . $name . '.' . $extension;

    $result = move_uploaded_file($tmp, $filename);

    if ($result) {
        return $filename;
    } else {
        return false;
    }
}

function registerUser()
{
    global $pdo;

    $sql_element = "";
    $sql_value = "";

    foreach ($_POST as $key => $value) {
        if ($key === 'action' || $key === 'birthdate') {
            continue;
        }
        $sql_element .= " $key,";
        $sql_value .= " :$key,";
    }

    $birth = isset($_POST['birthdate']) ? $_POST['birthdate'] : null;

    if (!$birth) {
        http_response_code(403);
        return;
    }

    $photoPath = "";

    if (count($_FILES) !== 0) {
        $photoPath = uploadFile($_POST['Nom'] . '.' . $_POST['Prenom']);
    }

    $photoPath = $photoPath ? ltrim($photoPath, '.') : "";

    $sql = "INSERT INTO internautes ($sql_element photo, birthdate, created_at) VALUES ($sql_value :photo, :date, now())";
    $query = $pdo->prepare($sql);

    foreach ($_POST as $key => $value) {
        if ($key == 'action' || $key == 'birthdate') {
            continue;
        }
        $query->bindValue(":$key", $value, PDO::PARAM_STR);
    }

    $query->bindValue(":photo", $photoPath, PDO::PARAM_STR);

    $stringTime = date("Y-m-d H:i:s", strtotime($birth));
    $query->bindValue(':date', $stringTime, PDO::PARAM_STR);

    try {
        $query->execute();
        http_response_code(200);
        echo json_encode([
            'success' => 'success'
        ]);
    } catch (PDOException $e) {
        http_response_code(501);
    }
}

function deleteUser($id)
{
    global $pdo;
    $query = $pdo->prepare('DELETE FROM internautes WHERE id = :id');
    $query->bindParam(':id', $id, PDO::PARAM_INT);
    try {
        $query->execute();
    } catch (PDOException $e) {
        http_response_code(501);
        echo json_encode([
            'error' => "No user found"
        ]);
        return;
    }
    $query = $pdo->prepare('SELECT * from internautes');
    $query->execute();
    $users = $query->fetchAll(PDO::FETCH_ASSOC);
    http_response_code(200);
    echo json_encode($users);
}

function getAllUsers($orderInfo = 'id', $order = 'asc', $limit = 50, $page = 0)
{
    global $pdo;

    $sql = '
      select * 
      from internautes 
      order BY :orderInfo :order 
      limit :limit
      offset :offset
    ';

    $query = $pdo->prepare($sql);

    $query->bindParam(':orderInfo', $orderInfo, PDO::PARAM_STR);
    $query->bindParam(':order', $order, PDO::PARAM_STR);
    $query->bindParam(':limit', $limit, PDO::PARAM_INT);

    $offset = $limit * $page;
    $query->bindParam(':offset', $offset, PDO::PARAM_INT);

    $query->execute();

    return $query->fetchAll(PDO::FETCH_ASSOC);
}

function searchUsers($string,  $orderinfo = "id", $limit = 50, $page = 0, $order = "asc")
{
    global $pdo;
    $page = $page < 0 ? 0 : $page;
    $string = "%$string%";
    $sql = 'desc internautes';
    $query = $pdo->prepare($sql);
    $query->execute();
    $concat = [];
    $fields = [];
    $infos = $query->fetchAll(PDO::FETCH_ASSOC);
    foreach ($infos as $info) {
        $fields[] = strtolower($info['Field']);
        $field = $info['Field'] . ' like :string';
        $concat[] = $field;
    }
    $substring = implode(' OR ', $concat);
    if (strtolower($order) !== 'asc' && strtolower($order) !== 'desc') {
        $order = 'asc';
    }
    if (!in_array(strtolower($orderinfo), $fields)) {
        $orderinfo = 'id';
    }
    $sql = "SELECT * FROM internautes
        where $substring
        order by $orderinfo $order
        LIMIT :limit 
        OFFSET :offset";
    $offset = $page * $limit;
    $query = $pdo->prepare($sql);
    $query->bindParam(':limit', $limit, PDO::PARAM_INT);
    $query->bindParam(':offset', $offset, PDO::PARAM_INT);
    $query->bindParam(':string', $string, PDO::PARAM_STR);
    try {
        $query->execute();
        $results = $query->fetchAll(PDO::FETCH_ASSOC);
        http_response_code(200);
        echo json_encode($results);
    } catch (PDOException $e) {
        http_response_code(400);
        echo json_encode([
            'error' => $e
        ]);
    }
}

function getInputs()
{
    global $pdo;
    $sql = "SELECT * FROM inputs";
    $query = $pdo->prepare($sql);
    $query->execute();
    $results = $query->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($results);
}

function updateInput($id, $value)
{
    global $pdo;
    if ($value === 'false') {
        $value = '0';
    } elseif ($value === 'true') {
        $value = '1';
    } else {
        http_response_code(400);
        return;
    }
    $sql = "UPDATE inputs SET isRequired = :value WHERE id = :id";
    $query = $pdo->prepare($sql);
    $query->bindParam(':value', $value, PDO::PARAM_STR);
    $query->bindParam(':id', $id, PDO::PARAM_INT);
    $query->execute();
    getInputs();
}

function getNumberUsers()
{
    global $pdo;
    $sql = "SELECT COUNT(*) as count FROM internautes";
    $query = $pdo->prepare($sql);
    $query->execute();
    $results = $query->fetchAll(PDO::FETCH_ASSOC);
    http_response_code(200);
    echo json_encode($results);
}

switch ($_REQUEST['action']) {
    case 'login': {
            if (isset($_POST['login']) && isset($_POST['password'])) {
                login();
            } else {
                http_response_code(403);
                echo json_encode([
                    'error' => 'Invalid Credentials'
                ]);
            }
            break;
        }
    case 'register': {
            $uniqueTest = "select * from internautes where email = :email or phone = :phone";
            $testQuery = $pdo->prepare($uniqueTest);
            $email = $_POST['email'];
            $phone = $_POST['phone'];
            $testQuery->bindParam(':email', $email, PDO::PARAM_STR);
            $testQuery->bindParam(':phone', $phone, PDO::PARAM_STR);

            try {
                $testQuery->execute();
                $existingUser = $testQuery->fetch(PDO::FETCH_ASSOC);

                if ($existingUser) {
                    http_response_code(409); // Conflict
                    echo json_encode(['error' => 'Email or phone number already in use']);
                } else {
                    registerUser();
                }
            } catch (PDOException $e) {
                http_response_code(500);
                echo json_encode(['error' => 'Internal Server Error']);
                return;
            }
            break;
        }
    case 'search': {
            if (isset($_GET['search'])) {
                $search = $_GET['search'];
                $order = isset($_GET['order']) ? $_GET['order'] : "id";
                $limit = isset($_GET['limit']) ? intval($_GET['limit']) : 50;
                $page = isset($_GET['page']) ? intval($_GET['page']) - 1 : 0;
                $orderDirection = isset($_GET['orderDirection']) ? $_GET['orderDirection'] : "asc";
                searchUsers($search, $order, $limit, $page, $orderDirection);
            } else {
                http_response_code(400);
                echo json_encode([
                    "error" => "Spécifier le texte a chercher!"
                ]);
            }
            break;
        }
    case 'getNumberUsers': {
            try {
                getNumberUsers();
            } catch (Exception $e) {
                http_response_code(500);
                echo json_encode(['error' => 'Internal Server Error']);
            }
            break;
        }
    case 'getAll': {
            if (isset($_POST['limit']) && isset($_POST['offset'])) {
                echo json_encode(getAllUsers('id', 'asc', $_POST['limit'], $_POST['offset']));
            } else {
                echo json_encode(getAllUsers());
            }
            break;
        }
    case 'deleteUser': {
            if (isset($_POST['id'])) {
                deleteUser($_POST['id']);
            }
            break;
        }
    case 'generateForm': {
            getInputs();
            break;
        }
    case 'updateInput': {
            if (isset($_POST['id']) && isset($_POST['value'])) {
                updateInput($_POST['id'], $_POST['value']);
            }
            break;
        }
    default: {
            http_response_code(404);
            echo json_encode(["error" => 'Unknown Method']);
        }
}
