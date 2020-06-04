<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: PUT, GET, POST, DELETE");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Authorization, Content-Type, Accept");

define('DB_HOST', '127.0.0.1');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'techica_db');

function connect()
{
    $connect = mysqli_connect(DB_HOST ,DB_USER ,DB_PASS ,DB_NAME);

    if (mysqli_connect_errno($connect)) {
        die("Echec de la connection:" . mysqli_connect_error());
    }

    mysqli_set_charset($connect, "utf8");
    return $connect;
}

$con = connect();
