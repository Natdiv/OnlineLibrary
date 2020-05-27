<?php
    /**
     * Returns the list of utilisateur.
     */
    require 'database.php';


    $utilisateurs = [];
    $sql = "SELECT id, username, categorie FROM utilisateurs";

    if($result = mysqli_query($con,$sql))
    {
        $i = 0;
        while($row = mysqli_fetch_assoc($result))
        {
            $utilisateurs[$i]['username'] = $row['username'];
            $utilisateurs[$i]['categorie'] = $row['categorie'];
            $utilisateurs[$i]['id'] = $row['id'];
            $i++;
        }

        echo json_encode($utilisateurs);
    }
    else
    {
        http_response_code(404);
    }

?>