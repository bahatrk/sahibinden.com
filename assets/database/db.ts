import { openDatabaseSync } from 'expo-sqlite';
import { RealEstateListing, CarListing } from '../../types/Listing';

// DB cihazdaki gerçek yoldan açılır
export const db = openDatabaseSync('sahibinden.db');

export function getEmlakIlanlar(): RealEstateListing[] {
  try {
    const rows = db.getAllSync<RealEstateListing>('SELECT * FROM emlak_ilanlari'); // database den gelen her satırın Listing tipinde olacak
    return rows;
  } catch (err) {
    console.log("DB HATA:", err);
    return [];
  }
}

export function getArabaIlanlar(): CarListing[] {
  try {
    const rows = db.getAllSync<CarListing>('SELECT * FROM araba_ilanlari'); // database den gelen her satırın Listing tipinde olacak
    return rows;
  } catch (err) {
    console.log("DB HATA:", err);
    return [];
  }
}