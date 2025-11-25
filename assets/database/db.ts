import { openDatabaseSync } from 'expo-sqlite';
import { Listing } from '../../types/Listing';

// DB cihazdaki gerçek yoldan açılır
export const db = openDatabaseSync('sahibinden.db');

export function getCars(): Listing[] {
  try {
    const rows = db.getAllSync<Listing>('SELECT * FROM ilanlar'); // database den gelen her satırın Listing tipinde olacak
    return rows;
  } catch (err) {
    console.log("DB HATA:", err);
    return [];
  }
}
