-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1
-- Létrehozás ideje: 2024. Sze 04. 16:20
-- Kiszolgáló verziója: 10.4.32-MariaDB
-- PHP verzió: 8.2.12
-- Adatbázis létrehozása, ha nem létezik
CREATE DATABASE IF NOT EXISTS kassza;
USE kassza;

-- Karakterkódolás beállítása
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

-- Kategóriák tábla létrehozása
CREATE TABLE IF NOT EXISTS kategoriak (
  id INT AUTO_INCREMENT PRIMARY KEY,  -- Egyedi azonosító, automatikusan növekszik
  nev VARCHAR(255) NOT NULL           -- Kategória neve
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

-- Termékek tábla létrehozása
CREATE TABLE IF NOT EXISTS termekek (
  id BIGINT NOT NULL PRIMARY KEY, -- Egyedi azonosító
  nev VARCHAR(255) DEFAULT NULL,      -- Termék neve
  ar INT DEFAULT NULL,            -- Termék ára
  kategoria_id INT,                   -- Idegen kulcs a kategoriak táblára
  FOREIGN KEY (kategoria_id) REFERENCES kategoriak(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;


--csak arra használjuk igazából hogy egy unique/még nem használt
CREATE TABLE IF NOT EXISTS export (
  exportID BIGINT AUTO_INCREMENT PRIMARY KEY NOT NULL,
  Datum DATETIME
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

CREATE TABLE IF NOT EXISTS import (
  exportID BIGINT NOT NULL,
  termekID BIGINT NOT NULL,
  mennyiseg INT NOT NULL,
  FOREIGN KEY (exportID) REFERENCES export(exportID),
  FOREIGN KEY (termekID) REFERENCES termekek(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;
-- Adatok hozzáadása a kategoriak táblához
INSERT INTO kategoriak (nev) VALUES 
('Italok'),
('Snackek'),
('Háztartási cikkek'),
('Pékáru'),
('Tejtermékek');

-- Adatok hozzáadása a termekek táblához
INSERT INTO termekek (id, nev, ar, kategoria_id) VALUES
(1001, 'Coca-Cola 500ml', 150, 1),      -- 1: Italok
(1002, 'Pepsi 500ml', 140, 1),          -- 1: Italok
(1003, 'Narancslé 1L', 300, 1),         -- 1: Italok
(2001, 'Lays Chips 150g', 250, 2),      -- 2: Snackek
(2002, 'Snickers Szelet', 120, 2),      -- 2: Snackek
(2003, 'Oreo Keksz 154g', 300, 2),      -- 2: Snackek
(3001, 'Papírtörlő', 450, 3),           -- 3: Háztartási cikkek
(3002, 'Mosogatószer 500ml', 500, 3),   -- 3: Háztartási cikkek
(3003, 'WC papír 4 tekercs', 350, 3),   -- 3: Háztartási cikkek
(4001, 'Fehér Kenyér 500g', 300, 4),    -- 4: Pékáru
(4002, 'Zsemle', 40, 4),                -- 4: Pékáru
(5001, 'Tej 1L', 220, 5),               -- 5: Tejtermékek
(5002, 'Sajt 200g', 600, 5),            -- 5: Tejtermékek
(4056489110767, 'Zsebkendő', 500, 3),   -- 3: Háztartási cikkek
(4058172348754, 'Illatkendő', 500, 3);  -- 3: Háztartási cikkek

-- Indexek létrehozása
ALTER TABLE kategoriak
  ADD UNIQUE (nev);

-- Tábla indexek létrehozása a termekek táblához
ALTER TABLE termekek
  ADD INDEX (kategoria_id);

COMMIT;
