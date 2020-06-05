<?php
    /**
     * Returns the list of documents.
     */
    require 'database.php';

    // Extract, validate and sanitize the id.
    $id_user = ($_GET['id_user'] !== null && $_GET['id_user'] !== '')? mysqli_real_escape_string($con, $_GET['id_user']) : false;

    if(!$id_user)
    {
        return http_response_code(400);
    }

    $historique = array();

    $sql = "SELECT titre, h.pdf_documents_id\n"

        . "	FROM historique h\n"

        . "    INNER JOIN utilisateurs u\n"

        . "    	ON u.id=h.utilisateurs_id\n"

        . "    INNER JOIN pdf_documents p\n"

        . "    	ON p.id=h.pdf_documents_id\n"

        . "    WHERE h.utilisateurs_id='{$id_user}'\n"

        . "    ORDER BY h.date\n"

        . "     DESC";
    

    if($result = mysqli_query($con,$sql))
    {
        $i = 0;
        while($row = mysqli_fetch_assoc($result))
        {
            $historique[$i]['id'] = $row['pdf_documents_id'];
            $historique[$i]['titre'] = $row['titre'];
            $i++;
        }

        $new_histo = [];
        foreach($historique as $value) {
            if(!in_array($value, $new_histo)) {
                $new_histo[] = $value;
            }
        }

        echo json_encode(array_slice($new_histo, 0, 5));
    }
    else
    {
        http_response_code(404);
    }
