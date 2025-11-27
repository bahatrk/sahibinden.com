import { openDatabaseSync } from 'expo-sqlite';
import { initSQL } from '../migrations/001.init';

const db = openDatabaseSync('sahibinden.db');

export function runMigrations() {
  try {
    db.execSync(initSQL); // 001_init.sql çalıştırıldı
    console.log("Migration 001_init başarıyla uygulandı");

    // Yeni migration varsa buraya ekle
    // db.execSync(addAgeSQL);

  } catch (err) {
    console.log("Migration HATA:", err);
  }
}
