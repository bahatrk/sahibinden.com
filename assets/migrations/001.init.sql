CREATE TABLE IF NOT EXISTS emlak_ilanlari (
  id INTEGER PRIMARY KEY,
  kategori TEXT,
  satisTuru TEXT,
  baslik TEXT,
  aciklama TEXT,
  fiyat REAL,
  konum TEXT,
  image TEXT
);

CREATE TABLE IF NOT EXISTS araba_ilanlari (
  id INTEGER PRIMARY KEY,
  kategori TEXT,
  altKategori TEXT,
  marka TEXT,
  baslik TEXT,
  aciklama TEXT,
  fiyat REAL,
  konum TEXT,
  image TEXT
);
