import { openDatabaseSync } from "expo-sqlite";
import * as FileSystem from "expo-file-system/legacy";

const db = openDatabaseSync("sahibinden.db");

export async function runMigrations() {
  // Versiyon tablosu
  db.execSync(`
    CREATE TABLE IF NOT EXISTS __schema_version (
      version INTEGER
    );
  `);

  // Mevcut versiyon
  const versionRow = db.getFirstSync<{ version: number }>(
    "SELECT version FROM __schema_version"
  );

  let currentVersion = versionRow?.version ?? 0;

  // migrations klasörünü oku
  const migrationFiles = await FileSystem.readDirectoryAsync(
    FileSystem.bundleDirectory + "migrations"
  );

  // SQL dosyalarını sıralayalım
  const sortedFiles = migrationFiles
    .filter((f) => f.endsWith(".sql"))
    .sort();

  for (const file of sortedFiles) {
    const version = parseInt(file.split("_")[0]); // 001 → 1

    if (version > currentVersion) {
      const sql = await FileSystem.readAsStringAsync(
        FileSystem.bundleDirectory + "migrations/" + file
      );

      // SQL çalıştır
      db.execSync(sql);

      // version güncelle
      db.execSync(`UPDATE __schema_version SET version = ${version}`);

      console.log("Migration uygulandı:", file);
    }
  }
}
