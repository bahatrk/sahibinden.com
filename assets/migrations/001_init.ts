export const initSQL = `
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
  model TEXT,
  baslik TEXT,
  aciklama TEXT,
  fiyat REAL,
  konum TEXT,
  image TEXT
);

CREATE TABLE IF NOT EXISTS __schema_version (
  version INTEGER
);

INSERT INTO __schema_version (version) 
SELECT 0 WHERE NOT EXISTS (SELECT * FROM __schema_version);
`;
