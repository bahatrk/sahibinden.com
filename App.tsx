import RootNavigator from "./navigation/RootNavigator";
import { useEffect } from "react";
import * as FileSystem from "expo-file-system/legacy"; // legacy kullanmamızın nedenı readDirectoryAsync,readAsStringAsync,copyAsync,getInfoAsync yenı expofilesystem apisınde yok
import { runMigrations } from "./assets/database/migrate";

export default function App() {
  useEffect(() => {
    (async () => {
      // SQLite klasörü yoksa oluştur
      const sqliteDir = FileSystem.documentDirectory + "SQLite/";
      const exists = (await FileSystem.getInfoAsync(sqliteDir)).exists;

      if (!exists) {
        await FileSystem.makeDirectoryAsync(sqliteDir);
      }

      // Migration çalıştır
      await runMigrations();
    })();
  }, []);

  return <RootNavigator />;
}
