import RootNavigator from "./navigation/RootNavigator";
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabaseSync("sahibinden.db");

export default function App() {
  useDrizzleStudio(db);
  //exportDatabase();

  return <RootNavigator />;
}
