import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { Camera } from 'lucide-react-native';
import { useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
 
import { salvarCadastroIdoso } from '../database/database/database.js';
 
// Tipos das respostas dos questionários
type RespostaSaude = {
  id: string;
  resposta: boolean;
};
 
type RespostaHistoricoFamiliar = {
  id: string;
  resposta: boolean;
  detalhes: string;
};
 
// Tipo dos dados enviados para o banco
type DadosCadastroIdoso = {
  nome: string;
  idade: number;
  genero: 'masculino' | 'feminino';
  foto: string | null;
  respostasSaude: RespostaSaude[];
  historicoFamiliar: RespostaHistoricoFamiliar[];
};
 
// Informa ao TypeScript os tipos aceitos pela função do banco JavaScript
 
export default function ElderlyRegistrationScreen() {
  const router = useRouter();
 
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] =
    useState<'masculino' | 'feminino'>('masculino');
 
  const [answers, setAnswers] = useState<
    Record<string, boolean>
  >({});
 
  const [familyDetails, setFamilyDetails] = useState<
    Record<string, string>
  >({});
 
  const [image, setImage] = useState<string | null>(null);
 
  // Tirar foto com a câmera
  const takePhoto = async () => {
    try {
      const permission =
        await ImagePicker.requestCameraPermissionsAsync();
 
      if (!permission.granted) {
        Alert.alert(
          'Permissão necessária',
          'Precisamos de acesso à câmera para tirar a foto.'
        );
        return;
      }
 
      const result =
        await ImagePicker.launchCameraAsync({
          mediaTypes: ['images'],
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        });
 
      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Erro ao abrir a câmera:', error);
 
      Alert.alert(
        'Erro',
        'Não foi possível abrir a câmera.'
      );
    }
  };
 
  // Selecionar foto da galeria
  const pickImage = async () => {
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
 
      if (!permission.granted) {
        Alert.alert(
          'Permissão necessária',
          'Precisamos de acesso à galeria para escolher uma foto.'
        );
        return;
      }
 
      const result =
        await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['images'],
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        });
 
      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Erro ao abrir a galeria:', error);
 
      Alert.alert(
        'Erro',
        'Não foi possível abrir a galeria.'
      );
    }
  };
 
  // Escolher entre câmera e galeria
  const selectImage = () => {
    Alert.alert(
      'Foto do idoso',
      'Escolha uma opção',
      [
        {
          text: 'Câmera',
          onPress: () => {
            void takePhoto();
          },
        },
        {
          text: 'Galeria',
          onPress: () => {
            void pickImage();
          },
        },
        {
          text: 'Cancelar',
          style: 'cancel',
        },
      ]
    );
  };
 
  // Marcar ou desmarcar uma pergunta
  const handleAnswerChange = (question: string) => {
    setAnswers((prev) => ({
      ...prev,
      [question]: !prev[question],
    }));
  };
 
  // Registrar detalhes do histórico familiar
  const handleFamilyDetailChange = (
    question: string,
    value: string
  ) => {
    setFamilyDetails((prev) => ({
      ...prev,
      [question]: value,
    }));
  };
 
  // Questionário de saúde
  const questions = [
    {
      id: 'q1',
      text: 'Já teve um lado do corpo paralisado e depois melhorou.',
    },
    {
      id: 'q2',
      text: 'Já teve perda súbita da visão e depois melhorou.',
    },
    {
      id: 'q3',
      text: 'Perdeu muito peso nos últimos 6 meses.',
    },
    {
      id: 'q4',
      text: 'Ganhou muito peso nos últimos 6 meses.',
    },
    {
      id: 'q5',
      text: 'Pensou em cometer suicídio.',
    },
    {
      id: 'q6',
      text: 'Já teve ataques de pânico.',
    },
    {
      id: 'q7',
      text: 'Está andando mais devagar nos últimos 2 anos.',
    },
    {
      id: 'q8',
      text: 'A letra do idoso ficou menor ou mais trêmula nos últimos 2 anos.',
    },
    {
      id: 'q9',
      text: 'Sua expressão facial mudou nos últimos 2 anos.',
    },
    {
      id: 'q10',
      text: 'Tem algum problema de memória.',
    },
    {
      id: 'q11',
      text: 'Já sofreu algum abuso sexual ou agressão física.',
    },
    {
      id: 'q12',
      text: 'Um médico já lhe disse que sofreu um ataque cardíaco ou infarto.',
    },
    {
      id: 'q13',
      text: 'Um médico já lhe disse que tem pressão alta ou hipertensão.',
    },
    {
      id: 'q14',
      text: 'Um médico já lhe disse que sofreu um derrame, AVC ou isquemia.',
    },
    {
      id: 'q15',
      text: 'Já sofreu uma pancada no cérebro que o fez desmaiar.',
    },
    {
      id: 'q16',
      text: 'Já teve convulsões ou epilepsia.',
    },
    {
      id: 'q17',
      text: 'Já fumou.',
    },
    {
      id: 'q18',
      text: 'Já bebeu bebidas alcoólicas regularmente.',
    },
    {
      id: 'q19',
      text: 'Já achou que bebia demais.',
    },
    {
      id: 'q20',
      text: 'A bebida já ocasionou algum problema com perda de emprego, relacionamento ou ao dirigir.',
    },
    {
      id: 'q21',
      text: 'Já tomou medicamentos dos quais não conseguiu ficar sem, como para dormir ou lidar com situações difíceis.',
    },
    {
      id: 'q22',
      text: 'O consideram uma pessoa nervosa.',
    },
    {
      id: 'q23',
      text: 'Teve uma doença emocional ou nervosa que necessitou de tratamento.',
    },
    {
      id: 'q24',
      text: 'Teve um sério problema de saúde logo após ter tomado um novo remédio via oral ou injetável.',
    },
    {
      id: 'q25',
      text: 'Perdeu a consciência.',
    },
    {
      id: 'q26',
      text: 'Ficou muito confuso.',
    },
    {
      id: 'q27',
      text: 'Teve febre.',
    },
    {
      id: 'q28',
      text: 'Foi internado no hospital.',
    },
  ];
 
  // Questionário de histórico familiar
  const familyQuestions = [
    {
      id: 'fq1',
      text: 'Familiar teve que ser internado por não conseguir cuidar de si mesmo devido a confusão mental ou problemas de memória.',
    },
    {
      id: 'fq2',
      text: 'Familiar sofreu ataque cardíaco ou teve morte súbita.',
    },
    {
      id: 'fq3',
      text: 'Familiar sofreu um derrame, fraqueza ou dificuldade na fala súbita.',
    },
    {
      id: 'fq4',
      text: 'Familiar teve pressão alta.',
    },
    {
      id: 'fq5',
      text: 'Familiar teve diabetes.',
    },
    {
      id: 'fq6',
      text: 'Familiar teve doença de Parkinson.',
    },
    {
      id: 'fq7',
      text: 'Familiar teve filho portador de doenças mentais ou síndrome de Down.',
    },
    {
      id: 'fq8',
      text: 'Familiar teve leucemia.',
    },
    {
      id: 'fq9',
      text: 'Familiar teve câncer.',
    },
    {
      id: 'fq10',
      text: 'Familiar necessitou de tratamento para doença emocional ou nervosa.',
    },
  ];
 
  // Salvar o cadastro
  const handleSubmit = () => {
    // Validar nome
    if (!name.trim()) {
      Alert.alert(
        'Atenção',
        'Digite o nome completo do idoso.'
      );
      return;
    }
 
    // Validar idade
    if (
      !age.trim() ||
      !Number.isInteger(Number(age)) ||
      Number(age) <= 0
    ) {
      Alert.alert(
        'Atenção',
        'Digite uma idade válida.'
      );
      return;
    }
 
    try {
      // Preparar respostas de saúde
      const respostasSaude = questions.map((q) => ({
        id: String(q.id),
        resposta: Boolean(answers[q.id] ?? false),
      }));
 
      const historicoFamiliar = familyQuestions.map((q) => ({
        id: String(q.id),
        resposta: Boolean(answers[q.id] ?? false),
        detalhes: familyDetails[q.id] ?? '',
      }));
      // Salvar no banco de dados
      
      const idosoId = salvarCadastroIdoso({
        nome: name.trim(),
       idade: Number(age),
        genero: gender,
        foto: image,
        respostasSaude: respostasSaude,
        historicoFamiliar: historicoFamiliar,
});
 
      if (!idosoId) {
        throw new Error(
          'O cadastro não retornou um ID válido.'
        );
      }
 
      // Confirmar cadastro e abrir o perfil
      Alert.alert(
        'Cadastro realizado!',
        'Os dados do paciente foram salvos com sucesso.',
        [
          {
             text: 'Continuar',
      onPress: () => {
        router.replace({
          pathname:'/Acompanhamento',
          params: {
            idosoId: String(idosoId),
                },
              });
            },
          },
        ],
        { cancelable: false }
      );
    } catch (error) {
      console.error(
        'Erro ao salvar o cadastro do paciente:',
        error
      );
 
      Alert.alert(
        'Erro',
        error instanceof Error
          ? error.message
          : 'Não foi possível salvar o cadastro. Verifique o banco de dados e tente novamente.'
      );
    }
  };
 
  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          <Text style={styles.title}>
            Cadastro do Idoso
          </Text>
 
          {/* Foto do idoso */}
          <TouchableOpacity
            style={styles.cameraContainer}
            onPress={selectImage}
            activeOpacity={0.8}
          >
            {image ? (
              <Image
                source={{ uri: image }}
                style={styles.profileImage}
              />
            ) : (
              <Camera
                size={40}
                color="#7B2CBF"
              />
            )}
          </TouchableOpacity>
 
          <Text style={styles.photoHint}>
            Toque para adicionar uma foto
          </Text>
 
          {/* Nome */}
          <TextInput
            style={styles.input}
            placeholder="Nome completo"
            placeholderTextColor="#777"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            maxLength={150}
          />
 
          {/* Idade */}
          <TextInput
            style={styles.input}
            placeholder="Idade"
            placeholderTextColor="#777"
            keyboardType="number-pad"
            value={age}
            onChangeText={setAge}
            maxLength={3}
          />
 
          {/* Gênero */}
          <Text style={styles.fieldLabel}>
            Gênero
          </Text>
 
          <View style={styles.genderContainer}>
            <TouchableOpacity
              style={[
                styles.genderButton,
                gender === 'masculino' &&
                  styles.genderButtonSelected,
              ]}
              onPress={() => setGender('masculino')}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.genderText,
                  gender === 'masculino' &&
                    styles.genderTextSelected,
                ]}
              >
                Masculino
              </Text>
            </TouchableOpacity>
 
            <TouchableOpacity
              style={[
                styles.genderButton,
                gender === 'feminino' &&
                  styles.genderButtonSelected,
              ]}
              onPress={() => setGender('feminino')}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.genderText,
                  gender === 'feminino' &&
                    styles.genderTextSelected,
                ]}
              >
                Feminino
              </Text>
            </TouchableOpacity>
          </View>
 
          {/* Questionários */}
          <View style={styles.questionnaire}>
            <Text style={styles.sectionTitle}>
              Questionário de Saúde
            </Text>
 
            <Text style={styles.sectionDescription}>
              Marque as situações que se aplicam ao idoso.
            </Text>
 
            {questions.map((q) => (
              <TouchableOpacity
                key={q.id}
                style={styles.questionRow}
                onPress={() => handleAnswerChange(q.id)}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.checkbox,
                    answers[q.id] &&
                      styles.checkboxSelected,
                  ]}
                >
                  {answers[q.id] && (
                    <Text style={styles.check}>
                      ✓
                    </Text>
                  )}
                </View>
 
                <Text style={styles.questionText}>
                  {q.text}
                </Text>
              </TouchableOpacity>
            ))}
 
            <Text style={styles.sectionTitleFamily}>
              Histórico Familiar
            </Text>
 
            <Text style={styles.sectionDescription}>
              Marque as condições presentes na família e
              informe os detalhes, quando necessário.
            </Text>
 
            {familyQuestions.map((q) => (
              <View key={q.id}>
                <TouchableOpacity
                  style={styles.questionRow}
                  onPress={() => handleAnswerChange(q.id)}
                  activeOpacity={0.7}
                >
                  <View
                    style={[
                      styles.checkbox,
                      answers[q.id] &&
                        styles.checkboxSelected,
                    ]}
                  >
                    {answers[q.id] && (
                      <Text style={styles.check}>
                        ✓
                      </Text>
                    )}
                  </View>
 
                  <Text style={styles.questionText}>
                    {q.text}
                  </Text>
                </TouchableOpacity>
 
                {answers[q.id] && (
                  <TextInput
                    style={styles.familyInput}
                    placeholder="Qual familiar ou quais detalhes?"
                    placeholderTextColor="#777"
                    value={familyDetails[q.id] ?? ''}
                    onChangeText={(value) =>
                      handleFamilyDetailChange(q.id, value)
                    }
                    maxLength={500}
                  />
                )}
              </View>
            ))}
          </View>
 
          {/* Botão salvar */}
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSubmit}
            activeOpacity={0.8}
          >
            <Text style={styles.saveText}>
              Salvar cadastro
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#d7b5eb',
  },
 
  scrollContainer: {
    paddingVertical: 32,
    paddingHorizontal: 20,
  },
 
  card: {
    width: '100%',
    backgroundColor: '#7b2cbf',
    borderRadius: 20,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 5,
    shadowOffset: {
      width: 0,
      height: 3,
    },
  },
 
  title: {
    textAlign: 'center',
    marginBottom: 25,
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
 
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
 
  cameraContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E0AAFF',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    overflow: 'hidden',
  },
 
  photoHint: {
    color: '#FFFFFF',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 20,
  },
 
  input: {
    width: '100%',
    minHeight: 50,
    backgroundColor: '#F5EDFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 15,
    color: '#240046',
    fontSize: 16,
  },
 
  fieldLabel: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
 
  genderContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
 
  genderButton: {
    flex: 1,
    minHeight: 45,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#421e61',
    backgroundColor: '#F5EDFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
 
  genderButtonSelected: {
    backgroundColor: '#421e61',
  },
 
  genderText: {
    color: '#240046',
    fontSize: 15,
    fontWeight: '500',
  },
 
  genderTextSelected: {
    color: '#FFFFFF',
  },
 
  questionnaire: {
    backgroundColor: '#F5EDFF',
    borderRadius: 12,
    padding: 12,
    marginTop: 5,
  },
 
  sectionTitle: {
    color: '#240046',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
 
  sectionTitleFamily: {
    color: '#240046',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 25,
    marginBottom: 8,
  },
 
  sectionDescription: {
    color: '#5B3975',
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 12,
  },
 
  questionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 8,
  },
 
  checkbox: {
    width: 21,
    height: 21,
    borderWidth: 2,
    borderColor: '#7B2CBF',
    borderRadius: 5,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
 
  checkboxSelected: {
    backgroundColor: '#7B2CBF',
  },
 
  check: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
 
  questionText: {
    flex: 1,
    color: '#240046',
    fontSize: 14,
    lineHeight: 20,
  },
 
  familyInput: {
    backgroundColor: '#FFFFFF',
    color: '#240046',
    borderRadius: 8,
    minHeight: 42,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginLeft: 31,
    marginBottom: 8,
    fontSize: 13,
  },
 
  saveButton: {
    width: '80%',
    minHeight: 48,
    borderRadius: 16,
    backgroundColor: '#421e61',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 25,
    paddingHorizontal: 16,
  },
 
  saveText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
 