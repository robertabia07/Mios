import { useLocalSearchParams, useRouter } from 'expo-router';
import { Plus } from 'lucide-react-native';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
 
export function InicioScreen() {
  const router = useRouter();
 
  const { usuarioId } = useLocalSearchParams<{
    usuarioId: string;
  }>();
 
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.botaoPerfil}
        onPress={() =>
          router.push({
            pathname: '/Perfilc',
            params: {
              usuarioId: String(usuarioId) },
          })
        }
      >
        <Text style={styles.textoPerfil}>Meu perfil</Text>
      </TouchableOpacity>
 
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={[styles.circleButton, styles.plusButton]}
          onPress={() => router.push('/Cadastrodopaciente')}
        >
          <Plus size={64} color="#FFFFFF" strokeWidth={3} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#d7b5eb',
    borderWidth: 0,
  },
 
  buttonsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 32,
  },
 
  circleButton: {
    width: 128,
    height: 128,
    borderRadius: 64,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
 
  plusButton: {
    backgroundColor: '#7B2CBF',
  },
 
  botaoPerfil: {
    alignSelf: 'flex-start',
    marginLeft: 20,
    marginTop: 20,
    padding: 10,
  },
 
  textoPerfil: {
    fontSize: 16,
    color: '#471C6C',
    fontWeight: 'bold',
  },
});
 