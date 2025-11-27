export const seedSQL = `
-- Emlak verileri
INSERT INTO emlak_ilanlari (id, kategori, satisTuru, baslik, aciklama, fiyat, konum, image)
SELECT 1, 'Konut', 'Satılık', '3+1 Daire', 'Merkezi konumda, geniş daire', 450000, 'İstanbul', 'https://example.com/daire1.jpg'
WHERE NOT EXISTS (SELECT 1 FROM emlak_ilanlari WHERE id = 1);

INSERT INTO emlak_ilanlari (id, kategori, satisTuru, baslik, aciklama, fiyat, konum, image)
SELECT 2, 'Konut', 'Kiralık', '2+1 Daire', 'Yeni tadilatlı', 2000, 'Ankara', 'https://example.com/daire2.jpg'
WHERE NOT EXISTS (SELECT 1 FROM emlak_ilanlari WHERE id = 2);

INSERT INTO emlak_ilanlari (id, kategori, satisTuru, baslik, aciklama, fiyat, konum, image)
SELECT 3, 'Bina', 'Satılık', 'Ofis Binası', 'Şehir merkezinde', 750000, 'İzmir', 'https://example.com/bina1.jpg'
WHERE NOT EXISTS (SELECT 1 FROM emlak_ilanlari WHERE id = 3);

-- Araba verileri
INSERT INTO araba_ilanlari (id, kategori, altKategori, marka, baslik, aciklama, fiyat, konum, image)
SELECT 1, 'Araba', 'SUV', 'Toyota', 'Toyota RAV4', 'Temiz araç', 350000, 'İstanbul', 'https://example.com/car1.jpg'
WHERE NOT EXISTS (SELECT 1 FROM araba_ilanlari WHERE id = 1);

INSERT INTO araba_ilanlari (id, kategori, altKategori, marka, baslik, aciklama, fiyat, konum, image)
SELECT 2, 'Araba', 'Sedan', 'Honda', 'Honda Civic', 'Bakımlı', 250000, 'Ankara', 'https://example.com/car2.jpg'
WHERE NOT EXISTS (SELECT 1 FROM araba_ilanlari WHERE id = 2);
`;
