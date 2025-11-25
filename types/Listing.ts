// her ilan kaydı nasıl gözükecek onu tanımladık
export interface Listing {
  id: number;
  kategori: string; // "araba", "emlak" vs.
  baslik: string;
  aciklama: string;
  fiyat: number;
  konum: string;
  image: string;

  type: string; // Konut veya Bina
  saleType: string; // Kiralık veya Satılık
}
