<?php

    require 'database.php';

    // Extract, validate and sanitize the id.
    $data = $_GET['data'];
    $d_id = explode('-sep-', $data)[0];
    $d_url = explode('-sep-', $data)[1];
    $id = ($d_id !== null && (int)$d_id > 0)? mysqli_real_escape_string($con, (int)$d_id) : false;
    $url = ($d_url !== null && $d_id !== '')? mysqli_real_escape_string($con, $d_url) : false;

    if(!$id)
    {
        return http_response_code(400);
    }

    // Delete.
    $sql = "DELETE FROM `pdf_documents` WHERE `id` ='{$id}' LIMIT 1";

    if(mysqli_query($con, $sql))
    {
        /*$response = array(
            "erreur" => false
        );*/
        unlink('../uploaded-document/'.$url);
        http_response_code(204);
    }
    else
    {
        return http_response_code(422);
    }

    // json_encode($response);

?>