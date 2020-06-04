<?php
    /**
     * Returns the list of utilisateur.
     */
    require 'database.php';


    $utilisateurs = [];
    $sql = "SELECT id, username, categorie, etat, DATEDIFF(fin_dernier_abonnement, CURRENT_TIMESTAMP) as delai_en_jour, DATE_FORMAT(fin_dernier_abonnement, '%d-%m-%Y') as fin_abonnement FROM utilisateurs";

    if($result = mysqli_query($con,$sql))
    {
        $i = 0;
        while($row = mysqli_fetch_assoc($result))
        {
            $utilisateurs[$i]['username'] = $row['username'];
            $utilisateurs[$i]['categorie'] = $row['categorie'];
            $utilisateurs[$i]['etat'] = $row['etat'];
            $utilisateurs[$i]['date_expiration'] = $row['fin_abonnement'];
            $utilisateurs[$i]['delai_en_jour'] = $row['delai_en_jour'];
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