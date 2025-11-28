// her ilan kaydı nasıl gözükecek onu tanımladık
export interface RealEstateListing {
  id: number;
  kategori: string; 
  satisTuru: string;
  baslik: string;
  aciklama: string;
  fiyat: number;
  konum: string;
  image: string;
}

export interface CarListing {
  id: number;
  kategori: string;
  altKategori: string;
  marka: string;
  model: string;
  baslik: string;
  aciklama: string;
  fiyat: number;
  konum: string;
  image: string;
}