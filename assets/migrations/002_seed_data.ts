export const seedSQL = `
-- Emlak verileri
INSERT INTO emlak_ilanlari (id, kategori, satisTuru, baslik, aciklama, fiyat, konum, image)
VALUES (1, 'Konut', 'Satılık', '3+1 Daire', 'Merkezi konumda, geniş daire', 450000, 'İstanbul/Kadıköy', 'https://i.pinimg.com/1200x/72/e0/41/72e041cdc97711fd10e5352551fe7d7d.jpg')
ON CONFLICT(id) DO UPDATE SET
  kategori = excluded.kategori,
  satisTuru = excluded.satisTuru,
  baslik = excluded.baslik,
  aciklama = excluded.aciklama,
  fiyat = excluded.fiyat,
  konum = excluded.konum,
  image = excluded.image;

INSERT INTO emlak_ilanlari (id, kategori, satisTuru, baslik, aciklama, fiyat, konum, image)
VALUES (2, 'Konut', 'Kiralık', '2+1 Daire', 'Yeni tadilatlı', 2000, 'Ankara/Çankaya', 'https://i.pinimg.com/1200x/dd/1b/58/dd1b5839fd303de1033d17464e027317.jpg')
ON CONFLICT(id) DO UPDATE SET
  kategori = excluded.kategori,
  satisTuru = excluded.satisTuru,
  baslik = excluded.baslik,
  aciklama = excluded.aciklama,
  fiyat = excluded.fiyat,
  konum = excluded.konum,
  image = excluded.image;

INSERT INTO emlak_ilanlari (id, kategori, satisTuru, baslik, aciklama, fiyat, konum, image)
VALUES (3, 'Bina', 'Satılık', 'Ofis Binası', 'Şehir merkezinde', 750000, 'İzmir/Karşıyaka', 'https://i.pinimg.com/1200x/cd/43/59/cd4359eb5b895ce4cda433d55de3d608.jpg')
ON CONFLICT(id) DO UPDATE SET
  kategori = excluded.kategori,
  satisTuru = excluded.satisTuru,
  baslik = excluded.baslik,
  aciklama = excluded.aciklama,
  fiyat = excluded.fiyat,
  konum = excluded.konum,
  image = excluded.image;

INSERT INTO emlak_ilanlari (id, kategori, satisTuru, baslik, aciklama, fiyat, konum, image)
VALUES (4, 'Bina', 'Kiralık', 'İş Yeri', 'Şehir merkezinde', 75000, 'Erzurum/Palandöken', 'https://i.pinimg.com/1200x/49/36/d5/4936d5fb85480d6f5e7082aadbffe051.jpg')
ON CONFLICT(id) DO UPDATE SET
  kategori = excluded.kategori,
  satisTuru = excluded.satisTuru,
  baslik = excluded.baslik,
  aciklama = excluded.aciklama,
  fiyat = excluded.fiyat,
  konum = excluded.konum,
  image = excluded.image;

-- Araba verileri
INSERT INTO araba_ilanlari (id, kategori, altKategori, marka, model, baslik, aciklama, fiyat, konum, image)
VALUES (1, 'Vasıta', 'SUV', 'Toyota', 'RAV4', 'Temiz araç', 'degisenı boyası yoktur', 350000, 'İstanbul', 'https://i.pinimg.com/736x/79/2b/d4/792bd4b628a91b9534846fc6c67891ea.jpg')
ON CONFLICT(id) DO UPDATE SET
  kategori = excluded.kategori,
  altKategori = excluded.altKategori,
  marka = excluded.marka,
  model = excluded.model,
  baslik = excluded.baslik,
  aciklama = excluded.aciklama,
  fiyat = excluded.fiyat,
  konum = excluded.konum,
  image = excluded.image;

INSERT INTO araba_ilanlari (id, kategori, altKategori, marka, model, baslik, aciklama, fiyat, konum, image)
VALUES (2, 'Vasıta', 'Otomobil', 'Honda', 'Civic', 'Bakımlı', 'degisenı boyası yoktur', 250000, 'Ankara', 'https://i.pinimg.com/1200x/73/a7/0e/73a70e9efebbfe96681bfc80709366d1.jpg')
ON CONFLICT(id) DO UPDATE SET
  kategori = excluded.kategori,
  altKategori = excluded.altKategori,
  marka = excluded.marka,
  model = excluded.model,
  baslik = excluded.baslik,
  aciklama = excluded.aciklama,
  fiyat = excluded.fiyat,
  konum = excluded.konum,
  image = excluded.image;

INSERT INTO araba_ilanlari (id, kategori, altKategori, marka, model, baslik, aciklama, fiyat, konum, image)
VALUES (3, 'Vasıta', 'SUV', 'BMW', 'X5', 'BMW X5 çok temiz', 'degisenı boyası yoktur', 95000, 'Trabzon/Merkez', 'https://i.pinimg.com/1200x/ff/b9/62/ffb96240508798a4be995f8a2d6046c5.jpg')
ON CONFLICT(id) DO UPDATE SET
  kategori = excluded.kategori,
  altKategori = excluded.altKategori,
  marka = excluded.marka,
  model = excluded.model,
  baslik = excluded.baslik,
  aciklama = excluded.aciklama,
  fiyat = excluded.fiyat,
  konum = excluded.konum,
  image = excluded.image;
`;
