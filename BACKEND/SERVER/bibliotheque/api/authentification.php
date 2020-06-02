<?php
    require 'database.php';

    // Get the posted data.
    $postdata = file_get_contents("php://input");

    if(isset($postdata) && !empty($postdata))
    {
        // Extract the data.
        $request = json_decode($postdata);


        // Validate.
        if(trim($request->username) === '' || trim($request->password) === '')
        {
            return http_response_code(400);
        }

        // Sanitize.
        $username = mysqli_real_escape_string($con, trim($request->username));
        $password = hash('sha256', mysqli_real_escape_string($con, trim($request->password)));

        // Select.
        $sql = "SELECT id, username, categorie, etat FROM utilisateurs WHERE username='$username' AND password='$password'";

        if($result = mysqli_query($con,$sql))
        {
            $user = false;
            while($row = mysqli_fetch_assoc($result))
            {
                $user['id']    = $row['id'];
                $user['username'] = $row['username'];
                $user['password'] = null;
                $user['categorie'] = $row['categorie'];
                $user['etat'] = $row['etat'];
            }
            if($user){
                $response = array(
                    "status" => "success",
                    "error" => false,
                    "data" => $user
                );
                echo json_encode($response);
            }else{
                $response = array(
                    "status" => "failure",
                    "error" => true
                );
                echo json_encode($response);
            }
        }
        else
        {
            http_response_code(404);
        }
    }

?>