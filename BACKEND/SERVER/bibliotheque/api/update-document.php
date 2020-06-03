<?php
    require 'database.php';

    // Get the posted data.
    $postdata = file_get_contents("php://input");

    if(isset($postdata) && !empty($postdata))
    {
        // Extract the data.
        $request = json_decode($postdata);


        // Validate.
        if(trim($request->titre) === '' || trim($request->description) === '' || trim($request->categorie) === '' || trim($request->id) === '')
        {
            return http_response_code(400);
        }

        // Sanitize.
        $titre = mysqli_real_escape_string($con, trim($request->titre));
        $description = mysqli_real_escape_string($con, trim($request->description));
        $categorie = mysqli_real_escape_string($con, trim($request->categorie));
        $id = mysqli_real_escape_string($con, trim($request->id));

        // Create.
        $sql = "UPDATE `pdf_documents` SET `titre`='{$titre}', `description`='{$description}', `categorie`='{$categorie}' WHERE id='{$id}'";

        if(mysqli_query($con,$sql))
        {
            http_response_code(201);
            $response =[
                'error' => false,
                'message' => 'Mise à jour effectué avec succès'
            ];
            echo json_encode($response);
        }
        else
        {
            http_response_code(422);
        }
    }

?>