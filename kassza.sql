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
(1111111111111, 'Coca-Cola 500ml', 150, 1),      -- 1: Italok
(1111111111112, 'Pepsi 500ml', 140, 1),          -- 1: Italok
(1111111111113, 'Narancslé 1L', 300, 1),         -- 1: Italok
(2111111111111, 'Lays Chips 150g', 250, 2),      -- 2: Snackek
(2111111111112, 'Snickers Szelet', 120, 2),      -- 2: Snackek
(2111111111113, 'Oreo Keksz 154g', 300, 2),      -- 2: Snackek
(3111111111111, 'Papírtörlő', 450, 3),           -- 3: Háztartási cikkek
(3111111111112, 'Mosogatószer 500ml', 500, 3),   -- 3: Háztartási cikkek
(3111111111113, 'WC papír 4 tekercs', 350, 3),   -- 3: Háztartási cikkek
(4111111111111, 'Fehér Kenyér 500g', 300, 4),    -- 4: Pékáru
(4111111111112, 'Zsemle', 40, 4),                -- 4: Pékáru
(5111111111111, 'Tej 1L', 220, 5),               -- 5: Tejtermékek
(5111111111112, 'Sajt 200g', 600, 5),            -- 5: Tejtermékek
(4056489110767, 'Zsebkendő', 500, 3),   -- 3: Háztartási cikkek
(4058172348754, 'Illatkendő', 500, 3);  -- 3: Háztartási cikkek

ALTER TABLE kategoriak
  ADD UNIQUE (nev);

COMMIT;
