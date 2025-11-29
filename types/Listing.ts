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
  metreKareBrut: number;
  metreKareNet: number;
  odaSayisi: string;
  binaYasi: number;
  bulunduguKat: number;
  katSayisi: number;
  isitma: string;
  asansor: string;
  kimden: string;
  takas: string;
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
  yil: number;
  yakitTipi: string;
  vites: string;
  aracDurumu: string;
  km: number;
  motorGucu: number;
  renk: string;
  kimden: string;
  takas: string; 
}