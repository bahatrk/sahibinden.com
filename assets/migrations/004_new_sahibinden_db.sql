-- ====================================
--  Categories Table
-- ====================================
-- ====================================
--  Categories Table (kategoriler) with full path
-- ====================================dasda
CREATE TABLE kategoriler (
    id INTEGER PRIMARY KEY,
        -- Primary key of the category
    parent_id INTEGER REFERENCES kategoriler(id),
        -- Parent category reference (NULL if top-level)
    adi TEXT NOT NULL,
        -- Name of the category
    level INTEGER,
        -- Depth level: 1 = main category, 2 = first subcategory, etc.
    desc TEXT
        -- Full path from parent to current category (for UI or easier understanding)
);

-- ====================================
--  Sample / Dummy Data
-- ====================================
INSERT INTO kategoriler (id, parent_id, adi, level, desc) VALUES
-- Main categories
(1, NULL, 'Emlak', 1, 'Emlak'), 
(9, NULL, 'Vasıta', 1, 'Vasıta'),

-- Sub-categories of Emlak
(2, 1, 'Konut', 2, 'Emlak > Konut'), 
(6, 1, 'İş Yeri', 2, 'Emlak > İş Yeri'),

-- Sub-sub-categories under Konut
(3, 2, 'Satılık', 3, 'Emlak > Konut > Satılık'), 
(4, 2, 'Kiralık', 3, 'Emlak > Konut > Kiralık'),

-- Sub-sub-sub-categories under Satılık
(5, 3, 'Satılık Daire', 4, 'Emlak > Konut > Satılık > Satılık Daire'), 
(21, 3, 'Satılık Rezidans', 4, 'Emlak > Konut > Satılık > Satılık Rezidans'),

-- Sub-sub-sub-categories under Kiralık
(7, 6, 'Kiralık', 3, 'Emlak > İş Yeri > Kiralık'), 
(8, 7, 'Kiralık Büfe', 4, 'Emlak > İş Yeri > Kiralık > Kiralık Büfe'),

-- Sub-categories of Vasıta
(10, 9, 'Otomobil', 2, 'Vasıta > Otomobil'), 
(16, 9, 'Arazi, SUV & Pickup', 2, 'Vasıta > Arazi, SUV & Pickup'),

-- Brands/models under Otomobil
(11, 10, 'Abarth', 3, 'Vasıta > Otomobil > Abarth'), 
(12, 11, '500e', 4, 'Vasıta > Otomobil > Abarth > 500e'),

(13, 10, 'BMW', 3, 'Vasıta > Otomobil > BMW'), 
(14, 13, '3 Serisi', 4, 'Vasıta > Otomobil > BMW > 3 Serisi'), 
(15, 14, '320i', 5, 'Vasıta > Otomobil > BMW > 3 Serisi > 320i'),

-- Models under Arazi, SUV & Pickup
(17, 16, 'Aston Martin', 3, 'Vasıta > Arazi, SUV & Pickup > Aston Martin'), 
(18, 17, 'DBX', 4, 'Vasıta > Arazi, SUV & Pickup > Aston Martin > DBX'), 
(19, 18, 'DBX V8', 5, 'Vasıta > Arazi, SUV & Pickup > Aston Martin > DBX > DBX V8'), 
(20, 18, 'Cabrio', 5, 'Vasıta > Arazi, SUV & Pickup > Aston Martin > DBX > Cabrio');
 

-- ====================================
--  Listing Types
-- ====================================
CREATE TABLE ilan_turleri (
    id INTEGER PRIMARY KEY,
    adi TEXT NOT NULL
);

INSERT INTO ilan_turleri (id, adi) VALUES
(1, 'Satılık'),
(2, 'Kiralık');

-- ====================================
--  Location Table
-- ====================================
CREATE TABLE location (
    id INTEGER PRIMARY KEY,
    sehir TEXT NOT NULL,
    ilce TEXT NOT NULL,
    lat REAL,
    lng REAL
);

INSERT INTO location (id, sehir, ilce, lat, lng) VALUES
(1, 'İstanbul', 'Kadıköy', 40.9900, 29.0300),
(2, 'Ankara', 'Çankaya', 39.9200, 32.8500),
(3, 'İzmir', 'Konak', 38.4200, 27.1400);

-- ====================================
--  Listings Table
-- ====================================
CREATE TABLE ilanlar (
    id INTEGER PRIMARY KEY,
    kategori_id INTEGER REFERENCES kategoriler(id),
    ilan_turu_id INTEGER REFERENCES ilan_turleri(id),
    baslik TEXT NOT NULL,
    aciklama TEXT,
    fiyat REAL,
    location_id INTEGER REFERENCES location(id),
    tarih DATE
);

INSERT INTO ilanlar (id, kategori_id, ilan_turu_id, baslik, aciklama, fiyat, location_id, tarih) VALUES
(1, 4, 1, 'Satılık 3+1 Daire', 'Güzel daire', 3000000, 1, '2025-12-02'),
(2, 5, 1, 'Satılık Rezidans', 'Lüks rezidans', 7500000, 2, '2025-12-01'),
(3, 8, 2, 'Kiralık Büfe', 'Merkezde kiralık büfe', 25000, 3, '2025-12-02'),
(4, 12, 1, 'Abarth 500e Satılık', 'Elektrikli Abarth', 1200000, 1, '2025-12-02'),
(5, 19, 1, 'Aston Martin DBX V8 Satılık', 'Sıfır DBX V8', 8000000, 2, '2025-12-01');

-- ====================================
--  Images Table
-- ====================================
CREATE TABLE images (
    id INTEGER PRIMARY KEY,
    ilan_id INTEGER REFERENCES ilanlar(id),
    url TEXT NOT NULL,
    alt TEXT,
    "order" INTEGER
);

INSERT INTO images (id, ilan_id, url, alt, "order") VALUES
(1, 1, 'img/daire1.jpg', 'Ön cephe', 1),
(2, 1, 'img/daire2.jpg', 'Salon', 2),
(3, 2, 'img/rezidans1.jpg', 'Giriş', 1),
(4, 4, 'img/abarth1.jpg', 'Ön görünüm', 1),
(5, 5, 'img/dbx1.jpg', 'Yan görünüm', 1);

-- ====================================
--  Emlak Tables
-- ====================================
CREATE TABLE emlak_tipi (
    id INTEGER PRIMARY KEY,
    adi TEXT NOT NULL
);

INSERT INTO emlak_tipi (id, adi) VALUES
(1, 'Daire'),
(2, 'Rezidans'),
(3, 'Villa');

CREATE TABLE emlak_detay (
    ilan_id INTEGER PRIMARY KEY REFERENCES ilanlar(id),
    emlak_tipi_id INTEGER REFERENCES emlak_tipi(id),
    oda_sayisi INTEGER,
    banyo_sayisi INTEGER,
    metrekare INTEGER,
    kat INTEGER,
    bina_yasi INTEGER,
    esyali BOOLEAN
);

INSERT INTO emlak_detay (ilan_id, emlak_tipi_id, oda_sayisi, banyo_sayisi, metrekare, kat, bina_yasi, esyali) VALUES
(1, 1, 3, 2, 120, 5, 10, 1),
(2, 2, 4, 3, 250, 12, 2, 0);

-- ====================================
--  Vasita Tables
-- ====================================
CREATE TABLE vasita_tipi (
    id INTEGER PRIMARY KEY,
    adi TEXT NOT NULL
);

INSERT INTO vasita_tipi (id, adi) VALUES
(1, 'Otomobil'),
(2, 'Arazi, SUV & Pickup');

CREATE TABLE markalar (
    id INTEGER PRIMARY KEY,
    adi TEXT NOT NULL
);

INSERT INTO markalar (id, adi) VALUES
(1, 'Abarth'),
(2, 'Aston Martin'),
(3, 'BMW');

CREATE TABLE modeller (
    id INTEGER PRIMARY KEY,
    marka_id INTEGER REFERENCES markalar(id),
    adi TEXT NOT NULL
);

INSERT INTO modeller (id, marka_id, adi) VALUES
(1, 1, '500e'),
(2, 2, 'DBX'),
(3, 3, '3 Serisi');

CREATE TABLE seriler (
    id INTEGER PRIMARY KEY,
    model_id INTEGER REFERENCES modeller(id),
    adi TEXT NOT NULL
);

INSERT INTO seriler (id, model_id, adi) VALUES
(1, 1, '500e'),
(2, 2, 'DBX V8'),
(3, 2, 'Cabrio'),
(4, 3, '320i');

CREATE TABLE vasita_detay (
    ilan_id INTEGER PRIMARY KEY REFERENCES ilanlar(id),
    vasita_tipi_id INTEGER REFERENCES vasita_tipi(id),
    marka_id INTEGER REFERENCES markalar(id),
    model_id INTEGER REFERENCES modeller(id),
    seri_id INTEGER REFERENCES seriler(id),
    yil INTEGER,
    yakit TEXT,
    vites TEXT,
    km INTEGER,
    kasa_tipi TEXT,
    motor_hacmi TEXT
);

INSERT INTO vasita_detay (ilan_id, vasita_tipi_id, marka_id, model_id, seri_id, yil, yakit, vites, km, kasa_tipi, motor_hacmi) VALUES
(4, 1, 1, 1, 1, 2025, 'Elektrik', 'Otomatik', 0, 'Hatchback', '0kW'),
(5, 2, 2, 2, 2, 2025, 'Benzin', 'Otomatik', 0, 'SUV', '4000cc');
 -- ====================================
--  Categories Table
-- ====================================
CREATE TABLE kategoriler (
    id INTEGER PRIMARY KEY,
    parent_id INTEGER REFERENCES kategoriler(id),
    adi TEXT NOT NULL,
    level INTEGER
);

-- Sample Category Data
INSERT INTO kategoriler (id, parent_id, adi, level) VALUES
(1, NULL, 'Emlak', 1),
(2, 1, 'Konut', 2),
(3, 2, 'Satılık', 3),
(4, 3, 'Satılık Daire', 4),
(5, 3, 'Satılık Rezidans', 4),
(6, 1, 'İş Yeri', 2),
(7, 6, 'Kiralık', 3),
(8, 7, 'Kiralık Büfe', 4),
(9, NULL, 'Vasıta', 1),
(10, 9, 'Otomobil', 2),
(11, 10, 'Abarth', 3),
(12, 11, '500e', 4),
(13, 10, 'BMW', 3),
(14, 13, '3 Serisi', 4),
(15, 14, '320i', 5),
(16, 9, 'Arazi, SUV & Pickup', 2),
(17, 16, 'Aston Martin', 3),
(18, 17, 'DBX', 4),
(19, 18, 'DBX V8', 5),
(20, 18, 'Cabrio', 5);

-- ====================================
--  Listing Types
-- ====================================
CREATE TABLE ilan_turleri (
    id INTEGER PRIMARY KEY,
    adi TEXT NOT NULL
);

INSERT INTO ilan_turleri (id, adi) VALUES
(1, 'Satılık'),
(2, 'Kiralık');

-- ====================================
--  Location Table
-- ====================================
CREATE TABLE location (
    id INTEGER PRIMARY KEY,
    sehir TEXT NOT NULL,
    ilce TEXT NOT NULL,
    lat REAL,
    lng REAL
);

INSERT INTO location (id, sehir, ilce, lat, lng) VALUES
(1, 'İstanbul', 'Kadıköy', 40.9900, 29.0300),
(2, 'Ankara', 'Çankaya', 39.9200, 32.8500),
(3, 'İzmir', 'Konak', 38.4200, 27.1400);

-- ====================================
--  Listings Table
-- ====================================
CREATE TABLE ilanlar (
    id INTEGER PRIMARY KEY,
    kategori_id INTEGER REFERENCES kategoriler(id),
    ilan_turu_id INTEGER REFERENCES ilan_turleri(id),
    baslik TEXT NOT NULL,
    aciklama TEXT,
    fiyat REAL,
    location_id INTEGER REFERENCES location(id),
    tarih DATE
);

INSERT INTO ilanlar (id, kategori_id, ilan_turu_id, baslik, aciklama, fiyat, location_id, tarih) VALUES
(1, 4, 1, 'Satılık 3+1 Daire', 'Güzel daire', 3000000, 1, '2025-12-02'),
(2, 5, 1, 'Satılık Rezidans', 'Lüks rezidans', 7500000, 2, '2025-12-01'),
(3, 8, 2, 'Kiralık Büfe', 'Merkezde kiralık büfe', 25000, 3, '2025-12-02'),
(4, 12, 1, 'Abarth 500e Satılık', 'Elektrikli Abarth', 1200000, 1, '2025-12-02'),
(5, 19, 1, 'Aston Martin DBX V8 Satılık', 'Sıfır DBX V8', 8000000, 2, '2025-12-01');

-- ====================================
--  Images Table
-- ====================================
CREATE TABLE images (
    id INTEGER PRIMARY KEY,
    ilan_id INTEGER REFERENCES ilanlar(id),
    url TEXT NOT NULL,
    alt TEXT,
    "order" INTEGER
);

INSERT INTO images (id, ilan_id, url, alt, "order") VALUES
(1, 1, 'img/daire1.jpg', 'Ön cephe', 1),
(2, 1, 'img/daire2.jpg', 'Salon', 2),
(3, 2, 'img/rezidans1.jpg', 'Giriş', 1),
(4, 4, 'img/abarth1.jpg', 'Ön görünüm', 1),
(5, 5, 'img/dbx1.jpg', 'Yan görünüm', 1);

-- ====================================
--  Emlak Tables
-- ====================================
CREATE TABLE emlak_tipi (
    id INTEGER PRIMARY KEY,
    adi TEXT NOT NULL
);

INSERT INTO emlak_tipi (id, adi) VALUES
(1, 'Daire'),
(2, 'Rezidans'),
(3, 'Villa');

CREATE TABLE emlak_detay (
    ilan_id INTEGER PRIMARY KEY REFERENCES ilanlar(id),
    emlak_tipi_id INTEGER REFERENCES emlak_tipi(id),
    oda_sayisi INTEGER,
    banyo_sayisi INTEGER,
    metrekare INTEGER,
    kat INTEGER,
    bina_yasi INTEGER,
    esyali BOOLEAN
);

INSERT INTO emlak_detay (ilan_id, emlak_tipi_id, oda_sayisi, banyo_sayisi, metrekare, kat, bina_yasi, esyali) VALUES
(1, 1, 3, 2, 120, 5, 10, 1),
(2, 2, 4, 3, 250, 12, 2, 0);

-- ====================================
--  Vasita Tables
-- ====================================
CREATE TABLE vasita_tipi (
    id INTEGER PRIMARY KEY,
    adi TEXT NOT NULL
);

INSERT INTO vasita_tipi (id, adi) VALUES
(1, 'Otomobil'),
(2, 'Arazi, SUV & Pickup');

CREATE TABLE markalar (
    id INTEGER PRIMARY KEY,
    adi TEXT NOT NULL
);

INSERT INTO markalar (id, adi) VALUES
(1, 'Abarth'),
(2, 'Aston Martin'),
(3, 'BMW');

CREATE TABLE modeller (
    id INTEGER PRIMARY KEY,
    marka_id INTEGER REFERENCES markalar(id),
    adi TEXT NOT NULL
);

INSERT INTO modeller (id, marka_id, adi) VALUES
(1, 1, '500e'),
(2, 2, 'DBX'),
(3, 3, '3 Serisi');

CREATE TABLE seriler (
    id INTEGER PRIMARY KEY,
    model_id INTEGER REFERENCES modeller(id),
    adi TEXT NOT NULL
);

INSERT INTO seriler (id, model_id, adi) VALUES
(1, 1, '500e'),
(2, 2, 'DBX V8'),
(3, 2, 'Cabrio'),
(4, 3, '320i');

CREATE TABLE vasita_detay (
    ilan_id INTEGER PRIMARY KEY REFERENCES ilanlar(id),
    vasita_tipi_id INTEGER REFERENCES vasita_tipi(id),
    marka_id INTEGER REFERENCES markalar(id),
    model_id INTEGER REFERENCES modeller(id),
    seri_id INTEGER REFERENCES seriler(id),
    yil INTEGER,
    yakit TEXT,
    vites TEXT,
    km INTEGER,
    kasa_tipi TEXT,
    motor_hacmi TEXT
);

INSERT INTO vasita_detay (ilan_id, vasita_tipi_id, marka_id, model_id, seri_id, yil, yakit, vites, km, kasa_tipi, motor_hacmi) VALUES
(4, 1, 1, 1, 1, 2025, 'Elektrik', 'Otomatik', 0, 'Hatchback', '0kW'),
(5, 2, 2, 2, 2, 2025, 'Benzin', 'Otomatik', 0, 'SUV', '4000cc');
 