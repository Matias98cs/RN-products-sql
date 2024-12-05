import * as FileSystem from 'expo-file-system';

async function moveDatabase() {
    const documentDirectory = FileSystem.documentDirectory;
    const dbDirectory = `${documentDirectory}SQLite/`;
    
    // Verificar si la carpeta SQLite existe
    const dirInfo = await FileSystem.getInfoAsync(dbDirectory);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(dbDirectory, { intermediates: true });
    }
  
    // Obtener la ruta de la base de datos
    const dbPath = `${dbDirectory}myDataBase.db`;
  
    // Mover el archivo a un directorio más accesible
    await FileSystem.copyAsync({
      from: dbPath,
      to: FileSystem.documentDirectory + 'myDataBase.db', // Ruta accesible para Expo
    });
  
    console.log('Database moved to:', FileSystem.documentDirectory + 'myDataBase.db');
  }
  
  moveDatabase();