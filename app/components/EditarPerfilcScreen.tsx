import { useRouter } from 'expo-router';
import { Heart, Mail, Phone, User } from 'lucide-react-native';
import { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
 
export default function EditarPerfilc() {
  const router = useRouter();
 
  const [nome, setNome] = useState('Nome do Cuidador');
  const [email, setEmail] = useState('cuidador@email.com');
  const [telefone, setTelefone] = useState('(41) 99999-9999');
  const [relacao, setRelacao] = useState('Filha');
 
  function salvarAlteracoes() {
    if (!nome || !email || !telefone || !relacao) {
      Alert.alert('Atenção', 'Preencha todos os campos.');
      return;
    }
 
    Alert.alert(
      'Sucesso!',
      'Seus dados foram atualizados.',
      [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]
    );
  }
 
  return (
    <ScrollView style={styles.container}>
      
      {/* Cabeçalho */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.voltar}>←</Text>
        </TouchableOpacity>
 
        <Text style={styles.titulo}>Editar Perfil</Text>
      </View>
 
      {/* Foto */}
      <View style={styles.fotoContainer}>
        <View style={styles.foto}>
          <User size={55} color="#7B2CBF" />
        </View>
 
        <TouchableOpacity>
          <Text style={styles.alterarFoto}>
            Alterar foto
          </Text>
        </TouchableOpacity>
      </View>
 
      {/* Nome */}
      <View style={styles.campo}>
        <Text style={styles.label}>Nome completo</Text>
 
        <View style={styles.inputContainer}>
          <User size={20} color="#7B2CBF" />
 
          <TextInput
            style={styles.input}
            value={nome}
            onChangeText={setNome}
            placeholder="Digite seu nome"
            placeholderTextColor="#999"
          />
        </View>
      </View>
 
      {/* E-mail */}
      <View style={styles.campo}>
        <Text style={styles.label}>E-mail</Text>
 
        <View style={styles.inputContainer}>
          <Mail size={20} color="#7B2CBF" />
 
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Digite seu e-mail"
            placeholderTextColor="#999"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
      </View>
 
      {/* Telefone */}
      <View style={styles.campo}>
        <Text style={styles.label}>Telefone</Text>
 
        <View style={styles.inputContainer}>
          <Phone size={20} color="#7B2CBF" />
 
          <TextInput
            style={styles.input}
            value={telefone}
            onChangeText={setTelefone}
            placeholder="Digite seu telefone"
            placeholderTextColor="#999"
            keyboardType="phone-pad"
          />
        </View>
      </View>
 
      {/* Relação com o idoso */}
      <View style={styles.campo}>
        <Text style={styles.label}>
          Relação com o idoso
        </Text>
 
        <View style={styles.inputContainer}>
          <Heart size={20} color="#7B2CBF" />
 
          <TextInput
            style={styles.input}
            value={relacao}
            onChangeText={setRelacao}
            placeholder="Ex.: Filha, filho, neta..."
            placeholderTextColor="#999"
          />
        </View>
      </View>
 
      {/* Botão salvar */}
      <TouchableOpacity
        style={styles.botao}
        onPress={salvarAlteracoes}
      >
        <Text style={styles.botaoTexto}>
          Salvar alterações
        </Text>
      </TouchableOpacity>
 
      {/* Cancelar */}
      <TouchableOpacity
        style={styles.cancelar}
        onPress={() => router.back()}
      >
        <Text style={styles.cancelarTexto}>
          Cancelar
        </Text>
      </TouchableOpacity>
 
    </ScrollView>
  );
}
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3CBFF',
  },
 
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
 
  voltar: {
    fontSize: 30,
    color: '#471C6C',
    marginRight: 15,
  },
 
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#471C6C',
  },
 
  fotoContainer: {
    alignItems: 'center',
    marginBottom: 25,
  },
 
  foto: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
 
  alterarFoto: {
    marginTop: 10,
    color: '#7B2CBF',
    fontSize: 16,
    fontWeight: 'bold',
  },
 
  campo: {
    marginHorizontal: 20,
    marginBottom: 18,
  },
 
  label: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#471C6C',
    marginBottom: 7,
  },
 
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 52,
  },
 
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: '#240046',
  },
 
  botao: {
    backgroundColor: '#7B2CBF',
    marginHorizontal: 20,
    marginTop: 10,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
 
  botaoTexto: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: 'bold',
  },
 
  cancelar: {
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 30,
  },
 
  cancelarTexto: {
    color: '#7B2CBF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});