
import * as Print from 'expo-print';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Sharing from 'expo-sharing';
import { Calendar, FileText, LockKeyhole, Share2 } from 'lucide-react-native';
import { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

import {
    buscarHistorico,
    buscarHistoricoFamiliar,
    buscarIdosoPorId,
    buscarRespostasSaude,
    validarLogin,
} from '../database/database/database.js';

type LinhaBanco = Record<string, any>;

function primeiroParametro(
  valor?: string | string[]
): string {
  return Array.isArray(valor) ? valor[0] ?? '' : valor ?? '';
}

function escaparHtml(valor: any): string {
  return String(valor ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function tabelaHtml(
  titulo: string,
  dados: LinhaBanco[]
): string {
  if (!dados || dados.length === 0) {
    return `
      <h2>${escaparHtml(titulo)}</h2>
      <p>Nenhum dado registrado nesta seção.</p>
    `;
  }

  const colunas = Object.keys(dados[0]);

  return `
    <h2>${escaparHtml(titulo)}</h2>
    <table>
      <thead>
        <tr>
          ${colunas.map(
            coluna => `<th>${escaparHtml(coluna)}</th>`
          ).join('')}
        </tr>
      </thead>
      <tbody>
        ${dados.map(linha => `
          <tr>
            ${colunas.map(
              coluna => `<td>${escaparHtml(linha[coluna])}</td>`
            ).join('')}
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

export default function CompartilharScreen() {
  const router = useRouter();

  const parametros = useLocalSearchParams<{
    idosoId?: string | string[];
    emailCuidador?: string | string[];
  }>();

  const idosoId = primeiroParametro(parametros.idosoId);
  const emailCuidador = primeiroParametro(parametros.emailCuidador);

  const [dataInicial, setDataInicial] = useState('');
  const [dataFinal, setDataFinal] = useState('');
  const [senha, setSenha] = useState('');
  const [modalSenha, setModalSenha] = useState(false);
  const [carregando, setCarregando] = useState(false);

  const gerarRelatorio = async () => {
    if (!idosoId || !Number.isInteger(Number(idosoId))) {
      Alert.alert(
        'Atenção',
        'Não foi possível identificar o idoso.'
      );
      return;
    }

    if (!dataInicial || !dataFinal) {
      Alert.alert(
        'Período necessário',
        'Informe a data inicial e a data final.'
      );
      return;
    }

    const inicio = new Date(`${dataInicial}T00:00:00`);
    const fim = new Date(`${dataFinal}T23:59:59`);

    if (
      Number.isNaN(inicio.getTime()) ||
      Number.isNaN(fim.getTime()) ||
      inicio > fim
    ) {
      Alert.alert(
        'Período inválido',
        'Confira as datas informadas.'
      );
      return;
    }

    if (!emailCuidador) {
      Alert.alert(
        'Sessão necessária',
        'Não foi possível identificar o cuidador para validar a senha. Confira o envio do emailCuidador na navegação.'
      );
      return;
    }

    if (!senha.trim()) {
      Alert.alert(
        'Senha necessária',
        'Digite sua senha para continuar.'
      );
      return;
    }

    setCarregando(true);

    try {
      // A senha deve ser validada pelo banco de dados.
      const usuario = await Promise.resolve(
        validarLogin(emailCuidador, senha)
      );

      if (!usuario) {
        Alert.alert(
          'Senha incorreta',
          'Confira sua senha e tente novamente.'
        );
        return;
      }

      const id = Number(idosoId);

      const paciente = buscarIdosoPorId(id) as
        | LinhaBanco
        | null;

      if (!paciente) {
        Alert.alert(
          'Idoso não encontrado',
          'Não foi possível localizar o cadastro.'
        );
        return;
      }

      const respostasSaude =
        (buscarRespostasSaude(id) as LinhaBanco[]) ?? [];

      const historicoFamiliar =
        (buscarHistoricoFamiliar(id) as LinhaBanco[]) ?? [];

      const registrosDiarios =
        (buscarHistorico(
          id,
          dataInicial,
          dataFinal
        ) as LinhaBanco[]) ?? [];

      const html = `
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
          <meta charset="UTF-8" />
          <style>
            body {
              font-family: Arial, sans-serif;
              color: #240046;
              padding: 24px;
              font-size: 12px;
            }
            h1 {
              color: #7b2cbf;
              text-align: center;
            }
            h2 {
              color: #7b2cbf;
              margin-top: 28px;
              border-bottom: 1px solid #dabeed;
              padding-bottom: 6px;
            }
            p {
              line-height: 1.6;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 12px;
              margin-bottom: 20px;
            }
            th, td {
              border: 1px solid #dabeed;
              padding: 7px;
              text-align: left;
              overflow-wrap: anywhere;
            }
            th {
              background: #f3e5fc;
            }
            .aviso {
              font-size: 10px;
              color: #666;
              margin-top: 28px;
            }
          </style>
        </head>
        <body>
          <h1>MIOS — Relatório de acompanhamento</h1>

          <p>
            <strong>Idoso:</strong>
            ${escaparHtml(paciente.nome)}
          </p>
          <p>
            <strong>Idade:</strong>
            ${escaparHtml(paciente.idade)} anos
          </p>
          <p>
            <strong>Gênero:</strong>
            ${escaparHtml(paciente.genero)}
          </p>
          <p>
            <strong>Período:</strong>
            ${escaparHtml(dataInicial)} até
            ${escaparHtml(dataFinal)}
          </p>

          ${tabelaHtml(
            'Dados cadastrais',
            [paciente]
          )}

          ${tabelaHtml(
            'Questionário de saúde',
            respostasSaude
          )}

          ${tabelaHtml(
            'Histórico familiar',
            historicoFamiliar
          )}

          ${tabelaHtml(
            'Registros diários do período',
            registrosDiarios
          )}

          <p class="aviso">
            Relatório gerado a partir dos dados retornados
            pelo banco de dados do MIOS. Este documento
            reúne informações registradas e não constitui
            diagnóstico médico.
          </p>
        </body>
        </html>
      `;

      const arquivo = await Print.printToFileAsync({
        html,
      });

      const disponivel = await Sharing.isAvailableAsync();

      if (!disponivel) {
        Alert.alert(
          'Compartilhamento indisponível',
          'Este dispositivo não oferece compartilhamento de arquivos.'
        );
        return;
      }

      setModalSenha(false);
      setSenha('');

      await Sharing.shareAsync(arquivo.uri, {
        mimeType: 'application/pdf',
        dialogTitle: 'Compartilhar relatório MIOS',
        UTI: 'com.adobe.pdf',
      });
    } catch (error) {
      console.error('Erro ao gerar relatório MIOS:', error);

      Alert.alert(
        'Erro',
        'Não foi possível gerar ou compartilhar o relatório. Confira as funções do banco de dados.'
      );
    } finally {
      setCarregando(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.conteudo}>
        <View style={styles.cabecalho}>
          <Share2 size={32} color="#7b2cbf" />
          <Text style={styles.titulo}>Compartilhar informações</Text>
          <Text style={styles.subtitulo}>
            Gere um relatório com os dados do idoso e os registros
            disponíveis no período escolhido.
          </Text>
        </View>

        <View style={styles.card}>
          <View style={styles.linha}>
            <Calendar size={22} color="#7b2cbf" />
            <Text style={styles.tituloSecao}>
              Período do relatório
            </Text>
          </View>

          <Text style={styles.label}>
            Data inicial (AAAA-MM-DD)
          </Text>
          <TextInput
            style={styles.input}
            value={dataInicial}
            onChangeText={setDataInicial}
            placeholder="2026-10-01"
            autoCapitalize="none"
          />

          <Text style={styles.label}>
            Data final (AAAA-MM-DD)
          </Text>
          <TextInput
            style={styles.input}
            value={dataFinal}
            onChangeText={setDataFinal}
            placeholder="2026-11-03"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.card}>
          <View style={styles.linha}>
            <FileText size={22} color="#7b2cbf" />
            <Text style={styles.tituloSecao}>
              Informações incluídas
            </Text>
          </View>

          <Text style={styles.item}>
            • Dados cadastrais do idoso
          </Text>
          <Text style={styles.item}>
            • Questionário de saúde
          </Text>
          <Text style={styles.item}>
            • Histórico familiar
          </Text>
          <Text style={styles.item}>
            • Registros diários do período
          </Text>
        </View>

        <TouchableOpacity
          style={styles.botao}
          disabled={carregando}
          onPress={() => setModalSenha(true)}
        >
          {carregando ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Share2 size={21} color="#fff" />
              <Text style={styles.textoBotao}>
                Gerar e compartilhar PDF
              </Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.botaoVoltar}
          onPress={() => router.back()}
        >
          <Text style={styles.textoVoltar}>Voltar</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal
        visible={modalSenha}
        transparent
        animationType="fade"
        onRequestClose={() => setModalSenha(false)}
      >
        <View style={styles.fundoModal}>
          <View style={styles.modal}>
            <LockKeyhole
              size={32}
              color="#7b2cbf"
            />

            <Text style={styles.tituloModal}>
              Confirme sua senha
            </Text>

            <Text style={styles.subtituloModal}>
              Para proteger os dados pessoais, valide sua senha
              antes de gerar o relatório.
            </Text>

            <TextInput
              style={styles.input}
              value={senha}
              onChangeText={setSenha}
              placeholder="Senha do cuidador"
              secureTextEntry
              autoCapitalize="none"
            />

            <TouchableOpacity
              style={styles.botao}
              disabled={carregando}
              onPress={gerarRelatorio}
            >
              {carregando ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.textoBotao}>
                  Confirmar e compartilhar
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.botaoCancelar}
              onPress={() => {
                setModalSenha(false);
                setSenha('');
              }}
            >
              <Text style={styles.textoVoltar}>
                Cancelar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    paddingBottom: 40,
  },
  cabecalho: {
    alignItems: 'center',
    marginTop: 35,
    marginBottom: 25,
  },
  titulo: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#471c6c',
    textAlign: 'center',
    marginTop: 12,
  },
  subtitulo: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 21,
    marginTop: 10,
  },
  card: {
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 16,
    marginBottom: 18,
    elevation: 2,
  },
  linha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  tituloSecao: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#471c6c',
    flex: 1,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#471c6c',
    marginBottom: 6,
    marginTop: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#dabeed',
    borderRadius: 10,
    padding: 12,
    color: '#240046',
    backgroundColor: '#fcfaff',
    marginBottom: 12,
  },
  item: {
    color: '#471c6c',
    fontSize: 14,
    marginBottom: 10,
    lineHeight: 21,
  },
  botao: {
    backgroundColor: '#7b2cbf',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 10,
    minHeight: 50,
  },
  textoBotao: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  botaoVoltar: {
    alignItems: 'center',
    padding: 15,
    marginTop: 5,
  },
  textoVoltar: {
    color: '#7b2cbf',
    fontWeight: 'bold',
  },
  fundoModal: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    padding: 22,
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 22,
    alignItems: 'stretch',
  },
  tituloModal: {
    fontSize: 21,
    fontWeight: 'bold',
    color: '#471c6c',
    textAlign: 'center',
    marginTop: 12,
  },
  subtituloModal: {
    color: '#666',
    textAlign: 'center',
    lineHeight: 21,
    marginVertical: 12,
  },
  botaoCancelar: {
    padding: 14,
    alignItems: 'center',
  },
});
