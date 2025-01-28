<?php

require_once('kapcsolat.php');


if($_SERVER["REQUEST_METHOD"] === "GET"){
    $query = "SELECT importID, termekID, mennyiseg
    FROM import";  //változó tartalma SQL mondat


    //lekérdezés futtatása, eredményt a $result változóba helyezzük
    $result = mysqli_query($conn, $query); //$conn--> az a kapcsolat, amit a kapcsolat.php-ben létrehoztunk

    //ha van a lekérdezésnek eredménye
    if($result == !false){
        $termekek = []; //ezt konvertáljuk JSON formátumba és adjuk vissza eredményként
        //végigmegyünk az eredmények rekordjain
        while($row = mysqli_fetch_assoc($result)){ //mysqli_fetch_assoc($result) rekordonként az adatokat a $row változóba rakja, ha végig ért akkor null
            $termek = [   //segédv áltozó (kulcs-érték pár tömb), ami egy ingatlan adatát tartalmazza)
                'importID' => $row['importID'],    //$row változóban a kulcsok a SELECT-ben megadott attribútumok
                'termekID' => $row['termekID'],
                'mennyiseg' => $row['mennyiseg']
            ];
            $termekek[] = $termek;  //az elkészült tömböt az ingatlanok tömb végére teszi
        } //elkészült az összes adatát tartalmazó asszociatív töm, ami JSON-é alakítható
        //átalakítás JSON formátumba
        header('Content-Type: application/json'); //mivel JSON formátumú adatot ad vissza
        echo json_encode($termekek); //echo -- kiíratás
    }
    else{
        header('Content-Type: application/json');
        echo json_encode(['uzenet' => 'Hiba történt az adatok lekérésekor!']);
    }
} //GET vége

?>