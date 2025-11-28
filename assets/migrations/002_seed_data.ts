export const seedSQL = `
-- Emlak verileri
INSERT INTO emlak_ilanlari (id, kategori, satisTuru, baslik, aciklama, fiyat, konum, image)
VALUES (1, 'Konut', 'Satılık', '3+1 Daire', 'Merkezi konumda, geniş daire', 450000, 'İstanbul/Kadıköy', 'https://plus.unsplash.com/premium_photo-1689609950112-d66095626efb?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')
ON CONFLICT(id) DO UPDATE SET
  kategori = excluded.kategori,
  satisTuru = excluded.satisTuru,
  baslik = excluded.baslik,
  aciklama = excluded.aciklama,
  fiyat = excluded.fiyat,
  konum = excluded.konum,
  image = excluded.image;

INSERT INTO emlak_ilanlari (id, kategori, satisTuru, baslik, aciklama, fiyat, konum, image)
VALUES (2, 'Konut', 'Kiralık', '2+1 Daire', 'Yeni tadilatlı', 2000, 'Ankara/Çankaya', 'https://images.unsplash.com/photo-1628592102751-ba83b0314276?q=80&w=1397&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')
ON CONFLICT(id) DO UPDATE SET
  kategori = excluded.kategori,
  satisTuru = excluded.satisTuru,
  baslik = excluded.baslik,
  aciklama = excluded.aciklama,
  fiyat = excluded.fiyat,
  konum = excluded.konum,
  image = excluded.image;

INSERT INTO emlak_ilanlari (id, kategori, satisTuru, baslik, aciklama, fiyat, konum, image)
VALUES (3, 'Bina', 'Satılık', 'Ofis Binası', 'Şehir merkezinde', 750000, 'İzmir/Karşıyaka', 'https://images.unsplash.com/photo-1580216643062-cf460548a66a?q=80&w=627&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')
ON CONFLICT(id) DO UPDATE SET
  kategori = excluded.kategori,
  satisTuru = excluded.satisTuru,
  baslik = excluded.baslik,
  aciklama = excluded.aciklama,
  fiyat = excluded.fiyat,
  konum = excluded.konum,
  image = excluded.image;

INSERT INTO emlak_ilanlari (id, kategori, satisTuru, baslik, aciklama, fiyat, konum, image)
VALUES (4, 'Bina', 'Kiralık', 'İş Yeri', 'Şehir merkezinde', 75000, 'Erzurum/Palandöken', 'https://plus.unsplash.com/premium_photo-1661963090306-dca2fdd3ab95?q=80&w=1506&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')
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
VALUES (1, 'Vasıta', 'SUV', 'Toyota', 'RAV4', 'Temiz araç', 'degisenı boyası yoktur', 350000, 'İstanbul', 'https://images.unsplash.com/photo-1706509234538-9831b1b33d66?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')
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
VALUES (2, 'Vasıta', 'Otomobil', 'Honda', 'Civic', 'Bakımlı', 'degisenı boyası yoktur', 250000, 'Ankara', 'https://images.unsplash.com/photo-1610768207795-72169abdf0d4?q=80&w=1469&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')
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
VALUES (3, 'Vasıta', 'SUV', 'BMW', 'X5', 'BMW X5 çok temiz', 'degisenı boyası yoktur', 95000, 'Trabzon/Merkez', 'https://images.unsplash.com/photo-1610768207795-72169abdf0d4?q=80&w=1469&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')
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
