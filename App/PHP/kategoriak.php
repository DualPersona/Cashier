<?php

require_once('kapcsolat.php');

if($_SERVER["REQUEST_METHOD"] === "GET"){
    $query = "SELECT nev, id
    FROM kategoriak";

    $result = mysqli_query($conn, $query);

    if($result){
        $termekek = [];
        while($row = mysqli_fetch_assoc($result)){
            $termek = [
                'id' => $row['id'],
                'nev' => $row['nev'],
            ];
            $termekek[] = $termek;
        }
        header('Content-Type: application/json');
        echo json_encode($termekek);
    }
    else{
        echo json_encode(['uzenet' => 'Hiba történt az adatok lekérésekor!']);
    }
}

?>
