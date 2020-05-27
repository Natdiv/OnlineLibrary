<?php
require 'database.php';

// Get the posted data.
$postdata = file_get_contents("php://input");

if(isset($postdata) && !empty($postdata))
{
    // Extract the data.
    $request = json_decode($postdata);

    // Validate.
    if(trim($request->designation) === '' || trim($request->description) === '' || trim($request->utilisateurs_id) === '')
    {
        return http_response_code(400);
    }

    // Sanitize.
    $designation = mysqli_real_escape_string($con, trim($request->designation));
    $description = mysqli_real_escape_string($con, trim($request->description));
    $date_creation = date('d-m-Y H:i:s');
    $utilisateurs_id = mysqli_real_escape_string($con, trim($request->utilisateurs_id));

    // Create.
    $sql = "INSERT INTO `categorie_pdf`(`id`,`designation`,`description`,`date_creation`,`utilisateurs_id`) VALUES (null,'{$designation}','{$description}','{$date_creation}','{$utilisateurs_id}')";

    if(mysqli_query($con,$sql))
    {
        http_response_code(201);
        $categorie_pdf =[
            'designation' => $designation,
            'description' => $description,
            'date_creation' => $date_creation,
            'utilisateurs_id' => $utilisateurs_id,
            'id'    => mysqli_insert_id($con)
        ];
        $response = array(
            'erreur' => false,
            'message' => 'Opération effectuée avec succès!'
        );
        echo json_encode($response);
    }
    else
    {
        http_response_code(422);
    }
}
