import RootNavigator from "./navigation/RootNavigator";
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import * as SQLite from "expo-sqlite";
import { LoadingProvider } from "./components/LoadingProvider";

//const db = SQLite.openDatabaseSync("sahibinden.db");

export default function App() {
  //useDrizzleStudio(db);
  //exportDatabase();

    
  return (
    <LoadingProvider>
      <RootNavigator />
    </LoadingProvider>
  );;
}
