<?php
require_once("kapcsolat.php");

if($_SERVER["REQUEST_METHOD"] === "POST"){
    $adatok = json_decode(file_get_contents("php://input"),true);
    
    $datum = date('Y-m-d H:i:s');
    $placeholder_query = "INSERT INTO export (Datum) VALUES
    ('$datum')";

    $cart_query = "INSERT INTO import (importID, termekID, mennyiseg) VALUES";

    $value_array = [];


    if (mysqli_query($conn, $placeholder_query)) {
        $exportID = mysqli_insert_id($conn);
        
        foreach ($adatok as $item) {
            $safe_productID = mysqli_real_escape_string($conn, $item["termekID"]);
            $safe_quantity = mysqli_real_escape_string($conn, $item["Darabszam"]);
            $value_array[] = "('$exportID','$safe_productID','$safe_quantity')";
        }

        $cart_query .= implode(",", $value_array);

        $result = mysqli_query($conn, $cart_query);

        if ($result == true) {
            header("Content-Type: application/json");
            http_response_code(201);
            echo json_encode(['uzenet' => $exportID]);
        }
        else {
            header("Content-Type: application/json");
            http_response_code(500);
            echo json_encode(['uzenet' => 'Hiba történt az adatok beszúrásakor!']);
        }

        
    }
    else {
        header("Content-Type: application/json");
        http_response_code(500);
        echo json_encode(['uzenet' => 'Hiba történt az adatok beszúrásakor!']);
    }
}

?>