import { openDatabaseSync } from 'expo-sqlite';
import { RealEstateListing, CarListing } from '../../types/Listing';

export const db = openDatabaseSync('sahibinden.db');

export function getEmlakIlanlar(): RealEstateListing[] {
  try {
    return db.getAllSync<RealEstateListing>('SELECT * FROM emlak_ilanlari');
  } catch (err) {
    console.log("DB HATA (emlak):", err);
    return [];
  }
}

export function getArabaIlanlar(): CarListing[] {
  try {
    return db.getAllSync<CarListing>('SELECT * FROM araba_ilanlari');
  } catch (err) {
    console.log("DB HATA (araba):", err);
    return [];
  }
}
