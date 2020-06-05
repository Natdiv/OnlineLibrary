<?php
    /**
     * Returns the list of documents.
     */
    require 'database.php';

    // Extract, validate and sanitize the id.
    $droit = ($_GET['droit'] !== null && $_GET['droit'] !== '')? mysqli_real_escape_string($con, $_GET['droit']) : false;

    if(!$droit)
    {
        return http_response_code(400);
    }

    $documents = [];

    if($droit === 'admin')
    {
        $sql = "SELECT * FROM pdf_documents";
    } else {
        $sql = "SELECT * FROM pdf_documents WHERE etat=0";
    }

    if($result = mysqli_query($con,$sql))
    {
        $i = 0;
        while($row = mysqli_fetch_assoc($result))
        {
            $documents[$i]['id'] = $row['id'];
            $documents[$i]['titre'] = $row['titre'];
            $documents[$i]['description'] = $row['description'];
            $documents[$i]['categorie'] = $row['categorie'];
            $documents[$i]['url'] = $row['url'];
            $documents[$i]['date_creation'] = $row['date_creation'];
            $documents[$i]['utilisateurs_id'] = $row['utilisateurs_id'];
            $documents[$i]['etat'] = $row['etat'];
            $i++;
        }

        echo json_encode($documents);
    }
    else
    {
        http_response_code(404);
    }

?>