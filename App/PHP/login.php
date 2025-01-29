<?php

require_once('kapcsolat.php');

if($_SERVER["REQUEST_METHOD"] === "GET"){
    if (isset($_COOKIE['bejelentkezesi_suti'])) {
        $userID = $_COOKIE['bejelentkezesi_suti'];

        $query = "SELECT *
        FROM kereskedok
        WHERE id = $userID";

        $result = mysqli_query($conn, $query);

        if($result && mysqli_num_rows($result) > 0){
            header('Content-Type: application/json');
            echo json_encode(['uzenet' => 'A süti érvényes', 'signedIn' => true]);
        }
        else{
            echo json_encode(['uzenet' => 'Nem létezik megegyező azonosítójú felhasználó', 'signedIn' => false]);
        }
    } else {
        echo json_encode(['uzenet' => 'Nincs süti', 'signedIn' => false]);
    }
    
}
if($_SERVER["REQUEST_METHOD"] === "POST"){
    if (isset($_POST)) {
        $username = $_POST['username'];
        $password = $_POST['password'];

        $query = "SELECT *
        FROM kereskedok
        WHERE felhasznalonev = '$username'";

        $result = mysqli_query($conn, $query);

        if($result && mysqli_num_rows($result) > 0){
            $kereskedo = mysqli_fetch_assoc($result);
            
            $hashedPassword = $kereskedo['jelszo_hash'];

            if(password_verify($password, $hashedPassword)){
                setcookie("bejelentkezesi_suti", $kereskedo['id'], time() + 3600, "/"); //érvényességi idő: 1 óra

                http_response_code(200);
                echo json_encode(['uzenet' => 'Sikeres bejelentkezés!']);
            }
            else {
                http_response_code(401);
                echo json_encode(['uzenet' => 'Hibás jelszó!']);
            }
        }
        else{
            http_response_code(404);
            echo json_encode(['uzenet' => 'Felhasználó nem található!']);
        }
    }
    else{
        http_response_code(400);
        echo json_encode(['uzenet' => 'Hiányzó adatok!']);
    }
}

?>