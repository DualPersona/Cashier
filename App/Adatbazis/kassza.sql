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


CREATE TABLE IF NOT EXISTS export (
  exportID BIGINT AUTO_INCREMENT PRIMARY KEY NOT NULL,
  Datum DATETIME
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

CREATE TABLE IF NOT EXISTS import (
  importID BIGINT NOT NULL,
  termekID BIGINT NOT NULL,
  mennyiseg INT NOT NULL,
  FOREIGN KEY (importID) REFERENCES export(exportID),
  FOREIGN KEY (termekID) REFERENCES termekek(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

CREATE TABLE IF NOT EXISTS kereskedok (
  id INT AUTO_INCREMENT PRIMARY KEY,
  felhasznalonev VARCHAR(255) NOT NULL UNIQUE,
  jelszo_hash VARCHAR(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

INSERT IGNORE INTO kereskedok (id, felhasznalonev, jelszo_hash) VALUES
(1, "teszt123", "$2b$12$j56M0mupNeBaVPrCZSJsrumfzu75wt67FmawfKHYwmhAZuCjuc1Ra"),
(2, "teszt", "$2y$10$tBkxL4edzBuzRGri4hvkkuP0Ioo.GuyIIAQXdbKyuKqdanAWNEAmi");

-- Adatok hozzáadása a kategoriak táblához
INSERT IGNORE INTO kategoriak (nev) VALUES 
('Italok'),
('Snackek'),
('Háztartási cikkek'),
('Pékáru'),
('Tejtermékek');

-- Adatok hozzáadása a termekek táblához
INSERT IGNORE INTO termekek (id, nev, ar, kategoria_id) VALUES
(1111111111116, 'Cola', 150, 1),      -- 1: Italok
(1111111111123, 'Víz', 140, 1),          -- 1: Italok
(1111111111130, 'Narancslé', 300, 1),         -- 1: Italok
(2111111111115, 'Chips', 250, 2),      -- 2: Snackek
(2111111111122, 'Müzli Szelet', 120, 2),      -- 2: Snackek
(2111111111139, 'Keksz', 300, 2),      -- 2: Snackek
(3111111111114, 'Papírtörlő', 450, 3),           -- 3: Háztartási cikkek
(3111111111121, 'Mosogatószer', 500, 3),   -- 3: Háztartási cikkek
(3111111111138, 'WC papír', 350, 3),   -- 3: Háztartási cikkek
(4111111111113, 'Fehér Kenyér', 300, 4),    -- 4: Pékáru
(4111111111120, 'Zsemle', 40, 4),                -- 4: Pékáru
(5111111111112, 'Tej', 220, 5),               -- 5: Tejtermékek
(5111111111129, 'Sajt', 600, 5),            -- 5: Tejtermékek
(4056489110767, 'Zsebkendő', 500, 3),   -- 3: Háztartási cikkek
(4058172348754, 'Illatkendő', 500, 3);  -- 3: Háztartási cikkek

ALTER TABLE kategoriak
  ADD UNIQUE (nev);

COMMIT;
