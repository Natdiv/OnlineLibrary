<?php
    require 'database.php';

    // Get the posted data.
    $postdata = file_get_contents("php://input");

    if(isset($postdata) && !empty($postdata))
    {
        // Extract the data.
        $request = json_decode($postdata);


        // Validate.
        if(trim($request->id) === '' || trim($request->etat) === '')
        {
            return http_response_code(400);
        }

        // Sanitize.
        $id = mysqli_real_escape_string($con, trim($request->id));
        $etat = mysqli_real_escape_string($con, trim($request->etat));

        // Create.
        $sql = "UPDATE utilisateurs SET etat='{$etat}'  WHERE `id` ='{$id}' LIMIT 1";

        if(mysqli_query($con,$sql))
        {
            http_response_code(201);
            $response = array(
                'erreur' => false,
                'message' => 'Status utilisateur modifié avec succès!'
            );
        
            echo json_encode($response);
        }
        else
        {
            http_response_code(422);
        }
    }

?>