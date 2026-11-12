import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  BarChart3,
  Calendar,
  Home,
  Mic,
  Share2,
  UserRound
} from 'lucide-react-native';
import { useMemo, useState } from 'react';
import {
  Alert,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { buscarHistorico } from '../database/database/database.js';
 
const larguraTela = Dimensions.get('window').width;
 
type Classificacao = {
  secao: string;
  positivas: number;
  negativas: number;
};
 
type RegistroAudio = {
  id: number;
  data: string;
  descricao: string;
  audioUri?: string;
};
 
const carregarHistorico = (
  idosoId: number,
  dataInicial: string,
  dataFinal: string
) => {
 
const [registros, setRegistros] = useState<any[]>([]);
  try {
    const registros = buscarHistorico(
      idosoId,
      dataInicial,
      dataFinal
    );
 
    setRegistros(registros);
  } catch (error) {
    console.error('Erro ao buscar histórico:', error);
 
    Alert.alert(
      'Erro',
      'Não foi possível carregar o histórico.'
    );
  }
};

// EXEMPLO: substituir pelos dados reais salvos no SQLite.
const classificacoesExemplo: Classificacao[] = [
  {
    secao: 'Identificação',
    positivas: 4,
    negativas: 1,
  },
  {
    secao: 'Função cerebrovascular',
    positivas: 2,
    negativas: 3,
  },
  {
    secao: 'Humor deprimido',
    positivas: 3,
    negativas: 4,
  },
  {
    secao: 'Atividades diárias',
    positivas: 2,
    negativas: 2,
  },
  {
    secao: 'Memória',
    positivas: 2,
    negativas: 4,
  },
  {
    secao: 'Funcionamento mental global',
    positivas: 3,
    negativas: 2,
  },
  {
    secao: 'Paranoias e outras características psiquiátricas',
    positivas: 1,
    negativas: 3,
  },
];
 
// EXEMPLO: substituir pelos áudios reais do banco de dados.
const audiosExemplo: RegistroAudio[] = [
  {
    id: 1,
    data: '2026-10-14',
    descricao: 'Registro diário',
  },
  {
    id: 2,
    data: '2026-10-12',
    descricao: 'Observações do cuidador',
  },
];
 
const secoes = [
  'Identificação',
  'Função cerebrovascular',
  'Humor deprimido',
  'Atividades diárias',
  'Memória',
  'Funcionamento mental global',
  'Paranoias e outras características psiquiátricas',
];
 
export default function HistoricoScreen() {
  const router = useRouter();
  const { idosoId } = useLocalSearchParams<{
  idosoId?: string | string[];
}>();
 
  const [periodo, setPeriodo] = useState(7);
  const [dataInicial, setDataInicial] = useState('');
  const [dataFinal, setDataFinal] = useState('');
  const [usarIntervalo, setUsarIntervalo] = useState(false);
 
  // Enquanto o SQLite não estiver conectado, são usados exemplos.
  const classificacoes = classificacoesExemplo;
  const audios = audiosExemplo;
 
  const filtrarPorPeriodo = (data: string) => {
    const dataRegistro = new Date(`${data}T12:00:00`);
    const hoje = new Date();
    hoje.setHours(12, 0, 0, 0);
 
    if (usarIntervalo) {
      if (!dataInicial || !dataFinal) {
        return false;
      }
 
      const inicio = new Date(`${dataInicial}T00:00:00`);
      const fim = new Date(`${dataFinal}T23:59:59`);
 
      return dataRegistro >= inicio && dataRegistro <= fim;
    }
 
    const limite = new Date(hoje);
    limite.setDate(limite.getDate() - (periodo - 1));
 
    return dataRegistro >= limite && dataRegistro <= hoje;
  };
 
  const audiosFiltrados = useMemo(
    () => audios.filter((audio) => filtrarPorPeriodo(audio.data)),
    [audios, periodo, dataInicial, dataFinal, usarIntervalo],
  );
 
  const consultarIntervalo = () => {
    if (!dataInicial || !dataFinal) {
      Alert.alert(
        'Datas necessárias',
        'Informe a data inicial e a data final no formato AAAA-MM-DD.',
      );
      return;
    }
 
    if (new Date(dataInicial) > new Date(dataFinal)) {
      Alert.alert(
        'Período inválido',
        'A data inicial deve ser anterior à data final.',
      );
      return;
    }
 
    setUsarIntervalo(true);
  };
 
  const selecionarPeriodo = (dias: number) => {
    setPeriodo(dias);
    setUsarIntervalo(false);
  };
 
  const maximo = Math.max(
    5,
    ...classificacoes.map(
      (item) => Math.max(item.positivas, item.negativas),
    ),
  );
 
  const navegar = (rota: string) => {
    router.push(rota as any);
  };
  const voltarInicio = () => {
  router.replace('/Inicio' as any);
};

const abrirCompartilhamento = () => {
  const id = Array.isArray(idosoId)
    ? idosoId[0]
    : idosoId;

  if (!id || !Number.isInteger(Number(id))) {
    Alert.alert(
      'Atenção',
      'Não foi possível identificar o idoso para compartilhar as informações.'
    );
    return;
  }

  router.push({
    pathname: '/Compartilhar' as any,
    params: {
      idosoId: id,
    },
  });
};

const abrirPerfil = () => {
  const id = Array.isArray(idosoId)
    ? idosoId[0]
    : idosoId;

  if (!id || !Number.isInteger(Number(id))) {
    Alert.alert(
      'Atenção',
      'Não foi possível identificar o idoso. Volte ao início e selecione um idoso cadastrado.'
    );
    return;
  }

  router.push({
    pathname: '/Perfili',
    params: {
      idosoId: id,
    },
  });
};
  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.conteudo}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.cabecalho}>
        <Text style={styles.titulo}>Histórico</Text>

        <View style={styles.botoesCabecalho}>
         <TouchableOpacity
           style={styles.botaoTopo}
           onPress={abrirPerfil}
         >
          <UserRound color="#7b2cbf" size={22} />
        <Text style={styles.textoBotaoTopo}>Perfil</Text>
       </TouchableOpacity>
         <TouchableOpacity
    style={styles.botaoTopo}
    onPress={abrirCompartilhamento}
  >
    <Share2 color="#7b2cbf" size={22} />
    <Text style={styles.textoBotaoTopo}>Compartilhar</Text>
  </TouchableOpacity>


     </View>
    </View>
 
        <Text style={styles.subtitulo}>
          Acompanhe os registros e as classificações ao longo do tempo.
        </Text>
 
        {/* FILTRO DE PERÍODO */}
        <View style={styles.card}>
          <View style={styles.tituloCard}>
            <Calendar color="#7b2cbf" size={22} />
            <Text style={styles.tituloSecao}>
              Período do histórico
            </Text>
          </View>
 
          <Text style={styles.textoAjuda}>
            Selecione o intervalo que deseja consultar.
          </Text>
 
          <View style={styles.linhaPeriodos}>
            {[7, 30, 90].map((dias) => (
              <TouchableOpacity
                key={dias}
                style={[
                  styles.botaoPeriodo,
                  periodo === dias && !usarIntervalo
                    ? styles.botaoPeriodoAtivo
                    : null,
                ]}
                onPress={() => selecionarPeriodo(dias)}
              >
                <Text
                  style={[
                    styles.textoPeriodo,
                    periodo === dias && !usarIntervalo
                      ? styles.textoPeriodoAtivo
                      : null,
                  ]}
                >
                  {dias} dias
                </Text>
              </TouchableOpacity>
            ))}
          </View>
 
          <View style={styles.divisor} />
 
          <Text style={styles.rotulo}>
            Ou escolha um período específico
          </Text>
 
          <Text style={styles.rotuloData}>
            Data inicial (AAAA-MM-DD)
          </Text>
 
          <View style={styles.campoData}>
            <Text style={styles.iconeData}>📅</Text>
            <View style={styles.inputContainer}>
              <Text
                style={styles.inputData}
                onPress={() => {
                  Alert.alert(
                    'Data inicial',
                    'Digite a data inicial no formato AAAA-MM-DD.',
                  );
                }}
              >
                {dataInicial || 'Ex.: 2026-10-01'}
              </Text>
            </View>
          </View>
 
          {/* Campo de texto simples para informar as datas */}
          <View style={styles.linhaDatas}>
            <TouchableOpacity
              style={styles.botaoData}
              onPress={() => {
                Alert.prompt?.(
                  'Data inicial',
                  'Informe a data no formato AAAA-MM-DD',
                  (valor: string | undefined) => {
                    if (valor) setDataInicial(valor);
                  },
                );
 
                if (!Alert.prompt) {
                  Alert.alert(
                    'Data inicial',
                    'Edite a variável dataInicial ou substitua este campo por um seletor de datas.',
                  );
                }
              }}
            >
              <Text style={styles.textoBotaoData}>
                Definir início
              </Text>
            </TouchableOpacity>
 
            <TouchableOpacity
              style={styles.botaoData}
              onPress={() => {
                Alert.prompt?.(
                  'Data final',
                  'Informe a data no formato AAAA-MM-DD',
                  (valor: string | undefined) => {
                    if (valor) setDataFinal(valor);
                  },
                );
 
                if (!Alert.prompt) {
                  Alert.alert(
                    'Data final',
                    'Edite a variável dataFinal ou substitua este campo por um seletor de datas.',
                  );
                }
              }}
            >
              <Text style={styles.textoBotaoData}>
                Definir fim
              </Text>
            </TouchableOpacity>
          </View>
 
          <TouchableOpacity
            style={styles.botaoConsultar}
            onPress={consultarIntervalo}
          >
            <Text style={styles.textoBotaoConsultar}>
              Consultar período
            </Text>
          </TouchableOpacity>
 
          {usarIntervalo && (
            <Text style={styles.periodoSelecionado}>
              Período: {dataInicial} até {dataFinal}
            </Text>
          )}
        </View>
 
        {/* GRÁFICO DAS CLASSIFICAÇÕES */}
        <View style={styles.card}>
          <View style={styles.tituloCard}>
            <BarChart3 color="#7b2cbf" size={22} />
            <Text style={styles.tituloSecao}>
              Classificações por seção
            </Text>
          </View>
 
          <Text style={styles.textoAjuda}>
            Comparação das afirmativas positivas e negativas
            registradas no período selecionado.
          </Text>
 
          <View style={styles.legenda}>
            <View style={styles.itemLegenda}>
              <View style={styles.bolinhaPositiva} />
              <Text style={styles.textoLegenda}>Positivas</Text>
            </View>
 
            <View style={styles.itemLegenda}>
              <View style={styles.bolinhaNegativa} />
              <Text style={styles.textoLegenda}>Negativas</Text>
            </View>
          </View>
 
          {classificacoes.map((item, index) => (
            <View key={item.secao} style={styles.itemGrafico}>
              <Text style={styles.nomeClassificacao}>
                {index + 1}. {item.secao}
              </Text>
 
              <View style={styles.linhaBarra}>
                <Text style={styles.rotuloBarra}>P</Text>
                <View style={styles.fundoBarra}>
                  <View
                    style={[
                      styles.barraPositiva,
                      {
                        width: `${
                          (item.positivas / maximo) * 100
                        }%`,
                      },
                    ]}
                  />
                </View>
                <Text style={styles.valorBarra}>
                  {item.positivas}
                </Text>
              </View>
 
              <View style={styles.linhaBarra}>
                <Text style={styles.rotuloBarra}>N</Text>
                <View style={styles.fundoBarra}>
                  <View
                    style={[
                      styles.barraNegativa,
                      {
                        width: `${
                          (item.negativas / maximo) * 100
                        }%`,
                      },
                    ]}
                  />
                </View>
                <Text style={styles.valorBarra}>
                  {item.negativas}
                </Text>
              </View>
            </View>
          ))}
 
          <Text style={styles.observacao}>
            P = afirmativas positivas. N = afirmativas negativas.
            Os números acima são exemplos e não representam
            avaliação clínica.
          </Text>
        </View>
 
        {/* HISTÓRICO DE ÁUDIOS */}
        <View style={styles.card}>
          <View style={styles.tituloCard}>
            <Mic color="#7b2cbf" size={22} />
            <Text style={styles.tituloSecao}>
              Histórico de áudios
            </Text>
          </View>
 
          {audiosFiltrados.length === 0 ? (
            <Text style={styles.semRegistros}>
              Nenhum áudio encontrado nesse período.
            </Text>
          ) : (
            audiosFiltrados.map((audio) => (
              <View key={audio.id} style={styles.itemAudio}>
                <View style={styles.iconeAudio}>
                  <Mic color="#7b2cbf" size={20} />
                </View>
 
                <View style={styles.infoAudio}>
                  <Text style={styles.nomeAudio}>
                    {audio.descricao}
                  </Text>
                  <Text style={styles.dataAudio}>
                    {audio.data}
                  </Text>
                </View>
 
                <TouchableOpacity
                  style={styles.botaoAudio}
                  onPress={() => {
                    if (!audio.audioUri) {
                      Alert.alert(
                        'Áudio indisponível',
                        'Este registro de exemplo ainda não está conectado a um arquivo de áudio.',
                      );
                      return;
                    }
 
                    Alert.alert(
                      'Reprodução',
                      'Conecte este botão ao componente de reprodução de áudio do MIOS.',
                    );
                  }}
                >
                  <Text style={styles.textoBotaoAudio}>
                    Ver
                  </Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>
      </ScrollView>
 
      {/* NAVEGAÇÃO INFERIOR */}
      <View style={styles.menuInferior}>
        <TouchableOpacity
          style={styles.itemMenu}
          onPress={() => navegar('/Inicio')}
        >
          <Home color="#777" size={23} />
          <Text style={styles.textoMenu}>Início</Text>
        </TouchableOpacity>
 
        <TouchableOpacity
          style={styles.itemMenu}
          onPress={() => navegar('/Acompanhamento')}
        >
          <Calendar color="#777" size={23} />
          <Text style={styles.textoMenu}>Acompanhamento</Text>
        </TouchableOpacity>
 
        <TouchableOpacity
          style={styles.itemMenu}
          onPress={() => navegar('/Historico')}
        >
          <BarChart3 color="#7b2cbf" size={23} />
          <Text style={styles.textoMenuAtivo}>Histórico</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f3fc',
  },
  conteudo: {
    padding: 20,
    paddingBottom: 30,
  },
  titulo: {
    fontSize: 29,
    fontFamily: 'Times New Roman',
    fontWeight: 'bold',
    color: '#471c6c',
  },
  subtitulo: {
    fontSize: 15,
    color: '#666',
    marginTop: 8,
    marginBottom: 20,
    lineHeight: 22,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 17,
    marginBottom: 18,
    elevation: 3,
    shadowColor: '#471c6c',
    shadowOpacity: 0.08,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  tituloCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    marginBottom: 10,
  },
  tituloSecao: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#471c6c',
  },
  textoAjuda: {
    fontSize: 13,
    lineHeight: 20,
    color: '#777',
    marginBottom: 14,
  },
  linhaPeriodos: {
    flexDirection: 'row',
    gap: 8,
  },
  botaoPeriodo: {
    flex: 1,
    paddingVertical: 11,
    borderWidth: 1,
    borderColor: '#dabeed',
    borderRadius: 10,
    alignItems: 'center',
  },
  botaoPeriodoAtivo: {
    backgroundColor: '#7b2cbf',
    borderColor: '#7b2cbf',
  },
  textoPeriodo: {
    color: '#471c6c',
    fontWeight: '600',
  },
  textoPeriodoAtivo: {
    color: '#fff',
  },
  divisor: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 17,
  },
  rotulo: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#471c6c',
    marginBottom: 10,
  },
  rotuloData: {
    fontSize: 12,
    color: '#777',
    marginBottom: 5,
  },
  campoData: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#faf7fd',
    borderWidth: 1,
    borderColor: '#e0aaff',
    borderRadius: 9,
    padding: 11,
    marginBottom: 10,
  },
  iconeData: {
    marginRight: 8,
  },
  inputContainer: {
    flex: 1,
  },
  inputData: {
    color: '#777',
    fontSize: 14,
  },
  linhaDatas: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  botaoData: {
    flex: 1,
    padding: 11,
    alignItems: 'center',
    backgroundColor: '#f3e5fc',
    borderRadius: 9,
  },
  textoBotaoData: {
    color: '#471c6c',
    fontWeight: '600',
    fontSize: 13,
  },
  botaoConsultar: {
    backgroundColor: '#7b2cbf',
    padding: 13,
    borderRadius: 10,
    alignItems: 'center',
  },
  textoBotaoConsultar: {
    color: '#fff',
    fontWeight: 'bold',
  },
  periodoSelecionado: {
    color: '#471c6c',
    marginTop: 10,
    fontSize: 12,
  },
  legenda: {
    flexDirection: 'row',
    gap: 18,
    marginBottom: 18,
  },
  itemLegenda: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  bolinhaPositiva: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#7b2cbf',
  },
  bolinhaNegativa: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#e0aaff',
  },
  textoLegenda: {
    fontSize: 12,
    color: '#555',
  },
  itemGrafico: {
    marginBottom: 19,
  },
  nomeClassificacao: {
    color: '#471c6c',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 9,
  },
  linhaBarra: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 8,
  },
  rotuloBarra: {
    width: 14,
    color: '#666',
    fontSize: 11,
    fontWeight: 'bold',
  },
  fundoBarra: {
    flex: 1,
    height: 11,
    backgroundColor: '#f0e8f6',
    borderRadius: 6,
    overflow: 'hidden',
  },
  barraPositiva: {
    height: '100%',
    backgroundColor: '#7b2cbf',
    borderRadius: 6,
  },
  barraNegativa: {
    height: '100%',
    backgroundColor: '#e0aaff',
    borderRadius: 6,
  },
  valorBarra: {
    width: 20,
    textAlign: 'right',
    color: '#471c6c',
    fontSize: 12,
  },
  observacao: {
    color: '#888',
    fontSize: 11,
    lineHeight: 17,
    marginTop: 4,
  },
  semRegistros: {
    color: '#777',
    textAlign: 'center',
    paddingVertical: 20,
  },
  itemAudio: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    gap: 10,
  },
  iconeAudio: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#f3e5fc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoAudio: {
    flex: 1,
  },
  nomeAudio: {
    fontSize: 14,
    color: '#471c6c',
    fontWeight: 'bold',
  },
  dataAudio: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  botaoAudio: {
    paddingHorizontal: 13,
    paddingVertical: 8,
    backgroundColor: '#f3e5fc',
    borderRadius: 8,
  },
  textoBotaoAudio: {
    color: '#7b2cbf',
    fontWeight: 'bold',
  },
  menuInferior: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingVertical: 11,
    paddingHorizontal: 6,
    justifyContent: 'space-around',
  },
  itemMenu: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    flex: 1,
  },
  textoMenu: {
    fontSize: 10,
    color: '#777',
  },
  textoMenuAtivo: {
    fontSize: 10,
    color: '#7b2cbf',
    fontWeight: 'bold',
  },
  cabecalho: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginTop: 18,
  marginBottom: 8,
},

botoesCabecalho: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 15,
},

botaoTopo: {
  alignItems: 'center',
  justifyContent: 'center',
  padding: 5,
},

textoBotaoTopo: {
  color: '#7b2cbf',
  fontSize: 11,
  fontWeight: 'bold',
  marginTop: 3,
},
});
 