<?php
    /**
     * Returns the list of documents.
     */
    require 'database.php';

    // Extract, validate and sanitize
    $categorie_user = ($_GET['categorie_user'] !== null && $_GET['categorie_user'] !== '')? mysqli_real_escape_string($con, $_GET['categorie_user']) : false;
    $text = ($_GET['text'] !== null && $_GET['text'] !== '')? mysqli_real_escape_string($con, $_GET['text']) : false;


    if(!$categorie_user || !$text)
    {
        return http_response_code(400);
    }

    $documents = [];

    if($categorie_user === 'admin')
    {
        $sql = "SELECT *, MATCH (titre, description, categorie) AGAINST ('{$text}') as pertinence\n"

            . "	FROM  pdf_documents\n"

            . "	WHERE MATCH (titre, description, categorie) AGAINST ('{$text}')\n"

            . "    ORDER BY pertinence DESC";
    } else {
        $sql = "SELECT *, MATCH (titre, description, categorie) AGAINST ('{$text}') as pertinence\n"

            . "	FROM  pdf_documents\n"

            . "	WHERE etat=0 AND MATCH (titre, description, categorie) AGAINST ('{$text}')\n"

            . "    ORDER BY pertinence DESC";
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