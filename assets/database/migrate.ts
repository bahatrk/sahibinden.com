import { openDatabaseSync } from 'expo-sqlite';
import { initSQL } from '../migrations/001_init';
import { seedSQL } from '../migrations/002_seed_data';

const db = openDatabaseSync('sahibinden.db');

export function runMigrations() {
  try {
    db.execSync(initSQL);
    console.log('Migration 001_init başarıyla uygulandı');

    db.execSync(seedSQL);
    console.log('Migration 002_seed_data başarıyla uygulandı');
  } catch (err) {
    console.log('Migration HATA:', err);
  }
}
