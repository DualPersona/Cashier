<?php

if($_SERVER["REQUEST_METHOD"] === "POST"){
    $adatok = json_decode(file_get_contents("php://input"),true);
    
    $datum = date('Y-m-d H:i:s')
    $placeholder_query = "INSERT INTO export (exportID) VALUES
    ($datum);";

    if (mysqli_query($conn, $placeholder_query)) {
        $exportID = mysqli_insert_id($conn);
    }

    foreach ($adatok as $key => $value) {
        
    }

    header("Content-Type: application/json");
    //echo json_encode($);
}

?>