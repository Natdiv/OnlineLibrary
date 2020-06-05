<?php
require 'database.php';

// Get the posted data.
$postdata = file_get_contents("php://input");

if(isset($postdata) && !empty($postdata))
{
    // Extract the data.
    $request = json_decode($postdata);


    // Validate.
    if(trim($request->username) === '' || trim($request->password) === '' || trim($request->categorie) === '' || trim($request->delai_en_jour) === '')
    {
        return http_response_code(400);
    }

    // Sanitize.
    $username = mysqli_real_escape_string($con, trim($request->username));
    $password = hash('sha256', mysqli_real_escape_string($con, trim($request->password)));
    $categorie = mysqli_real_escape_string($con, trim($request->categorie));
    $delai_en_jour = mysqli_real_escape_string($con, trim($request->delai_en_jour));
    
    if ($delai_en_jour == 0) {
        // Create.
        $sql_insert = "INSERT INTO ".
                "`utilisateurs`(`id`,`username`,`password`,`categorie`, `etat`) ".
                "VALUES (null,'{$username}','{$password}','{$categorie}', 'inactive')";
        
                if(mysqli_query($con,$sql_insert))
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

        } else {
            $delai_en_jour = ($delai_en_jour < 0) ? $delai_en_jour * (-1) : $delai_en_jour;
            $date_courante = 'CURRENT_TIMESTAMP';
            $date_expiration = "CURRENT_TIMESTAMP + INTERVAL $delai_en_jour DAY";
            // Create.
            $sql_insert = "INSERT INTO ".
                    "`utilisateurs`(`id`,`username`,`password`,`categorie`, `debut_dernier_abonnement`, `fin_dernier_abonnement`, `etat`) ".
                    "VALUES (null,'{$username}','{$password}','{$categorie}', $date_courante, $date_expiration, 'active')";

            $sql_event = "CREATE EVENT $username ON SCHEDULE AT CURRENT_DATE + '00:00:00' + INTERVAL $delai_en_jour DAY DO UPDATE utilisateurs SET etat='inactive' WHERE username='{$username}'";
            
            if(mysqli_query($con,$sql_insert) && mysqli_query($con,$sql_event))
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
    }

?>