import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { buscarUsuarioPorId } from '../database/database/database.js';
 
type Usuario = {
  id: number;
  nome: string;
  email: string;
  tipo: string;
};
 
export default function Perfilc() {
  const { usuarioId } = useLocalSearchParams<{
    usuarioId: string;
  }>();
 
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [carregando, setCarregando] = useState(true);
 
  useEffect(() => {
    try {
      if (!usuarioId) {
        setUsuario(null);
        return;
      }
 
      const dados = buscarUsuarioPorId(usuarioId);
      setUsuario((dados as Usuario | null) ?? null);
    } catch (error) {
      console.error('Erro ao buscar perfil:', error);
      setUsuario(null);
    } finally {
      setCarregando(false);
    }
  }, [usuarioId]);
 
  if (carregando) {
    return (
      <View style={styles.container}>
        <ActivityIndicator color="#7B2CBF" size="large" />
      </View>
    );
  }
 
  if (!usuario) {
    return (
      <View style={styles.container}>
        <Text>Não foi possível carregar o perfil.</Text>
        <Text>Verifique se o usuário está identificado.</Text>
      </View>
    );
  }
 
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Meu Perfil</Text>
 
      <Text style={styles.label}>Nome completo</Text>
      <Text style={styles.valor}>{usuario.nome}</Text>
 
      <Text style={styles.label}>E-mail</Text>
      <Text style={styles.valor}>{usuario.email}</Text>
 
      <Text style={styles.label}>Tipo de usuário</Text>
      <Text style={styles.valor}>{usuario.tipo}</Text>
    </View>
  );
}
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3CBFF',
    padding: 25,
    paddingTop: 60,
  },
  titulo: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#471C6C',
    marginBottom: 25,
  },
  label: {
    color: '#7B2CBF',
    fontSize: 14,
    marginTop: 18,
  },
  valor: {
    color: '#240046',
    fontSize: 17,
    marginTop: 5,
  },
  botaoPerfil: {
    alignSelf: 'flex-start',
    marginLeft: 20,
    padding: 10,
  },
 
  textoPerfil: {
    fontSize: 16,
    color: '#7b2cbf',
    fontWeight: 'bold',
  },
});