<?php
    /**
     * Returns the list of utilisateur.
     */
    require 'database.php';


    $categorie_pdf = [];
    $sql = "SELECT id, designation, description, date_creation, utilisateurs_id FROM categorie_pdf";

    if($result = mysqli_query($con,$sql))
    {
        $i = 0;
        while($row = mysqli_fetch_assoc($result))
        {
            $categorie_pdf[$i]['designation'] = $row['designation'];
            $categorie_pdf[$i]['description'] = $row['description'];
            $categorie_pdf[$i]['date_creation'] = $row['date_creation'];
            $categorie_pdf[$i]['utilisateurs_id'] = $row['utilisateurs_id'];
            $categorie_pdf[$i]['id'] = $row['id'];
            $i++;
        }

        echo json_encode($categorie_pdf);
    }
    else
    {
        http_response_code(404);
    }

?>