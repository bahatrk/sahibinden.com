export const seedSQL = `
-- Emlak verileri
INSERT INTO emlak_ilanlari (
  id, kategori, satisTuru, baslik, aciklama, fiyat, konum, image,
  metreKare, metreKareNet, odaSayisi, binaYasi,
  bulunduguKat, katSayisi, isitma, asansor, kimden, takas
)
VALUES (
  1, 'Konut', 'Satılık', '3+1 Daire', 'Merkezi konumda, geniş daire', 
  450000, 'İstanbul/Kadıköy', 'https://i.pinimg.com/1200x/72/e0/41/72e041cdc97711fd10e5352551fe7d7d.jpg',
  140, 120, '3+1', 10, 3, 5, 'Doğalgaz', 'Var', 'Sahibinden', 'Hayır'
)
ON CONFLICT(id) DO UPDATE SET
  kategori = excluded.kategori,
  satisTuru = excluded.satisTuru,
  baslik = excluded.baslik,
  aciklama = excluded.aciklama,
  fiyat = excluded.fiyat,
  konum = excluded.konum,
  image = excluded.image,
  metreKare = excluded.metreKare,
  metreKareNet = excluded.metreKareNet,
  odaSayisi = excluded.odaSayisi,
  binaYasi = excluded.binaYasi,
  bulunduguKat = excluded.bulunduguKat,
  katSayisi = excluded.katSayisi,
  isitma = excluded.isitma,
  asansor = excluded.asansor,
  kimden = excluded.kimden,
  takas = excluded.takas;


INSERT INTO emlak_ilanlari (
  id, kategori, satisTuru, baslik, aciklama, fiyat, konum, image,
  metreKare, metreKareNet, odaSayisi, binaYasi,
  bulunduguKat, katSayisi, isitma, asansor, kimden, takas
)
VALUES (
  2, 'Konut', 'Kiralık', '2+1 Daire', 'Yeni tadilatlı',
  2000, 'Ankara/Çankaya', 'https://i.pinimg.com/1200x/dd/1b/58/dd1b5839fd303de1033d17464e027317.jpg',
  110, 95, '2+1', 5, 2, 8, 'Kombi', 'Var', 'Emlakçı', 'Hayır'
)
ON CONFLICT(id) DO UPDATE SET
  kategori = excluded.kategori,
  satisTuru = excluded.satisTuru,
  baslik = excluded.baslik,
  aciklama = excluded.aciklama,
  fiyat = excluded.fiyat,
  konum = excluded.konum,
  image = excluded.image,
  metreKare = excluded.metreKare,
  metreKareNet = excluded.metreKareNet,
  odaSayisi = excluded.odaSayisi,
  binaYasi = excluded.binaYasi,
  bulunduguKat = excluded.bulunduguKat,
  katSayisi = excluded.katSayisi,
  isitma = excluded.isitma,
  asansor = excluded.asansor,
  kimden = excluded.kimden,
  takas = excluded.takas;


INSERT INTO emlak_ilanlari (
  id, kategori, satisTuru, baslik, aciklama, fiyat, konum, image,
  metreKare, metreKareNet, odaSayisi, binaYasi,
  bulunduguKat, katSayisi, isitma, asansor, kimden, takas
)
VALUES (
  3, 'Bina', 'Satılık', 'Ofis Binası', 'Şehir merkezinde',
  750000, 'İzmir/Karşıyaka', 'https://i.pinimg.com/1200x/cd/43/59/cd4359eb5b895ce4cda433d55de3d608.jpg',
  800, 700, '8 Katlı', 15, 0, 8, 'Merkezi Sistem', 'Var', 'Sahibinden', 'Evet'
)
ON CONFLICT(id) DO UPDATE SET
  kategori = excluded.kategori,
  satisTuru = excluded.satisTuru,
  baslik = excluded.baslik,
  aciklama = excluded.aciklama,
  fiyat = excluded.fiyat,
  konum = excluded.konum,
  image = excluded.image,
  metreKare = excluded.metreKare,
  metreKareNet = excluded.metreKareNet,
  odaSayisi = excluded.odaSayisi,
  binaYasi = excluded.binaYasi,
  bulunduguKat = excluded.bulunduguKat,
  katSayisi = excluded.katSayisi,
  isitma = excluded.isitma,
  asansor = excluded.asansor,
  kimden = excluded.kimden,
  takas = excluded.takas;


INSERT INTO emlak_ilanlari (
  id, kategori, satisTuru, baslik, aciklama, fiyat, konum, image,
  metreKare, metreKareNet, odaSayisi, binaYasi,
  bulunduguKat, katSayisi, isitma, asansor, kimden, takas
)
VALUES (
  4, 'Bina', 'Kiralık', 'İş Yeri', 'Şehir merkezinde',
  75000, 'Erzurum/Palandöken', 'https://i.pinimg.com/1200x/49/36/d5/4936d5fb85480d6f5e7082aadbffe051.jpg',
  300, 260, 'Tek Kat', 8, 0, 1, 'Soba', 'Yok', 'Emlakçı', 'Hayır'
)
ON CONFLICT(id) DO UPDATE SET
  kategori = excluded.kategori,
  satisTuru = excluded.satisTuru,
  baslik = excluded.baslik,
  aciklama = excluded.aciklama,
  fiyat = excluded.fiyat,
  konum = excluded.konum,
  image = excluded.image,
  metreKare = excluded.metreKare,
  metreKareNet = excluded.metreKareNet,
  odaSayisi = excluded.odaSayisi,
  binaYasi = excluded.binaYasi,
  bulunduguKat = excluded.bulunduguKat,
  katSayisi = excluded.katSayisi,
  isitma = excluded.isitma,
  asansor = excluded.asansor,
  kimden = excluded.kimden,
  takas = excluded.takas;


-- Araba verileri
INSERT INTO araba_ilanlari (id, kategori, altKategori, marka, model, baslik, aciklama, fiyat, konum, image,
  yil, yakitTipi, vites, aracDurumu, km, motorGucu, renk, kimden, takas)
VALUES 
(1, 'Vasıta', 'SUV', 'Toyota', 'RAV4', 'Temiz araç', 'degisenı boyası yoktur', 
 350000, 'İstanbul/Ataşehir', 'https://i.pinimg.com/736x/79/2b/d4/792bd4b628a91b9534846fc6c67891ea.jpg',
 2025, 'Benzin', 'Otomatik', 'İkinci El', 45000, 170, 'Kırmızı', 'Sahibinden', 'Var')
ON CONFLICT(id) DO UPDATE SET
  kategori=excluded.kategori, 
  altKategori=excluded.altKategori, 
  marka=excluded.marka,
  model=excluded.model, 
  baslik=excluded.baslik, 
  aciklama=excluded.aciklama, 
  fiyat=excluded.fiyat,
  konum=excluded.konum, 
  image=excluded.image,
  yil=excluded.yil, 
  yakitTipi=excluded.yakitTipi, 
  vites=excluded.vites, 
  aracDurumu=excluded.aracDurumu,
  km=excluded.km, 
  motorGucu=excluded.motorGucu, 
  renk=excluded.renk, 
  kimden=excluded.kimden, 
  takas=excluded.takas;


INSERT INTO araba_ilanlari (id, kategori, altKategori, marka, model, baslik, aciklama, fiyat, konum, image,
  yil, yakitTipi, vites, aracDurumu, km, motorGucu, renk, kimden, takas)
VALUES 
(2, 'Vasıta', 'Otomobil', 'Honda', 'Civic', 'Bakımlı', 'degisenı boyası yoktur', 
 250000, 'Ankara/Keçiören', 'https://i.pinimg.com/1200x/73/a7/0e/73a70e9efebbfe96681bfc80709366d1.jpg',
 2020, 'Benzin', 'Manuel', 'İkinci El', 98000, 125, 'Gri', 'Galeriden', 'Yok')
ON CONFLICT(id) DO UPDATE SET
  kategori=excluded.kategori, 
  altKategori=excluded.altKategori, 
  marka=excluded.marka,
  model=excluded.model, 
  baslik=excluded.baslik, 
  aciklama=excluded.aciklama, 
  fiyat=excluded.fiyat,
  konum=excluded.konum, 
  image=excluded.image,
  yil=excluded.yil, 
  yakitTipi=excluded.yakitTipi, 
  vites=excluded.vites, 
  aracDurumu=excluded.aracDurumu,
  km=excluded.km,
  motorGucu=excluded.motorGucu,
  renk=excluded.renk, 
  kimden=excluded.kimden, 
  takas=excluded.takas;


INSERT INTO araba_ilanlari (id, kategori, altKategori, marka, model, baslik, aciklama, fiyat, konum, image,
  yil, yakitTipi, vites, aracDurumu, km, motorGucu, renk, kimden, takas)
VALUES 
(3, 'Vasıta', 'SUV', 'BMW', 'X5', 'BMW X5 çok temiz', 'degisenı boyası yoktur',
 95000, 'Trabzon/Merkez', 'https://i.pinimg.com/1200x/ff/b9/62/ffb96240508798a4be995f8a2d6046c5.jpg',
 2012, 'Dizel', 'Otomatik', 'İkinci El', 185000, 235, 'Siyah', 'Sahibinden', 'Var')
ON CONFLICT(id) DO UPDATE SET
  kategori=excluded.kategori, 
  altKategori=excluded.altKategori, 
  marka=excluded.marka,
  model=excluded.model, 
  baslik=excluded.baslik, 
  aciklama=excluded.aciklama, 
  fiyat=excluded.fiyat,
  konum=excluded.konum, 
  image=excluded.image,
  yil=excluded.yil, 
  yakitTipi=excluded.yakitTipi, 
  vites=excluded.vites, 
  aracDurumu=excluded.aracDurumu,
  km=excluded.km, 
  motorGucu=excluded.motorGucu, 
  renk=excluded.renk, 
  kimden=excluded.kimden, 
  takas=excluded.takas;


INSERT INTO araba_ilanlari (id, kategori, altKategori, marka, model, baslik, aciklama, fiyat, konum, image,
  yil, yakitTipi, vites, aracDurumu, km, motorGucu, renk, kimden, takas)
VALUES 
(4, 'Vasıta', 'Otomobil', 'Porsche', 'Taycan', 'çok temiz', 'degisenı boyası yoktur',
 5000000, 'Erzurum/Köprüköy', 'https://i.pinimg.com/1200x/b9/bf/9d/b9bf9d9e6435ca59795c6440d24daf25.jpg',
 2009, 'Elektrik', 'Otomatik', 'İkinci El', 55000, 350, 'Beyaz', 'Sahibinden', 'Yok')
ON CONFLICT(id) DO UPDATE SET
  kategori=excluded.kategori, 
  altKategori=excluded.altKategori, 
  marka=excluded.marka,
  model=excluded.model, 
  baslik=excluded.baslik, 
  aciklama=excluded.aciklama, 
  fiyat=excluded.fiyat,
  konum=excluded.konum, 
  image=excluded.image,
  yil=excluded.yil, 
  yakitTipi=excluded.yakitTipi, 
  vites=excluded.vites, 
  aracDurumu=excluded.aracDurumu,
  km=excluded.km, 
  motorGucu=excluded.motorGucu, 
  renk=excluded.renk, 
  kimden=excluded.kimden, 
  takas=excluded.takas;


INSERT INTO araba_ilanlari (id, kategori, altKategori, marka, model, baslik, aciklama, fiyat, konum, image,
  yil, yakitTipi, vites, aracDurumu, km, motorGucu, renk, kimden, takas)
VALUES 
(5, 'Vasıta', 'Otomobil', 'TOGG', 'T10F', 'SIFIR', 'degisenı boyası yoktur',
 2000000, 'Konya/Merkez', 'https://i.pinimg.com/736x/c2/97/1b/c2971bcf52a4426dc15b854eb87b157c.jpg',
 2003, 'Elektrik', 'Otomatik', 'İkinci El', 85000, 160, 'Mavi', 'Galeriden', 'Var')
ON CONFLICT(id) DO UPDATE SET
  kategori=excluded.kategori, 
  altKategori=excluded.altKategori, 
  marka=excluded.marka,
  model=excluded.model, 
  baslik=excluded.baslik, 
  aciklama=excluded.aciklama, 
  fiyat=excluded.fiyat,
  konum=excluded.konum, 
  image=excluded.image,
  yil=excluded.yil, 
  yakitTipi=excluded.yakitTipi, 
  vites=excluded.vites, 
  aracDurumu=excluded.aracDurumu,
  km=excluded.km, 
  motorGucu=excluded.motorGucu, 
  renk=excluded.renk, 
  kimden=excluded.kimden, 
  takas=excluded.takas;


INSERT INTO araba_ilanlari (id, kategori, altKategori, marka, model, baslik, aciklama, fiyat, konum, image,
  yil, yakitTipi, vites, aracDurumu, km, motorGucu, renk, kimden, takas)
VALUES 
(6, 'Vasıta', 'SUV', 'Kia', 'XCeed', 'SIFIR SAYILIR', 'degisenı boyası yoktur',
 2200000, 'Antalya/Kepez', 'https://i.pinimg.com/736x/7d/aa/c9/7daac90550c96a2222d05a3b9ec3d165.jpg',
 2024, 'Benzin', 'Otomatik', 'Sıfır', 500, 140, 'Turuncu', 'Sahibinden', 'Yok')
ON CONFLICT(id) DO UPDATE SET
  kategori=excluded.kategori, 
  altKategori=excluded.altKategori, 
  marka=excluded.marka,
  model=excluded.model, 
  baslik=excluded.baslik, 
  aciklama=excluded.aciklama, 
  fiyat=excluded.fiyat,
  konum=excluded.konum, 
  image=excluded.image,
  yil=excluded.yil, 
  yakitTipi=excluded.yakitTipi, 
  vites=excluded.vites, 
  aracDurumu=excluded.aracDurumu,
  km=excluded.km, 
  motorGucu=excluded.motorGucu, 
  renk=excluded.renk, 
  kimden=excluded.kimden, 
  takas=excluded.takas;


INSERT INTO araba_ilanlari (id, kategori, altKategori, marka, model, baslik, aciklama, fiyat, konum, image,
  yil, yakitTipi, vites, aracDurumu, km, motorGucu, renk, kimden, takas)
VALUES 
(7, 'Vasıta', 'SUV', 'Hyundai', 'Bayon', 'SIFIR SAYILIR', 'degisenı boyası yoktur',
 1500000, 'Giresun/Alucra', 'https://i.pinimg.com/1200x/04/42/bd/0442bda8f10bbf0b257f93802fe5a4ab.jpg',
 1990, 'LPG', 'Manuel', 'İkinci El', 230000, 95, 'Yeşil', 'Sahibinden', 'Var')
ON CONFLICT(id) DO UPDATE SET
  kategori=excluded.kategori, 
  altKategori=excluded.altKategori, 
  marka=excluded.marka,
  model=excluded.model, 
  baslik=excluded.baslik, 
  aciklama=excluded.aciklama, 
  fiyat=excluded.fiyat,
  konum=excluded.konum, 
  image=excluded.image,
  yil=excluded.yil, 
  yakitTipi=excluded.yakitTipi, 
  vites=excluded.vites, 
  aracDurumu=excluded.aracDurumu,
  km=excluded.km, 
  motorGucu=excluded.motorGucu, 
  renk=excluded.renk,
  kimden=excluded.kimden, 
  takas=excluded.takas;
`;


