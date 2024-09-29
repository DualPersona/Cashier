<?php
//adatbázis kapcsolat létrehozása
require_once('kapcsolat.php');
//metódus lekérdezése (GET)

if($_SERVER["REQUEST_METHOD"] === "GET"){
    $query = "SELECT nev, id, ar, kategoria
    FROM termekek";  //változó tartalma SQL mondat

    //lekérdezés futtatása, eredményt a $result változóba helyezzük
    $result = mysqli_query($conn, $query); //$conn--> az a kapcsolat, amit a kapcsolat.php-ben létrehoztunk

    //ha van a lekérdezésnek eredménye
    if($result){
        $termekek = []; //ezt konvertáljuk JSON formátumba és adjuk vissza eredményként
        //végigmegyünk az eredmények rekordjain
        while($row = mysqli_fetch_assoc($result)){ //mysqli_fetch_assoc($result) rekordonként az adatokat a $row változóba rakja, ha végig ért akkor null
            $termek = [   //segédv áltozó (kulcs-érték pár tömb), ami egy ingatlan adatát tartalmazza)
                'id' => $row['id'],    //$row változóban a kulcsok a SELECT-ben megadott attribútumok
                'nev' => $row['nev'],
                'ar' => $row['ar'],
                'kategoria' => $row['kategoria']
            ];
            $termekek[] = $termek;  //az elkészült tömböt az ingatlanok tömb végére teszi
        } //elkészült az összes adatát tartalmazó asszociatív töm, ami JSON-é alakítható
        //átalakítás JSON formátumba
        header('Content-Type: application/json'); //mivel JSON formátumú adatot ad vissza
        echo json_encode($termekek); //echo -- kiíratás
    }
    else{ //ha null $result (azaz nem jöttek adatok az adatbázisból)
        //header('Content-Type: application/json');
        echo json_encode(['uzenet' => 'Hiba történt az adatok lekérésekor!']); //itt is JSON mehet vissza
    }
} //GET vége

?>




