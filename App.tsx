import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import RootNavigator from './navigation/RootNavigator';
import { useEffect } from 'react';
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';

async function loadDatabase() {
  console.log("DB yükleniyor...");

  // @ts-ignore (Expo assets TS bug fix)
  const asset = Asset.fromModule(require('./assets/database/sahibinden.db'));

  await asset.downloadAsync();

  // documentDirectory TS bug olduğu için güvenli çözüm:
  const docDir = FileSystem.documentDirectory ?? FileSystem.cacheDirectory;

  const sqliteFolder = docDir + 'SQLite/';
  const dbPath = sqliteFolder + 'sahibinden.db';

  const folder = await FileSystem.getInfoAsync(sqliteFolder);
  if (!folder.exists) {
    await FileSystem.makeDirectoryAsync(sqliteFolder, { intermediates: true });
  }

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
