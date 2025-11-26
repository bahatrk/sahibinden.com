import RootNavigator from './navigation/RootNavigator';
import { useEffect } from 'react';
import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system/legacy';

async function loadDatabase() {
  console.log("DB yükleniyor...");

  // assets/database içindeki dosyayı al
  const asset = Asset.fromModule(require('./assets/database/sahibinden.db'));

  await asset.downloadAsync();

  // cihazda SQLite klasörü oluştur
  const sqliteFolder = FileSystem.documentDirectory + 'SQLite/';
  const dbPath = sqliteFolder + 'sahibinden.db';

  // SQLite klasörü yoksa olustur
  const folderInfo = await FileSystem.getInfoAsync(sqliteFolder);
  if (!folderInfo.exists) {
    await FileSystem.makeDirectoryAsync(sqliteFolder, { intermediates: true });
  }

  // Eski database varsa sil
  const dbInfo = await FileSystem.getInfoAsync(dbPath);
  if (dbInfo.exists) {
    console.log("Database zaten yüklü tekrar kopyalanmayacak.");
    return;
  }

  // İlk kurulumda sadece 1 kez kopyalanacak
  console.log("Database bulunamadı, ilk kez kopyalanıyor...");
  await FileSystem.copyAsync({
    from: asset.localUri!,
    to: dbPath,
  });

  console.log("Database başarıyla yüklendi:", dbPath);
}

export default function App() {
  useEffect(() => {
    loadDatabase();
  }, []);

  return <RootNavigator />;
}

