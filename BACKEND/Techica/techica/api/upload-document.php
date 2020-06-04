<?php
    header('Content-Type: application/json; charset=utf-8');
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: PUT, GET, POST");

    $response = array();
    $upload_dir = '../uploaded-document/';
    $server_url = '';

    if(!file_exists($upload_dir)) {
        mkdir($upload_dir, 0777, true);
    }

    if($_FILES['pdf_document'])
    {
        $document_name = $_FILES["pdf_document"]["name"];
        $document_tmp_name = $_FILES["pdf_document"]["tmp_name"];
        $error = $_FILES["pdf_document"]["error"];

        if($error > 0){
            $response = array(
                "status" => "error",
                "error" => true,
                "message" => "Erreur de chargement de fichier!"
            );
        }else
        {
            $random_name = date('d-m-Y_H:i:s')."_".rand(1000,1000000)."_".$document_name;
            $upload_name = $upload_dir.strtolower($random_name);
            $upload_name = preg_replace('/\s+/', '-', $upload_name);
            $ext = pathinfo($_FILES["pdf_document"]['name'])['extension'];

            if(ext_in_array($ext)) {

                if(move_uploaded_file($document_tmp_name , $upload_name)) {
                    $response = array(
                        "status" => "success",
                        "error" => false,
                        "message" => "Fichié chargé avec succès",
                        "url" => $upload_name
                    );
                } else
                {
                    $response = array(
                        "status" => "error",
                        "error" => true,
                        "message" => "Erreur de chargement de fichier!"
                    );
                }
            } else {
                $response = array(
                    "status" => "error",
                    "error" => true,
                    "message" => "Extension (.$ext) non permise!"
                );
            }

        }

    }else{
        $response = array(
            "status" => "error",
            "error" => true,
            "message" => "Aucun fichié n'a été envoyé!"
        );
    }

    echo json_encode($response);

    /* FUNCTIONS */

    function ext_in_array($value) {
        $extension_permise = array("pdf", "PDF");
        foreach ($extension_permise as $v) {
            if($value == $v)
                return true;
        }
        return false;
    }
?>