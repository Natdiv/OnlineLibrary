<?php
require 'database.php';

// Get the posted data.
$postdata = file_get_contents("php://input");

if(isset($postdata) && !empty($postdata))
{
    // Extract the data.
    $request = json_decode($postdata);


    // Validate.
    $id = null;
    $username = null;
    $password = null;
    $categorie = null;
    $delai_en_jour = null;
    $new_delai_en_jour = null;

    if(trim($request->id) === '') {
        return http_response_code(400);
    }
    if(trim($request->username) === '') {
        return http_response_code(400);
    }
    if(trim($request->password) === '' || trim($request->password) === null) {
        $password = false;
        $sql_pwd = "`password`=utilisateurs.password";
    } else {
        $password = hash('sha256', mysqli_real_escape_string($con, trim($request->password)));
        $sql_pwd = "`password`='{$password}'";
    }
    if(trim($request->categorie) === '') {
        return http_response_code(400);
    }
    if(trim($request->new_delai_en_jour) === '' || trim($request->new_delai_en_jour) === null) {
        return http_response_code(400);
    }

    // Sanitize.
    $id=mysqli_real_escape_string($con, trim($request->id));
    $username = mysqli_real_escape_string($con, trim($request->username));
    $categorie = mysqli_real_escape_string($con, trim($request->categorie));
    $new_delai_en_jour = (int)mysqli_real_escape_string($con, trim($request->new_delai_en_jour));
    
    // if ($delai_en_jour == 0) 
    if ($new_delai_en_jour === 0) {
        // Create.
        $sql_update = "UPDATE `utilisateurs` SET `username`='{$username}', $sql_pwd,`categorie`='{$categorie}' WHERE `id`='{$id}'";
        
                if(mysqli_query($con,$sql_update))
                {
                    http_response_code(201);
                
                    $response = array(
                        'erreur' => false,
                        'message' => 'Utilisateur modifié avec succès!'
                    );
                    echo json_encode($response);
                }
                else
                {
                    http_response_code(422);
                }

        } else if ($new_delai_en_jour >= 1) {
            $date_courante = 'CURRENT_TIMESTAMP';
            $date_expiration = "CURRENT_TIMESTAMP + INTERVAL $new_delai_en_jour DAY";
            // Create.
            $sql_update = "UPDATE `utilisateurs` SET `username`='{$username}', $sql_pwd,`categorie`='{$categorie}', `debut_dernier_abonnement`=$date_courante, `fin_dernier_abonnement`=$date_expiration, `etat`='active' WHERE `id`='{$id}'";

            // Event
            $drop_event = "DROP EVENT IF EXISTS $username";
            $sql_create_event = "CREATE EVENT $username ON SCHEDULE AT CURRENT_TIMESTAMP + INTERVAL $new_delai_en_jour DAY DO UPDATE utilisateurs SET etat='inactive' WHERE username='{$username}'";
    
            
            if(mysqli_query($con,$sql_update) && mysqli_query($con,$drop_event) && mysqli_query($con,$sql_create_event))
            {
                http_response_code(201);
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
        } else {
            return http_response_code(400);
        }
    }

?>