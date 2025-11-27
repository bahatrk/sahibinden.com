import { openDatabaseSync } from 'expo-sqlite';
import { Listing } from '../../types/Listing';

// DB cihazdaki gerçek yoldan açılır
export const db = openDatabaseSync('sahibinden.db');

export function getEmlakIlanlar(): Listing[] {
  try {
    const rows = db.getAllSync<Listing>('SELECT * FROM emlak_ilanlari'); // database den gelen her satırın Listing tipinde olacak
    return rows;
  } catch (err) {
    console.log("DB HATA:", err);
    return [];
  }
}

export function getArabaIlanlar(): Listing[] {
  try {
    const rows = db.getAllSync<Listing>('SELECT * FROM araba_ilanlari'); // database den gelen her satırın Listing tipinde olacak
    return rows;
  } catch (err) {
    console.log("DB HATA:", err);
    return [];
  }
}