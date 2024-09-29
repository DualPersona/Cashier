-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1
-- Létrehozás ideje: 2024. Sze 04. 16:20
-- Kiszolgáló verziója: 10.4.32-MariaDB
-- PHP verzió: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Adatbázis: `kassza`
--

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `termekek`
--

CREATE TABLE `termekek` (
  `id` bigint(20) NOT NULL,
  `nev` varchar(255) DEFAULT NULL,
  `ar` int(11) DEFAULT NULL,
  `kategoria` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

--
-- A tábla adatainak kiíratása `termekek`
--

INSERT INTO `termekek` (`id`, `nev`, `ar`, `kategoria`) VALUES
(1001, 'Coca-Cola 500ml', 150, 'Italok'),
(1002, 'Pepsi 500ml', 140, 'Italok'),
(1003, 'Narancslé 1L', 300, 'Italok'),
(2001, 'Lays Chips 150g', 250, 'Snackek'),
(2002, 'Snickers Szelet', 120, 'Snackek'),
(2003, 'Oreo Keksz 154g', 300, 'Snackek'),
(3001, 'Papírtörlő', 450, 'Háztartási cikkek'),
(3002, 'Mosogatószer 500ml', 500, 'Háztartási cikkek'),
(3003, 'WC papír 4 tekercs', 350, 'Háztartási cikkek'),
(4001, 'Fehér Kenyér 500g', 300, 'Pékáru'),
(4002, 'Zsemle', 40, 'Pékáru'),
(5001, 'Tej 1L', 220, 'Tejtermékek'),
(5002, 'Sajt 200g', 600, 'Tejtermékek'),
(4056489110767, 'zsebkendő', 500, 'Háztartási cikkek'),
(4058172348754, 'illatkendő', 500, 'Háztartási cikkek');

--
-- Indexek a kiírt táblákhoz
--

--
-- A tábla indexei `termekek`
--
ALTER TABLE `termekek`
  ADD PRIMARY KEY (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
