import { StyleSheet, Text, View } from 'react-native';
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
  const folderInfo = await FileSystem.getInfoAsync(sqliteFolder);

  if (!folderInfo.exists) {
    await FileSystem.makeDirectoryAsync(sqliteFolder, { intermediates: true });
  }

  // Dosyayı buraya kopyala
  const dbPath = sqliteFolder + 'sahibinden.db';
  await FileSystem.copyAsync({
    from: asset.localUri!,
    to: dbPath
  });

  console.log("Database başarıyla yüklendi:", dbPath);
}

export default function App() {
  useEffect(() => {
    loadDatabase();
  }, []);

  return <RootNavigator />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
