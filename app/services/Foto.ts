// Se você usa Expo SDK 54+, o caminho abaixo é 'expo-file-system/legacy'.
// Em SDKs anteriores, troque por 'expo-file-system'.
import * as FileSystem from 'expo-file-system/legacy';

// Copia a foto do cache para um local permanente do app.
export async function salvarFotoPermanente(uri: string | null): Promise<string | null> {
  if (!uri) return null;

  const pasta = `${FileSystem.documentDirectory}fotos/`;
  await FileSystem.makeDirectoryAsync(pasta, { intermediates: true }).catch(() => {});

  const destino = `${pasta}idoso_${Date.now()}.jpg`;
  await FileSystem.copyAsync({ from: uri, to: destino });
  return destino;
}