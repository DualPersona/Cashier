<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "kassza";

//csatlakozás az adatbázishoz $conn változón keresztül
$conn = mysqli_connect($servername, $username, $password, $dbname);

//ha a kapcsolat nem jött létre
if(!$conn) //nincs értéke a változónak
{
    //. az összefűzés
    //mysqli_connect_error() --> megadja a hiba okát
    die("Sikertelen kapcsolódás az adatbázishoz: " . mysqli_connect_error());
}
?>