import { SQLiteDatabase } from "expo-sqlite";
import * as FileSystem from "expo-file-system";

// Obtiene la ruta de la base de datos
export async function getDatabasePath() {
    const documentDirectory = FileSystem.documentDirectory;
    const dbDirectory = `${documentDirectory}SQLite/`;

    const dirInfo = await FileSystem.getInfoAsync(dbDirectory);
    if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(dbDirectory, { intermediates: true });
    }

    return `${dbDirectory}myDataBase01.db`;
}

// Migrations y configuracion de la base de datos
export async function migrateDbIfNeeded(db: SQLiteDatabase) {
    let DATABASE_VERSION = 1;

    let { user_version: currentDbVersion } = await db.getFirstAsync<{
        user_version: number;
    }>("PRAGMA user_version");

    console.log("Versión actual de la base de datos:", currentDbVersion);

    if (currentDbVersion >= DATABASE_VERSION) {
        return;
    }

    if (currentDbVersion === 0) {
        console.log("Migrando la base de datos...");

        await db.execAsync(`
        PRAGMA journal_mode = 'wal';
        CREATE TABLE IF NOT EXISTS productos (
          id INTEGER PRIMARY KEY NOT NULL, 
          nombre TEXT NOT NULL, 
          precio REAL NOT NULL, 
          categoria TEXT NOT NULL
        );
      `);

        await db.runAsync(
            "INSERT INTO productos (nombre, precio, categoria) VALUES (?, ?, ?)",
            "Camiseta", 15.99, "Ropa"
        );

        await db.runAsync(
            "INSERT INTO productos (nombre, precio, categoria) VALUES (?, ?, ?)",
            "Zapatos", 49.99, "Calzado"
        );

        await db.runAsync(
            "INSERT INTO productos (nombre, precio, categoria) VALUES (?, ?, ?)",
            "Portátil", 799.99, "Electrónica"
        );
        currentDbVersion = 1

        await db.execAsync(`PRAGMA user_version = ${currentDbVersion}`);
    }

    if (currentDbVersion === 1) {
        console.log(`Migrando la base - version ${currentDbVersion + 1}`);

        await db.execAsync(`
          PRAGMA journal_mode = 'wal';
          CREATE TABLE IF NOT EXISTS productos (
            id INTEGER PRIMARY KEY NOT NULL, 
            nombre TEXT NOT NULL, 
            precio REAL NOT NULL, 
            categoria TEXT NOT NULL
          );
        `);

        await db.runAsync(
            "INSERT INTO productos (nombre, precio, categoria) VALUES (?, ?, ?)",
            "Camiseta", 15.99, "Ropa"
        );

        await db.runAsync(
            "INSERT INTO productos (nombre, precio, categoria) VALUES (?, ?, ?)",
            "Zapatos", 49.99, "Calzado"
        );

        await db.runAsync(
            "INSERT INTO productos (nombre, precio, categoria) VALUES (?, ?, ?)",
            "Portátil", 799.99, "Electrónica"
        );
        
        currentDbVersion = 2

        await db.execAsync(`PRAGMA user_version = ${currentDbVersion}`);
    }

    if (currentDbVersion === 2) {
        console.log(`Version ${currentDbVersion}`)
    }
}

// export async function deleteDatabase() {
//     const dbPath = await getDatabasePath();
//     await FileSystem.deleteAsync(dbPath);
//     console.log("Base de datos eliminada.");
// }