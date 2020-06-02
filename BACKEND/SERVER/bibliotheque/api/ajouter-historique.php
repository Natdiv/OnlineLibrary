<?php
require 'database.php';

// Get the posted data.
$postdata = file_get_contents("php://input");

if(isset($postdata) && !empty($postdata))
{
    // Extract the data.
    $request = json_decode($postdata);

    // Validate.
    if(trim($request->pdf_documents_id) === '' || trim($request->utilisateurs_id) === '')
    {
        return http_response_code(400);
    }

    // Sanitize.
    $pdf_documents_id = mysqli_real_escape_string($con, trim($request->pdf_documents_id));
    $utilisateurs_id = mysqli_real_escape_string($con, trim($request->utilisateurs_id));

    // Create.
    $sql = "INSERT INTO `historique`(`id`,`pdf_documents_id`,`utilisateurs_id`) VALUES (null,'{$pdf_documents_id}','{$utilisateurs_id}')";

    if(mysqli_query($con,$sql))
    {
        http_response_code(201);
        
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
