// @ts-nocheck
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
        currentDbVersion = 2
        await db.execAsync(`PRAGMA user_version = ${currentDbVersion}`);
    }

    if (currentDbVersion === 2) {
        console.log(`Migrando la base - version ${currentDbVersion + 1}`);

        await db.execAsync(`
            CREATE TABLE IF NOT EXISTS expenses (
                id TEXT PRIMARY KEY,
                value NUMERIC NOT NULL,
                category_id TEXT NOT NULL,
                deleted BOOLEAN DEFAULT FALSE,
                type_id TEXT NOT NULL,
                description TEXT,
                user_id TEXT NOT NULL,
                created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        console.log("Tabla creada Expenses");

        await db.execAsync(`
            CREATE TABLE IF NOT EXISTS categories (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                icon TEXT NOT NULL,
                color TEXT NOT NULL,
                user_id TEXT NOT NULL,
                created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        console.log("Tabla creada Categories");

        await db.execAsync(`
            CREATE TABLE IF NOT EXISTS users (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL, -- Contraseña hash
                created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        console.log("Tabla creada Users");


        await db.execAsync(`
            CREATE TABLE IF NOT EXISTS currencies (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                value TEXT NOT NULL,
                created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        console.log("Tabla creada Currencies");

        currentDbVersion = 3
        await db.execAsync(`PRAGMA user_version = ${currentDbVersion}`);
    }
}