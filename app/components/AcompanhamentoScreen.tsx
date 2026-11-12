
import {
  AudioModule,
  RecordingPresets,
  setAudioModeAsync,
  useAudioRecorder,
} from 'expo-audio';

import { useLocalSearchParams, useRouter } from 'expo-router';
import { Mic } from 'lucide-react-native';
import React, { useState } from 'react';

import {
  Alert, ScrollView, StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { salvarRegistroDiario } from '../database/database/database.js';
import {
  classificarTranscricao, type Classificacao,
} from '../services/classificartrascricao';
import { transcreverAudio } from '../services/transcricaoService';


type Afirmativa = {
  questao: number;
  texto: string;
  tipo: 'positiva' | 'negativa';
};

type SecaoAfirmativas = {
  titulo: string;
  afirmativas: Afirmativa[];
};

const secoesAfirmativas: SecaoAfirmativas[] = [
  {
    titulo: 'Identificação',
    afirmativas: [
      { questao: 14, texto: 'Lembrou do seu nome.', tipo: 'positiva' },
      { questao: 14, texto: 'Não lembra do seu nome.', tipo: 'negativa' },
      { questao: 15, texto: 'Lembrou de sua idade atual.', tipo: 'positiva' },
      { questao: 15, texto: 'Não lembra de sua idade atual.', tipo: 'negativa' },
      { questao: 16, texto: 'Lembrou sua data de nascimento.', tipo: 'positiva' },
      { questao: 16, texto: 'Não lembra de sua data de nascimento.', tipo: 'negativa' },
      {
        questao: 17,
        texto: 'Lembrou de informações sobre sua escolaridade.',
        tipo: 'positiva',
      },
      {
        questao: 17,
        texto: 'Esqueceu informações sobre sua escolaridade.',
        tipo: 'negativa',
      },
      { questao: 19, texto: 'Lembrou onde mora.', tipo: 'positiva' },
      { questao: 19, texto: 'Esqueceu onde mora.', tipo: 'negativa' },
    ],
  },

  {
    titulo: 'Função cerebrovascular',
    afirmativas: [
      { questao: 20, texto: 'Sentiu dores de cabeça.', tipo: 'negativa' },
      { questao: 21, texto: 'Sentiu tonturas.', tipo: 'negativa' },
      { questao: 22, texto: 'Caiu.', tipo: 'negativa' },
      { questao: 22, texto: 'Quase caiu.', tipo: 'negativa' },
      {
        questao: 24,
        texto: 'Teve dificuldade em pegar no sono.',
        tipo: 'negativa',
      },
      {
        questao: 25,
        texto: 'Ficou inquieto durante a noite.',
        tipo: 'negativa',
      },
      {
        questao: 26,
        texto: 'Acordou mais cedo que o habitual e não conseguiu voltar a dormir.',
        tipo: 'negativa',
      },
      {
        questao: 26,
        texto: 'Dormiu mais do que o habitual.',
        tipo: 'negativa',
      },
    ],
  },

  {
    titulo: 'Humor deprimido',
    afirmativas: [
      { questao: 27, texto: 'Teve perda do apetite.', tipo: 'negativa' },
      { questao: 27, texto: 'Teve ganho de apetite.', tipo: 'negativa' },
      {
        questao: 29,
        texto: 'Sentiu-se confiante para realizar tarefas diárias.',
        tipo: 'positiva',
      },
      {
        questao: 29,
        texto: 'Não se sentiu confiante para realizar tarefas diárias.',
        tipo: 'negativa',
      },
      {
        questao: 30,
        texto: 'Não teve dificuldade para tomar decisões ou fazer escolhas.',
        tipo: 'positiva',
      },
      {
        questao: 30,
        texto: 'Teve dificuldade para tomar decisões ou fazer escolhas.',
        tipo: 'negativa',
      },
      {
        questao: 31,
        texto: 'Realizou algo de que gosta normalmente.',
        tipo: 'positiva',
      },
      {
        questao: 31,
        texto: 'Não teve interesse em atividades de que gosta normalmente.',
        tipo: 'negativa',
      },
      {
        questao: 32,
        texto: 'Teve disposição para realizar suas tarefas.',
        tipo: 'positiva',
      },
      {
        questao: 32,
        texto: 'Perdeu a disposição para realizar suas tarefas.',
        tipo: 'negativa',
      },
      {
        questao: 33,
        texto: 'Procurou socializar com outras pessoas.',
        tipo: 'positiva',
      },
      {
        questao: 33,
        texto: 'Preferiu ficar sozinho em vez de procurar companhia.',
        tipo: 'negativa',
      },
      {
        questao: 34,
        texto: 'Concentrou-se com facilidade em entretenimento ou conversa.',
        tipo: 'positiva',
      },
      {
        questao: 34,
        texto: 'Teve dificuldade para se concentrar em entretenimento ou conversa.',
        tipo: 'negativa',
      },
      {
        questao: 35,
        texto: 'Está falando mais devagar que o comum.',
        tipo: 'negativa',
      },
      {
        questao: 36,
        texto: 'Está pensando mais rápido que o comum.',
        tipo: 'positiva',
      },
      {
        questao: 36,
        texto: 'Está pensando mais devagar que o comum.',
        tipo: 'negativa',
      },
      {
        questao: 37,
        texto: 'Sentiu-se muito mais alegre.',
        tipo: 'positiva',
      },
      {
        questao: 37,
        texto: 'Sentiu-se muito triste, deprimido ou infeliz.',
        tipo: 'negativa',
      },
      {
        questao: 46,
        texto: 'Teve uma reação otimista ao pensar em seu futuro.',
        tipo: 'positiva',
      },
      {
        questao: 46,
        texto: 'Teve uma reação pessimista ao pensar em seu futuro.',
        tipo: 'negativa',
      },
      {
        questao: 47,
        texto: 'Falou que não vale a pena viver.',
        tipo: 'negativa',
      },
      {
        questao: 48,
        texto: 'Falou em se suicidar.',
        tipo: 'negativa',
      },
      {
        questao: 49,
        texto: 'Sentiu-se mais leve com as situações habituais.',
        tipo: 'positiva',
      },
      {
        questao: 49,
        texto: 'Sentiu-se mais tenso com as situações habituais.',
        tipo: 'negativa',
      },
      {
        questao: 50,
        texto: 'Está menos irritado.',
        tipo: 'positiva',
      },
      {
        questao: 50,
        texto: 'Está mais irritado.',
        tipo: 'negativa',
      },
      {
        questao: 51,
        texto: 'Está menos ansioso.',
        tipo: 'positiva',
      },
      {
        questao: 51,
        texto: 'Está mais ansioso.',
        tipo: 'negativa',
      },
      {
        questao: 54,
        texto: 'Teve um ataque de pânico.',
        tipo: 'negativa',
      },
    ],
  },

  {
    titulo: 'Atividades diárias',
    afirmativas: [
      {
        questao: 60,
        texto: 'Teve dificuldade para fazer contas fáceis.',
        tipo: 'negativa',
      },
      {
        questao: 61,
        texto: 'Teve dificuldade para realizar uma tarefa doméstica cotidiana.',
        tipo: 'negativa',
      },
      {
        questao: 63,
        texto: 'Teve dificuldade para controlar a urina.',
        tipo: 'negativa',
      },
    ],
  },

  {
    titulo: 'Memória',
    afirmativas: [
      {
        questao: 65,
        texto: 'Lembrou onde deixou algo.',
        tipo: 'positiva',
      },
      {
        questao: 65,
        texto: 'Teve dificuldade de lembrar onde deixou algo.',
        tipo: 'negativa',
      },
      {
        questao: 66,
        texto: 'Lembrou o nome de amigos ou familiares.',
        tipo: 'positiva',
      },
      {
        questao: 66,
        texto: 'Esqueceu o nome de amigos ou familiares.',
        tipo: 'negativa',
      },
      {
        questao: 67,
        texto: 'Se perdeu em sua própria vizinhança.',
        tipo: 'negativa',
      },
    ],
  },

  {
    titulo: 'Funcionamento mental global',
    afirmativas: [
      {
        questao: 71,
        texto: 'Falou sobre eventos recentes.',
        tipo: 'positiva',
      },
      {
        questao: 71,
        texto: 'Falou muito sobre o passado.',
        tipo: 'negativa',
      },
      {
        questao: 72,
        texto: 'Teve dificuldade para encontrar a palavra desejada ou disse a palavra errada.',
        tipo: 'negativa',
      },
    ],
  },

  {
    titulo: 'Paranoias e outras características psiquiátricas',
    afirmativas: [
      { questao: 74, texto: 'Escutou vozes.', tipo: 'negativa' },
      {
        questao: 76,
        texto: 'Viu coisas que outras pessoas não viram.',
        tipo: 'negativa',
      },
      {
        questao: 80,
        texto: 'Sentiu que alguém estava observando, espionando ou tramando contra ele.',
        tipo: 'negativa',
      },
      {
        questao: 82,
        texto: 'Acreditou que estavam sendo enviadas mensagens especiais pela TV, rádio, celular ou outros meios.',
        tipo: 'negativa',
      },
      {
        questao: 82,
        texto: 'Acreditou que seu corpo estava sendo controlado.',
        tipo: 'negativa',
      },
      {
        questao: 84,
        texto: 'Teve uma sensação estranha em seu corpo.',
        tipo: 'negativa',
      },
    ],
  },
];

// ==================================================
// TELA PRINCIPAL
// ==================================================

export default function DailyRecordScreen() {
  const router = useRouter();
  const { elderlyId } = useLocalSearchParams();

  // ------------------------------------------------
  // CALENDÁRIO
  // ------------------------------------------------

  const [selectedDate, setSelectedDate] = useState(new Date());

  const [completedDates, setCompletedDates] = useState<Date[]>([
    new Date(2026, 4, 1),
    new Date(2026, 4, 5),
    new Date(2026, 4, 10),
  ]);

  // ------------------------------------------------
  // ÁUDIO
  // ------------------------------------------------

  const [gravando, setGravando] = useState(false);
  const [audioUri, setAudioUri] = useState<string | null>(null);

  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);

  async function iniciarGravacao() {
    try {
      const status =
        await AudioModule.requestRecordingPermissionsAsync();

      if (!status.granted) {
        Alert.alert(
          'Permissão necessária',
          'Precisamos da permissão para usar o microfone.',
        );
        return;
      }

      await setAudioModeAsync({
        allowsRecording: true,
        playsInSilentMode: true,
      });

      await recorder.prepareToRecordAsync();
      recorder.record();

      setGravando(true);
    } catch (error) {
      console.error('Erro ao iniciar gravação:', error);

      Alert.alert(
        'Erro',
        'Não foi possível iniciar a gravação.',
      );
    }
  }

  async function pararGravacao() {
    try {
      await recorder.stop();
      setGravando(false);

      if (recorder.uri) {
        setAudioUri(recorder.uri);

        Alert.alert(
          'Gravação concluída',
          'O áudio foi gravado com sucesso no dispositivo.',
        );
      }
    } catch (error) {
      console.error('Erro ao parar gravação:', error);

      setGravando(false);

      Alert.alert(
        'Erro',
       'Não foi possível finalizar a gravação.',
      );
    }
   if (audioUri) {
  await processarAudio(audioUri);
}
  }

 const [transcricao, setTranscricao] = useState('');
const [classificacoes, setClassificacoes] = useState<Classificacao[]>([]);
const [transcrevendo, setTranscrevendo] = useState(false);
  
   async function processarAudio(audioUri: string) {
  try {
    setTranscrevendo(true);

    const texto = await transcreverAudio(audioUri);

    setTranscricao(texto);
    setClassificacoes(classificarTranscricao(texto));
  } catch (erro) {
    Alert.alert(
      'Erro',
      'Não foi possível transcrever o áudio. Tente novamente.'
    );
  } finally {
    setTranscrevendo(false);
  }
}

  const [moodScale, setMoodScale] = useState(3);


  // ------------------------------------------------
  // RESPOSTAS DAS AFIRMATIVAS
  // ------------------------------------------------

  const [respostas, setRespostas] = useState<
    Record<string, boolean>
  >({});

  function alternarAfirmativa(id: string) {
    setRespostas((anterior) => ({
      ...anterior,
      [id]: !anterior[id],
    }));
  }

  // ------------------------------------------------
  // FUNÇÕES DO CALENDÁRIO
  // ------------------------------------------------

  function getDaysInMonth(date: Date) {
    const year = date.getFullYear();
    const month = date.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    return {
      daysInMonth: lastDay.getDate(),
      startingDayOfWeek: firstDay.getDay(),
      year,
      month,
    };
  }

  function isDateCompleted(date: Date) {
    return completedDates.some(
      (d) =>
        d.getDate() === date.getDate() &&
        d.getMonth() === date.getMonth() &&
        d.getFullYear() === date.getFullYear(),
    );
  }

  function isSameDate(date1: Date, date2: Date) {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  }

  function changeMonth(amount: number) {
    const newDate = new Date(selectedDate);

    newDate.setDate(1);
    newDate.setMonth(newDate.getMonth() + amount);

    setSelectedDate(newDate);
  }

  // ------------------------------------------------
  // SALVAR REGISTRO
  // ------------------------------------------------

  function handleSubmit() {
    const dataRegistro = {
      idosoId: elderlyId,
      data: selectedDate.toISOString().slice(0, 10),
      audioUri,
      importancia: moodScale,
      respostas,
    };
    const handleSubmit = () => {
  try {
    if (!elderlyId) {
      Alert.alert(
        'Atenção',
        'Não foi possível identificar o paciente.'
      );
      return;
    }

    salvarRegistroDiario({
      idosoId: Number(elderlyId),
      data: selectedDate.toISOString().slice(0, 10),
      importancia: moodScale,
      audio: audioUri ?? null,
      respostas,
    });

    Alert.alert(
      'Sucesso',
      'Registro diário salvo com sucesso!'
    );

    router.push('/Historico');
  } catch (error) {
    console.error('Erro ao salvar registro:', error);

    Alert.alert(
      'Erro',
      'Não foi possível salvar o registro diário.'
    );
  }
};
    console.log('Registro diário:', dataRegistro);

    setCompletedDates((anteriores) => {
      if (anteriores.some((data) => isSameDate(data, selectedDate))) {
        return anteriores;
      }

      return [...anteriores, new Date(selectedDate)];
    });

    Alert.alert(
      'Registro preparado',
      'As respostas foram organizadas. Para manter o registro no histórico após fechar a tela, é necessário salvá-lo no banco SQLite.',
      [
        {
          text: 'OK',
          onPress: () => router.push('/Historico'),
        },
      ],
    );
  }

  // ------------------------------------------------
  // MONTAGEM DO CALENDÁRIO
  // ------------------------------------------------

  const {
    daysInMonth,
    startingDayOfWeek,
    year,
    month,
  } = getDaysInMonth(selectedDate);

  const calendarDays: React.ReactNode[] = [];

  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(
      <View key={`empty-${i}`} style={styles.emptyDay} />,
    );
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const currentDate = new Date(year, month, day);
    const isCompleted = isDateCompleted(currentDate);
    const isSelected = isSameDate(currentDate, selectedDate);

    calendarDays.push(
      <TouchableOpacity
        key={day}
        onPress={() => setSelectedDate(currentDate)}
        style={[
          styles.calendarDay,
          isCompleted && styles.completedDay,
          isSelected && !isCompleted && styles.selectedDay,
        ]}
      >
        <Text
          style={[
            styles.calendarDayText,
            isCompleted && styles.completedDayText,
          ]}
        >
          {day}
        </Text>
      </TouchableOpacity>,
    );
  }

  // ------------------------------------------------
  // INTERFACE
  // ------------------------------------------------

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Registro Diário</Text>

        <Text style={styles.dateDescription}>
          Data selecionada:{' '}
          {selectedDate.toLocaleDateString('pt-BR')}
        </Text>

        {/* CALENDÁRIO */}

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Calendário</Text>

          <View style={styles.monthHeader}>
            <TouchableOpacity
              onPress={() => changeMonth(-1)}
              style={styles.monthButton}
            >
              <Text style={styles.monthButtonText}>‹</Text>
            </TouchableOpacity>

            <Text style={styles.monthTitle}>
              {selectedDate.toLocaleDateString('pt-BR', {
                month: 'long',
                year: 'numeric',
              })}
            </Text>

            <TouchableOpacity
              onPress={() => changeMonth(1)}
              style={styles.monthButton}
            >
              <Text style={styles.monthButtonText}>›</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.calendarContainer}>
            <View style={styles.weekHeader}>
              {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(
                (dia) => (
                  <Text key={dia} style={styles.weekDay}>
                    {dia}
                  </Text>
                ),
              )}
            </View>

            <View style={styles.calendarGrid}>
              {calendarDays}
            </View>
          </View>

          <View style={styles.legend}>
            <View style={styles.legendItem}>
              <View style={styles.legendCompleted} />
              <Text style={styles.legendText}>Registro preparado</Text>
            </View>

            <View style={styles.legendItem}>
              <View style={styles.legendSelected} />
              <Text style={styles.legendText}>Data selecionada</Text>
            </View>
          </View>
        </View>

        {/* NOTA DE VOZ */}

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Nota de voz</Text>

          <Text style={styles.description}>
            Registre por áudio acontecimentos importantes do dia.
          </Text>

          <TouchableOpacity
            style={[
              styles.audioButton,
              gravando && styles.audioButtonRecording,
            ]}
            onPress={gravando ? pararGravacao : iniciarGravacao}
          >
            <Mic size={28} color="#7B2CBF" />

            <Text style={styles.audioText}>
              {gravando ? 'Parar gravação' : 'Gravar áudio'}
            </Text>
          </TouchableOpacity>

          {gravando && (
            <Text style={styles.recordingText}>
              ● Gravando áudio...
            </Text>
          )}

          {audioUri && !gravando && (
            <Text style={styles.audioSaved}>
              ✓ Áudio gravado nesta sessão
            </Text>
          )}
        </View>

        {/* IMPORTÂNCIA */}

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>
            Nível de importância da mensagem
          </Text>

          <Text style={styles.description}>
            Selecione um nível de 1 a 5.
          </Text>

          <View style={styles.scaleContainer}>
            {[1, 2, 3, 4, 5].map((value) => (
              <TouchableOpacity
                key={value}
                onPress={() => setMoodScale(value)}
                style={[
                  styles.scaleButton,
                  moodScale === value && styles.scaleButtonSelected,
                ]}
              >
                <Text
                  style={[
                    styles.scaleText,
                    moodScale === value && styles.scaleTextSelected,
                  ]}
                >
                  {value}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* AFIRMATIVAS */}

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>
            Acompanhamento diário
          </Text>

          <Text style={styles.description}>
            Marque as afirmações que correspondem ao que foi observado
            no idoso na data selecionada.
          </Text>

          {secoesAfirmativas.map((secao, indiceSecao) => (
            <View key={secao.titulo}>
              <Text
                style={[
                  styles.categoryTitle,
                  indiceSecao > 0 && styles.categoryTitleSpaced,
                ]}
              >
                {secao.titulo}
              </Text>

              {secao.afirmativas.map((afirmativa, indice) => {
                const id =
                  `${secao.titulo}-${afirmativa.questao}-${indice}`;

                return (
                  <CheckItem
                    key={id}
                    checked={Boolean(respostas[id])}
                    onPress={() => alternarAfirmativa(id)}
                    text={afirmativa.texto}
                    tipo={afirmativa.tipo}
                    questao={afirmativa.questao}
                  />
                );
              })}
            </View>
          ))}
        </View>

        {/* BOTÃO SALVAR */}

        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSubmit}
          activeOpacity={0.8}
        >
          <Text style={styles.saveText}>
            Salvar Registro
          </Text>
        </TouchableOpacity>

        <Text style={styles.footerText}>
          Confira as informações antes de finalizar o registro.
        </Text>
      </ScrollView>
    </View>
  );
}

// ==================================================
// COMPONENTE DAS AFIRMATIVAS
// ==================================================

type CheckItemProps = {
  checked: boolean;
  onPress: () => void;
  text: string;
  tipo: 'positiva' | 'negativa';
  questao: number;
};

function CheckItem({
  checked,
  onPress,
  text,
  tipo,
  questao,
}: CheckItemProps) {
  return (
    <TouchableOpacity
      style={styles.checkItem}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View
        style={[
          styles.checkbox,
          checked && styles.checkboxChecked,
        ]}
      >
        {checked && (
          <Text style={styles.checkMark}>✓</Text>
        )}
      </View>

      <View style={styles.checkContent}>
        <Text style={styles.checkText}>{text}</Text>

        <View style={styles.metadataRow}>
          <Text
            style={[
              styles.typeTag,
              tipo === 'positiva'
                ? styles.positiveTag
                : styles.negativeTag,
            ]}
          >
            {tipo === 'positiva' ? 'Positiva' : 'Negativa'}
          </Text>

          <Text style={styles.questionNumber}>
            Questão {questao}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

// ==================================================
// ESTILOS
// ==================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#d7b5eb',
  },

  scrollContainer: {
    padding: 20,
    paddingBottom: 40,
  },

  title: {
    textAlign: 'center',
    fontSize: 32,
    fontWeight: 'bold',
    color: '#240046',
    marginTop: 10,
    marginBottom: 10,
  },

  dateDescription: {
    textAlign: 'center',
    color: '#421E61',
    fontSize: 14,
    marginBottom: 20,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 5,
    shadowOffset: {
      width: 0,
      height: 3,
    },
  },

  sectionTitle: {
    color: '#421E61',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },

  description: {
    color: '#5B4968',
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 15,
  },

  monthHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },

  monthTitle: {
    color: '#421E61',
    fontSize: 17,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },

  monthButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#E0AAFF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  monthButtonText: {
    fontSize: 28,
    color: '#421E61',
    marginTop: -3,
  },

  calendarContainer: {
    backgroundColor: '#F5EDFF',
    borderRadius: 15,
    padding: 12,
  },

  weekHeader: {
    flexDirection: 'row',
    marginBottom: 8,
  },

  weekDay: {
    width: '14.2857%',
    textAlign: 'center',
    color: '#421E61',
    fontSize: 12,
    fontWeight: 'bold',
  },

  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  calendarDay: {
    width: '14.2857%',
    height: 42,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },

  emptyDay: {
    width: '14.2857%',
    height: 42,
  },

  calendarDayText: {
    color: '#240046',
    fontSize: 14,
  },

  completedDay: {
    backgroundColor: '#7B2CBF',
  },

  completedDayText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },

  selectedDay: {
    backgroundColor: '#E0AAFF',
    borderWidth: 2,
    borderColor: '#7B2CBF',
  },

  legend: {
    marginTop: 14,
    gap: 8,
  },

  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  legendCompleted: {
    width: 12,
    height: 12,
    borderRadius: 3,
    backgroundColor: '#7B2CBF',
  },

  legendSelected: {
    width: 12,
    height: 12,
    borderRadius: 3,
    backgroundColor: '#E0AAFF',
    borderWidth: 1,
    borderColor: '#7B2CBF',
  },

  legendText: {
    color: '#5B4968',
    fontSize: 12,
  },

  audioButton: {
    backgroundColor: '#E0AAFF',
    borderRadius: 15,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },

  audioButtonRecording: {
    backgroundColor: '#BE83E0',
  },

  audioText: {
    color: '#240046',
    fontSize: 16,
    fontWeight: '600',
  },

  recordingText: {
    marginTop: 12,
    textAlign: 'center',
    color: '#7B2CBF',
    fontWeight: 'bold',
  },

  audioSaved: {
    marginTop: 12,
    textAlign: 'center',
    color: '#7B2CBF',
    fontWeight: 'bold',
  },

  scaleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },

  scaleButton: {
    width: 45,
    height: 45,
    borderRadius: 23,
    backgroundColor: '#E0AAFF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  scaleButtonSelected: {
    backgroundColor: '#7B2CBF',
  },

  scaleText: {
    color: '#240046',
    fontSize: 16,
  },

  scaleTextSelected: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },

  categoryTitle: {
    color: '#7B2CBF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#EADCF5',
  },

  categoryTitleSpaced: {
    marginTop: 22,
  },

  checkItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },

  checkbox: {
    width: 23,
    height: 23,
    borderWidth: 2,
    borderColor: '#7B2CBF',
    borderRadius: 5,
    marginRight: 11,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },

  checkboxChecked: {
    backgroundColor: '#7B2CBF',
  },

  checkMark: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },

  checkContent: {
    flex: 1,
  },

  checkText: {
    color: '#240046',
    fontSize: 14,
    lineHeight: 20,
  },

  metadataRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 6,
  },

  typeTag: {
    fontSize: 11,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    overflow: 'hidden',
  },

  positiveTag: {
    backgroundColor: '#EDE2FA',
    color: '#5B219A',
  },

  negativeTag: {
    backgroundColor: '#F3E7F8',
    color: '#7B2CBF',
  },

  questionNumber: {
    color: '#756680',
    fontSize: 11,
  },

  saveButton: {
    minHeight: 52,
    borderRadius: 18,
    backgroundColor: '#7B2CBF',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
    padding: 14,
  },

  saveText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },

  footerText: {
    textAlign: 'center',
    color: '#421E61',
    fontSize: 12,
    marginTop: 14,
    lineHeight: 18,
  },
});
