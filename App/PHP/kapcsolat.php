<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "kassza";

$conn = mysqli_connect($servername, $username, $password, $dbname);


if(!$conn)
{
    die("Sikertelen kapcsolódás az adatbázishoz: " . mysqli_connect_error());
}
?>