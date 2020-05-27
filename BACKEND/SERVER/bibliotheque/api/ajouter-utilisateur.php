<?php
require 'database.php';

// Get the posted data.
$postdata = file_get_contents("php://input");

if(isset($postdata) && !empty($postdata))
{
    // Extract the data.
    $request = json_decode($postdata);


    // Validate.
    if(trim($request->username) === '' || trim($request->password) === '' || trim($request->categorie) === '')
    {
        return http_response_code(400);
    }

    // Sanitize.
    $username = mysqli_real_escape_string($con, trim($request->username));
    $password = hash('sha256', mysqli_real_escape_string($con, trim($request->password)));
    $categorie = mysqli_real_escape_string($con, trim($request->categorie));

    // Create.
    $sql = "INSERT INTO `utilisateurs`(`id`,`username`,`password`,`categorie`) VALUES (null,'{$username}','{$password}','{$categorie}')";

    if(mysqli_query($con,$sql))
    {
        http_response_code(201);
        $utilisateur =[
            'username' => $username,
            'password' => $password,
            'categorie' => $categorie,
            'id'    => mysqli_insert_id($con)
        ];
        $response = array(
            'erreur' => false,
            'message' => 'Utilisateur ajouté avec succès!'
        );
        echo json_encode($response);
    }
    else
    {
        http_response_code(422);
    }
}

?>