export const initSQL = `
CREATE TABLE IF NOT EXISTS emlak_ilanlari (
  id INTEGER PRIMARY KEY,
  kategori TEXT,
  satisTuru TEXT,
  baslik TEXT,
  aciklama TEXT,
  fiyat REAL,
  konum TEXT,
  image TEXT,
  metreKareBrut REAL,
  metreKareNet REAL,
  odaSayisi TEXT,
  binaYasi REAL,
  bulunduguKat REAL,
  katSayisi REAL,
  isitma TEXT,
  asansor TEXT,
  kimden TEXT,
  takas TEXT
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
  image TEXT,
  yil REAL,
  yakitTipi TEXT,
  vites TEXT,
  aracDurumu TEXT,
  km REAL,
  motorGucu REAL,
  renk TEXT,
  kimden TEXT,
  takas TEXT
);

CREATE TABLE IF NOT EXISTS __schema_version (
  version INTEGER
);

INSERT INTO __schema_version (version) 
SELECT 0 WHERE NOT EXISTS (SELECT * FROM __schema_version);
`;
