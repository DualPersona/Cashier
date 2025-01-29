<?php

require_once('kapcsolat.php');

if($_SERVER["REQUEST_METHOD"] === "GET"){
    $query = "SELECT importID, termekID, mennyiseg
    FROM import";

    $result = mysqli_query($conn, $query);

    if($result == !false){
        $termekek = [];
        while($row = mysqli_fetch_assoc($result)){
            $termek = [
                'importID' => $row['importID'],
                'termekID' => $row['termekID'],
                'mennyiseg' => $row['mennyiseg']
            ];
            $termekek[] = $termek;
        }

        header('Content-Type: application/json');
        echo json_encode($termekek);
    }
    else{
        header('Content-Type: application/json');
        echo json_encode(['uzenet' => 'Hiba történt az adatok lekérésekor!']);
    }
}

?>