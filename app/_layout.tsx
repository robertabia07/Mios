import { Stack } from 'expo-router';
import { criarBanco } from './database/database/database';

// Inicializa o banco de dados
criarBanco();

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }} />
  );
}