import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
 
import { router, useLocalSearchParams } from 'expo-router';
 
import {
  ArrowLeft,
  Calendar,
  Edit,
  HeartPulse,
  User,
  Users,
  VenusAndMars,
} from 'lucide-react-native';
 
import {
  buscarHistoricoFamiliar,
  buscarIdosoPorId,
  buscarRespostasSaude,
} from '../database/database/database.js';
 
// Ajuste o caminho do import caso este arquivo esteja em outra pasta.
 
type RespostaBanco = {
  pergunta_id: string;
  resposta: number;
  detalhes?: string | null;
};
 
type PacienteBanco = {
  id: number;
  nome: string;
  idade: number;
  genero: string;
  foto: string | null;
};
 
type Paciente = PacienteBanco & {
  questionario: Record<string, boolean>;
  historicoFamiliar: Record<
    string,
    { resposta: boolean; detalhes: string | null }
  >;
};
 
const perguntasSaude = [
  { id: 'q1', texto: 'Já teve um lado do corpo paralisado e depois melhorou.' },
  { id: 'q2', texto: 'Já teve perda súbita da visão e depois melhorou.' },
  { id: 'q3', texto: 'Perdeu muito peso nos últimos 6 meses.' },
  { id: 'q4', texto: 'Ganhou muito peso nos últimos 6 meses.' },
  { id: 'q5', texto: 'Pensou em cometer suicídio.' },
  { id: 'q6', texto: 'Já teve ataques de pânico.' },
  { id: 'q7', texto: 'Está andando mais devagar nos últimos 2 anos.' },
  { id: 'q8', texto: 'A letra ficou menor ou mais trêmula nos últimos 2 anos.' },
  { id: 'q9', texto: 'Sua expressão facial mudou nos últimos 2 anos.' },
  { id: 'q10', texto: 'Tem algum problema de memória.' },
  { id: 'q11', texto: 'Já sofreu algum abuso sexual ou agressão física.' },
  { id: 'q12', texto: 'Um médico já lhe disse que sofreu um ataque cardíaco ou infarto.' },
  { id: 'q13', texto: 'Um médico já lhe disse que tem pressão alta ou hipertensão.' },
  { id: 'q14', texto: 'Um médico já lhe disse que sofreu um derrame, AVC ou isquemia.' },
  { id: 'q15', texto: 'Já sofreu uma pancada no cérebro que o fez desmaiar.' },
  { id: 'q16', texto: 'Já teve convulsões ou epilepsia.' },
  { id: 'q17', texto: 'Já fumou.' },
  { id: 'q18', texto: 'Já bebeu bebidas alcoólicas regularmente.' },
  { id: 'q19', texto: 'Já achou que bebia demais.' },
  { id: 'q20', texto: 'A bebida já ocasionou problemas com emprego, relacionamento ou ao dirigir.' },
  { id: 'q21', texto: 'Já tomou medicamentos dos quais não conseguiu ficar sem, como para dormir ou lidar com situações difíceis.' },
  { id: 'q22', texto: 'É considerado uma pessoa nervosa.' },
  { id: 'q23', texto: 'Teve uma doença emocional ou nervosa que necessitou de tratamento.' },
  { id: 'q24', texto: 'Teve um sério problema de saúde após tomar um novo remédio via oral ou injetável.' },
  { id: 'q25', texto: 'Perdeu a consciência.' },
  { id: 'q26', texto: 'Ficou muito confuso.' },
  { id: 'q27', texto: 'Teve febre.' },
  { id: 'q28', texto: 'Foi internado no hospital.' },
];
 
const perguntasFamiliares = [
  { id: 'fq1', texto: 'Familiar teve que ser internado por não conseguir cuidar de si devido à confusão mental ou problemas de memória.' },
  { id: 'fq2', texto: 'Familiar sofreu ataque cardíaco ou teve morte súbita.' },
  { id: 'fq3', texto: 'Familiar sofreu um derrame, fraqueza ou dificuldade súbita na fala.' },
  { id: 'fq4', texto: 'Familiar teve pressão alta.' },
  { id: 'fq5', texto: 'Familiar teve diabetes.' },
  { id: 'fq6', texto: 'Familiar teve doença de Parkinson.' },
  { id: 'fq7', texto: 'Familiar teve filho portador de doenças mentais ou síndrome de Down.' },
  { id: 'fq8', texto: 'Familiar teve leucemia.' },
  { id: 'fq9', texto: 'Familiar teve câncer.' },
  { id: 'fq10', texto: 'Familiar necessitou de tratamento para doença emocional ou nervosa.' },
];
 
export default function PerfiliScreen() {
  const { idosoId } = useLocalSearchParams<{
    idosoId?: string | string[];
  }>();
 
  const [paciente, setPaciente] = useState<Paciente | null>(null);
  const [carregando, setCarregando] = useState(true);
 
  useEffect(() => {
    carregarPaciente();
  }, [idosoId]);
 
  function carregarPaciente() {
    setCarregando(true);
 
    try {
      const idRecebido = Array.isArray(idosoId)
        ? idosoId[0]
        : idosoId;
 
      if (!idRecebido || !Number.isInteger(Number(idRecebido))) {
        setPaciente(null);
        return;
      }
 
      const id = Number(idRecebido);
 
      const dados = buscarIdosoPorId(id) as PacienteBanco | null;
 
      if (!dados) {
        setPaciente(null);
        return;
      }
 
      const respostas = buscarRespostasSaude(id) as RespostaBanco[];
      const historico = buscarHistoricoFamiliar(id) as RespostaBanco[];
 
      const questionario: Record<string, boolean> = {};
 
      respostas.forEach((item) => {
        questionario[item.pergunta_id] = Number(item.resposta) === 1;
      });
 
      const historicoFamiliar: Record<
        string,
        { resposta: boolean; detalhes: string | null }
      > = {};
 
      historico.forEach((item) => {
        historicoFamiliar[item.pergunta_id] = {
          resposta: Number(item.resposta) === 1,
          detalhes: item.detalhes ?? null,
        };
      });
 
      setPaciente({
        ...dados,
        questionario,
        historicoFamiliar,
      });
    } catch (error) {
      console.error('Erro ao carregar perfil do paciente:', error);
 
      Alert.alert(
        'Erro',
        'Não foi possível carregar os dados do paciente.'
      );
 
      setPaciente(null);
    } finally {
      setCarregando(false);
    }
  }
 
  if (carregando) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#7B2CBF" />
        <Text style={styles.loadingText}>Carregando perfil...</Text>
      </View>
    );
  }
 
  if (!paciente) {
    return (
      <View style={styles.centerContainer}>
        <User size={55} color="#7B2CBF" />
 
        <Text style={styles.emptyTitle}>
          Paciente não encontrado
        </Text>
 
        <Text style={styles.emptyDescription}>
          Não foi possível localizar os dados. Volte e selecione
          um paciente cadastrado.
        </Text>
 
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={20} color="#FFFFFF" />
          <Text style={styles.editText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }
 
  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {/* CABEÇALHO */}
 
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={25} color="#FFFFFF" />
          </TouchableOpacity>
 
          <Text style={styles.headerTitle}>
            Perfil do paciente
          </Text>
 
          <View style={styles.headerSpace} />
        </View>
 
        {/* FOTO E NOME */}
 
        <View style={styles.profileContainer}>
          <View style={styles.photoContainer}>
            {paciente.foto ? (
              <Image
                source={{ uri: paciente.foto }}
                style={styles.photo}
              />
            ) : (
              <User size={55} color="#7B2CBF" />
            )}
          </View>
 
          <Text style={styles.name}>{paciente.nome}</Text>
 
          <Text style={styles.age}>
            {paciente.idade} anos
          </Text>
        </View>
 
        {/* DADOS PESSOAIS */}
 
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>
            Dados pessoais
          </Text>
 
          <View style={styles.infoRow}>
            <Calendar size={24} color="#7B2CBF" />
 
            <View style={styles.infoTextContainer}>
              <Text style={styles.label}>Idade</Text>
              <Text style={styles.value}>
                {paciente.idade} anos
              </Text>
            </View>
          </View>
 
          <View style={styles.infoRow}>
            <VenusAndMars size={24} color="#7B2CBF" />
 
            <View style={styles.infoTextContainer}>
              <Text style={styles.label}>Gênero</Text>
              <Text style={styles.value}>
                {paciente.genero}
              </Text>
            </View>
          </View>
        </View>
 
        {/* QUESTIONÁRIO DE SAÚDE */}
 
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <HeartPulse size={24} color="#7B2CBF" />
 
            <Text style={styles.sectionTitle}>
              Questionário de Saúde
            </Text>
          </View>
 
          <Text style={styles.description}>
            Respostas registradas durante o cadastro do paciente.
          </Text>
 
          {perguntasSaude.map((pergunta) => {
            const respondeu =
              paciente.questionario[pergunta.id] === true;
 
            if (!respondeu) {
              return null;
            }
 
            return (
              <View
                key={pergunta.id}
                style={styles.answerRow}
              >
                <View style={styles.check}>
                  <Text style={styles.checkText}>✓</Text>
                </View>
 
                <Text style={styles.answerText}>
                  {pergunta.texto}
                </Text>
              </View>
            );
          })}
 
          {!perguntasSaude.some(
            (pergunta) =>
              paciente.questionario[pergunta.id] === true
          ) && (
            <Text style={styles.emptyText}>
              Nenhuma resposta positiva registrada.
            </Text>
          )}
        </View>
 
        {/* HISTÓRICO FAMILIAR */}
 
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Users size={24} color="#7B2CBF" />
 
            <Text style={styles.sectionTitle}>
              Histórico Familiar
            </Text>
          </View>
 
          <Text style={styles.description}>
            Informações familiares registradas durante o cadastro.
          </Text>
 
          {perguntasFamiliares.map((pergunta) => {
            const resposta =
              paciente.historicoFamiliar[pergunta.id];
 
            if (!resposta?.resposta) {
              return null;
            }
 
            return (
              <View
                key={pergunta.id}
                style={styles.answerRow}
              >
                <View style={styles.check}>
                  <Text style={styles.checkText}>✓</Text>
                </View>
 
                <View style={styles.answerContent}>
                  <Text style={styles.answerText}>
                    {pergunta.texto}
                  </Text>
 
                  {resposta.detalhes ? (
                    <Text style={styles.detailsText}>
                      Detalhes: {resposta.detalhes}
                    </Text>
                  ) : null}
                </View>
              </View>
            );
          })}
 
          {!perguntasFamiliares.some(
            (pergunta) =>
              paciente.historicoFamiliar[pergunta.id]?.resposta
          ) && (
            <Text style={styles.emptyText}>
              Nenhuma resposta positiva registrada.
            </Text>
          )}
        </View>
 
        {/* BOTÃO EDITAR */}
 
        <TouchableOpacity
          style={styles.editButton}
          onPress={() =>
            router.push({
                 pathname: '/EditarPerfili' as any,
                 params: { idosoId:
                           String(paciente.id) },
            })
          }
        >
          <Edit size={21} color="#FFFFFF" />
 
          <Text style={styles.editText}>
            Editar perfil
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
 
// ========================================================
// ESTILOS
// ========================================================
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#d7b5eb',
  },
 
  centerContainer: {
    flex: 1,
    backgroundColor: '#d7b5eb',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 25,
  },
 
  loadingText: {
    color: '#421E61',
    marginTop: 12,
    fontSize: 16,
  },
 
  emptyTitle: {
    color: '#240046',
    fontSize: 21,
    fontWeight: 'bold',
    marginTop: 15,
    textAlign: 'center',
  },
 
  emptyDescription: {
    color: '#5E4770',
    fontSize: 15,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 20,
    lineHeight: 22,
  },
 
  scrollContainer: {
    paddingBottom: 40,
  },
 
  header: {
    backgroundColor: '#7B2CBF',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
 
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
 
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 21,
    fontWeight: 'bold',
  },
 
  headerSpace: {
    width: 40,
  },
 
  profileContainer: {
    alignItems: 'center',
    paddingVertical: 25,
  },
 
  photoContainer: {
    width: 115,
    height: 115,
    borderRadius: 60,
    backgroundColor: '#E0AAFF',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 4,
    borderColor: '#FFFFFF',
  },
 
  photo: {
    width: '100%',
    height: '100%',
  },
 
  name: {
    marginTop: 12,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#240046',
    textAlign: 'center',
    marginHorizontal: 20,
  },
 
  age: {
    marginTop: 4,
    fontSize: 16,
    color: '#5E4770',
  },
 
  card: {
    backgroundColor: '#F5EDFF',
    marginHorizontal: 20,
    marginBottom: 15,
    borderRadius: 18,
    padding: 18,
  },
 
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
 
  sectionTitle: {
    color: '#240046',
    fontSize: 18,
    fontWeight: 'bold',
    flexShrink: 1,
  },
 
  description: {
    color: '#6B5A75',
    fontSize: 13,
    marginTop: 7,
    marginBottom: 15,
    lineHeight: 19,
  },
 
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginTop: 18,
  },
 
  infoTextContainer: {
    flex: 1,
  },
 
  label: {
    color: '#777777',
    fontSize: 13,
  },
 
  value: {
    color: '#240046',
    fontSize: 16,
    fontWeight: '500',
    marginTop: 2,
  },
 
  answerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
 
  answerContent: {
    flex: 1,
  },
 
  check: {
    width: 22,
    height: 22,
    borderRadius: 5,
    backgroundColor: '#7B2CBF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
 
  checkText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
 
  answerText: {
    flex: 1,
    color: '#240046',
    fontSize: 14,
    lineHeight: 20,
  },
 
  detailsText: {
    color: '#6B5A75',
    fontSize: 13,
    lineHeight: 19,
    marginTop: 5,
  },
 
  emptyText: {
    color: '#6B5A75',
    fontSize: 14,
    lineHeight: 20,
    fontStyle: 'italic',
  },
 
  editButton: {
    marginHorizontal: 20,
    marginTop: 5,
    height: 52,
    borderRadius: 15,
    backgroundColor: '#421E61',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
 
  editText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});