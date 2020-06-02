<?php
    /**
     * Returns the list of utilisateur.
     */
    require 'database.php';


    $utilisateurs = [];
    $sql = "SELECT id, username, categorie, etat, DATE_FORMAT(fin_dernier_abonnement, '%d-%m-%Y') as fin_dernier_abonnement FROM utilisateurs";

    if($result = mysqli_query($con,$sql))
    {
        $i = 0;
        while($row = mysqli_fetch_assoc($result))
        {
            $utilisateurs[$i]['username'] = $row['username'];
            $utilisateurs[$i]['categorie'] = $row['categorie'];
            $utilisateurs[$i]['etat'] = $row['etat'];
            $utilisateurs[$i]['date_expiration'] = $row['fin_dernier_abonnement'];
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