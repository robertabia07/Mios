import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  Calendar,
  FileText,
  HeartPulse,
  Phone,
  Save,
  User,
} from 'lucide-react-native';
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
 
export default function EditarPerfili() {
  const router = useRouter();
 
  const [nome, setNome] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [codigo, setCodigo] = useState('');
  const [diagnostico, setDiagnostico] = useState('');
  const [telefone, setTelefone] = useState('');
  const [observacoes, setObservacoes] = useState('');
 
  function salvarAlteracoes() {
    if (!nome.trim()) {
      Alert.alert(
        'Campo obrigatório',
        'Informe o nome do idoso.'
      );
      return;
    }
 
    // Integre aqui a atualização dos dados no SQLite.
 
    Alert.alert(
      'Sucesso',
      'Os dados foram validados. Conecte esta função ao SQLite para salvar as alterações permanentemente.',
      [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]
    );
  }
 
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.conteudo}
      keyboardShouldPersistTaps="handled"
    >
      {/* Cabeçalho */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.botaoVoltar}
        >
          <ArrowLeft size={25} color="#471C6C" />
        </TouchableOpacity>
 
        <Text style={styles.titulo}>
          Editar perfil do idoso
        </Text>
      </View>
 
      <Text style={styles.subtitulo}>
        Mantenha os dados do idoso atualizados para
        facilitar seu acompanhamento pelo MIOS.
      </Text>
 
      {/* Foto ilustrativa */}
      <View style={styles.fotoContainer}>
        <View style={styles.foto}>
          <User size={55} color="#7B2CBF" />
        </View>
 
        <Text style={styles.nomeFoto}>
          Perfil do idoso
        </Text>
 
        <Text style={styles.ajudaFoto}>
          Dados pessoais e informações de acompanhamento
        </Text>
      </View>
 
      {/* Dados pessoais */}
      <View style={styles.card}>
        <Text style={styles.secaoTitulo}>
          Dados pessoais
        </Text>
 
        <Text style={styles.label}>Nome completo *</Text>
        <View style={styles.inputContainer}>
          <User size={20} color="#7B2CBF" />
          <TextInput
            style={styles.input}
            value={nome}
            onChangeText={setNome}
            placeholder="Nome completo do idoso"
            placeholderTextColor="#999"
          />
        </View>
 
        <Text style={styles.label}>Data de nascimento</Text>
        <View style={styles.inputContainer}>
          <Calendar size={20} color="#7B2CBF" />
          <TextInput
            style={styles.input}
            value={dataNascimento}
            onChangeText={setDataNascimento}
            placeholder="DD/MM/AAAA"
            placeholderTextColor="#999"
          />
        </View>
 
        <Text style={styles.label}>
          Código de cadastro
        </Text>
        <View style={styles.inputContainer}>
          <FileText size={20} color="#7B2CBF" />
          <TextInput
            style={[styles.input, styles.inputCodigo]}
            value={codigo}
            onChangeText={setCodigo}
            placeholder="Código do idoso"
            placeholderTextColor="#999"
            editable={false}
          />
        </View>
 
        <Text style={styles.dica}>
          O código identifica o cadastro do idoso e não
          pode ser alterado nesta tela.
        </Text>
      </View>
 
      {/* Informações de saúde */}
      <View style={styles.card}>
        <Text style={styles.secaoTitulo}>
          Informações de saúde
        </Text>
 
        <Text style={styles.label}>Diagnóstico informado</Text>
        <View style={styles.inputContainer}>
          <HeartPulse size={20} color="#7B2CBF" />
          <TextInput
            style={styles.input}
            value={diagnostico}
            onChangeText={setDiagnostico}
            placeholder="Ex.: Alzheimer, demência vascular..."
            placeholderTextColor="#999"
          />
        </View>
 
        <Text style={styles.dica}>
          Informe o diagnóstico já conhecido. O aplicativo
          não realiza diagnósticos médicos.
        </Text>
 
        <Text style={styles.label}>
          Telefone de contato
        </Text>
        <View style={styles.inputContainer}>
          <Phone size={20} color="#7B2CBF" />
          <TextInput
            style={styles.input}
            value={telefone}
            onChangeText={setTelefone}
            placeholder="Telefone para contato"
            placeholderTextColor="#999"
            keyboardType="phone-pad"
          />
        </View>
 
        <Text style={styles.label}>
          Observações importantes
        </Text>
        <TextInput
          style={styles.textarea}
          value={observacoes}
          onChangeText={setObservacoes}
          placeholder="Registre informações relevantes sobre o idoso..."
          placeholderTextColor="#999"
          multiline
          numberOfLines={5}
          textAlignVertical="top"
        />
      </View>
 
      {/* Botão salvar */}
      <TouchableOpacity
        style={styles.botaoSalvar}
        onPress={salvarAlteracoes}
      >
        <Save size={21} color="#FFFFFF" />
        <Text style={styles.textoSalvar}>
          Salvar alterações
        </Text>
      </TouchableOpacity>
 
      {/* Cancelar */}
      <TouchableOpacity
        style={styles.botaoCancelar}
        onPress={() => router.back()}
      >
        <Text style={styles.textoCancelar}>
          Cancelar
        </Text>
      </TouchableOpacity>
 
      <Text style={styles.rodape}>
        MIOS • Acompanhamento e cuidado
      </Text>
    </ScrollView>
  );
}
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3CBFF',
  },
 
  conteudo: {
    paddingBottom: 30,
  },
 
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
  },
 
  botaoVoltar: {
    marginRight: 12,
    padding: 4,
  },
 
  titulo: {
    flex: 1,
    fontSize: 22,
    fontWeight: 'bold',
    color: '#471C6C',
  },
 
  subtitulo: {
    marginHorizontal: 22,
    marginBottom: 20,
    fontSize: 14,
    lineHeight: 21,
    color: '#5E3975',
  },
 
  fotoContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
 
  foto: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#BE83E0',
  },
 
  nomeFoto: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#471C6C',
  },
 
  ajudaFoto: {
    marginTop: 5,
    marginHorizontal: 20,
    textAlign: 'center',
    fontSize: 12,
    color: '#6B5680',
  },
 
  card: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 18,
    marginBottom: 18,
    padding: 18,
    borderRadius: 18,
  },
 
  secaoTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#471C6C',
    marginBottom: 18,
  },
 
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#471C6C',
    marginBottom: 7,
    marginTop: 10,
  },
 
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF6FC',
    borderWidth: 1,
    borderColor: '#E5D4EF',
    borderRadius: 12,
    paddingHorizontal: 12,
    minHeight: 50,
  },
 
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: '#240046',
    paddingVertical: 10,
  },
 
  inputCodigo: {
    color: '#777777',
  },
 
  dica: {
    fontSize: 12,
    lineHeight: 18,
    color: '#777777',
    marginTop: 7,
  },
 
  textarea: {
    minHeight: 120,
    backgroundColor: '#FAF6FC',
    borderWidth: 1,
    borderColor: '#E5D4EF',
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    color: '#240046',
  },
 
  botaoSalvar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#7B2CBF',
    marginHorizontal: 18,
    paddingVertical: 16,
    borderRadius: 14,
    gap: 10,
  },
 
  textoSalvar: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
 
  botaoCancelar: {
    alignItems: 'center',
    paddingVertical: 16,
  },
 
  textoCancelar: {
    color: '#7B2CBF',
    fontSize: 15,
    fontWeight: 'bold',
  },
 
  rodape: {
    textAlign: 'center',
    fontSize: 12,
    color: '#806A91',
    marginTop: 5,
  },
});