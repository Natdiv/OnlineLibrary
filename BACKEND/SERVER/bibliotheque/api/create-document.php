<?php
    require 'database.php';

    // Get the posted data.
    $postdata = file_get_contents("php://input");

    if(isset($postdata) && !empty($postdata))
    {
        // Extract the data.
        $request = json_decode($postdata);


        // Validate.
        if(trim($request->titre) === '' || trim($request->description) === '' || trim($request->categorie) === '' || trim($request->url) === '' || trim($request->utilisateursId) === '')
        {
            var_dump($request);
            return http_response_code(400);
        }

        // Sanitize.
        $titre = mysqli_real_escape_string($con, trim($request->titre));
        $description = mysqli_real_escape_string($con, trim($request->description));
        $categorie = mysqli_real_escape_string($con, trim($request->categorie));
        $url = mysqli_real_escape_string($con, trim($request->url));
        $date_creation = date('d-m-Y H:i:s');
        $utilisateurs_id = mysqli_real_escape_string($con, trim($request->utilisateursId));

        // Create.
        $sql = "INSERT INTO `pdf_documents`(`id`,`titre`,`description`, `categorie`, `url`, `date_creation`, `utilisateurs_id`) VALUES (null,'{$titre}','{$description}', '{$categorie}', '{$url}', '{$date_creation}', '{$utilisateurs_id}')";

        if(mysqli_query($con,$sql))
        {
            http_response_code(201);
            $document =[
                'titre' => $titre,
                'description' => $description,
                'categorie' => $categorie,
                'url' => $url,
                'dateCreation' => $date_creation,
                'utilisateursId' => $utilisateurs_id,
                'id'    => mysqli_insert_id($con)
            ];
            echo json_encode($document);
        }
        else
        {
            http_response_code(422);
        }
    }

?>