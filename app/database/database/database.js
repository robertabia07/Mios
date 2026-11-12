import * as SQLite from 'expo-sqlite';
 
const db = SQLite.openDatabaseSync('mios.db');
 
// Criar e configurar o banco de dados
export function criarBanco() {
  db.execSync(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;
 
    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      senha TEXT NOT NULL,
      tipo TEXT NOT NULL,
      criado_em TEXT DEFAULT CURRENT_TIMESTAMP
    );
 
    CREATE TABLE IF NOT EXISTS idosos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      idade INTEGER NOT NULL,
      genero TEXT NOT NULL,
      foto TEXT,
      criado_em TEXT DEFAULT CURRENT_TIMESTAMP
    );
 
    CREATE TABLE IF NOT EXISTS questionario_saude (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      idoso_id INTEGER NOT NULL,
      pergunta_id TEXT NOT NULL,
      resposta INTEGER NOT NULL,
      FOREIGN KEY (idoso_id) REFERENCES idosos(id)
    );
 
    CREATE TABLE IF NOT EXISTS historico_familiar (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      idoso_id INTEGER NOT NULL,
      pergunta_id TEXT NOT NULL,
      resposta INTEGER NOT NULL,
      detalhes TEXT,
      FOREIGN KEY (idoso_id) REFERENCES idosos(id)
    );
 
    CREATE TABLE IF NOT EXISTS registros_diarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      idoso_id INTEGER NOT NULL,
      data TEXT NOT NULL,
      importancia INTEGER,
      audio TEXT,
      criado_em TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (idoso_id) REFERENCES idosos(id)
    );
 
    CREATE TABLE IF NOT EXISTS ocorrencias (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      registro_id INTEGER NOT NULL,
      pergunta_id TEXT NOT NULL,
      resposta INTEGER NOT NULL,
      FOREIGN KEY (registro_id)
        REFERENCES registros_diarios(id)
    );
 
    CREATE TABLE IF NOT EXISTS respostas_registro (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    registro_id INTEGER NOT NULL,
    afirmativa_id TEXT NOT NULL,
    secao TEXT NOT NULL,
    questao INTEGER NOT NULL,
    texto TEXT NOT NULL,
    tipo TEXT NOT NULL,
    marcada INTEGER NOT NULL DEFAULT 0,
    FOREIGN KEY (registro_id)
    REFERENCES registros_diarios(id)
    ON DELETE CASCADE
);
   CREATE TABLE IF NOT EXISTS classificacoes_transcricao (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  registro_id INTEGER NOT NULL,
  transcricao TEXT NOT NULL,
  categoria TEXT NOT NULL,
  trecho TEXT,
  confirmada INTEGER NOT NULL DEFAULT 0,
  FOREIGN KEY (registro_id)
    REFERENCES registros_diarios(id)
    ON DELETE CASCADE
);
  `);
 
 
 
 
  // Compatibilidade com bancos antigos que não tinham a coluna foto
  try {
    db.execSync('ALTER TABLE idosos ADD COLUMN foto TEXT;');
  } catch (error) {
    const mensagem = String(error).toLowerCase();
 
    if (!mensagem.includes('duplicate column')) {
      console.error('Erro ao verificar a coluna foto:', error);
    }
  }
 
  console.log('Banco MIOS criado com sucesso!');
}
 
// Cadastrar usuário
export function cadastrarUsuario(nome, email, senha, tipo) {
  const resultado = db.runSync(
    `INSERT INTO usuarios (nome, email, senha, tipo)
     VALUES (?, ?, ?, ?)`,
    nome.trim(),
    email.trim().toLowerCase(),
    senha,
    tipo
  );
 
  return resultado.lastInsertRowId;
}
 
// Validar login
export function validarLogin(email, senha) {
  return db.getFirstSync(
    `SELECT id, nome, email, tipo
     FROM usuarios
     WHERE email = ? AND senha = ?`,
    email.trim().toLowerCase(),
    senha
  );
}
 
// Buscar usuário pelo ID
export function buscarUsuarioPorId(id) {
  return db.getFirstSync(
    `SELECT id, nome, email, tipo
     FROM usuarios
     WHERE id = ?`,
    Number(id)
  );
}
 
 
export function salvarCadastroIdoso({
  nome,
  idade,
  genero,
  foto,
  respostasSaude,
  historicoFamiliar,
}) {
  if (!nome?.trim()) {
    throw new Error('O nome do idoso é obrigatório.');
  }
 
  if (!Number.isInteger(Number(idade)) || Number(idade) <= 0) {
    throw new Error('Informe uma idade válida.');
  }
 
  let idosoId;
 
  db.withTransactionSync(() => {
    const resultado = db.runSync(
      `INSERT INTO idosos (nome, idade, genero, foto)
       VALUES (?, ?, ?, ?)`,
      nome.trim(),
      Number(idade),
      genero,
      foto ?? null
    );
 
    idosoId = resultado.lastInsertRowId;
 
    for (const resposta of respostasSaude) {
      db.runSync(
        `INSERT INTO questionario_saude
         (idoso_id, pergunta_id, resposta)
         VALUES (?, ?, ?)`,
        idosoId,
        resposta.id,
        resposta.resposta ? 1 : 0
      );
    }
 
    for (const resposta of historicoFamiliar) {
      db.runSync(
        `INSERT INTO historico_familiar
         (idoso_id, pergunta_id, resposta, detalhes)
         VALUES (?, ?, ?, ?)`,
        idosoId,
        resposta.id,
        resposta.resposta ? 1 : 0,
        resposta.detalhes?.trim() || null
      );
    }
  });
 
  return idosoId;
}
 
// Buscar os dados básicos do idoso
export function buscarIdosoPorId(idosoId) {
  return db.getFirstSync(
    `SELECT id, nome, idade, genero, foto, criado_em
     FROM idosos
     WHERE id = ?`,
    Number(idosoId)
  );
}
 
// Buscar respostas do questionário de saúde
export function buscarRespostasSaude(idosoId) {
  return db.getAllSync(
    `SELECT pergunta_id, resposta
     FROM questionario_saude
     WHERE idoso_id = ?
     ORDER BY id`,
    Number(idosoId)
  );
}
 
// Buscar respostas do histórico familiar
export function buscarHistoricoFamiliar(idosoId) {
  return db.getAllSync(
    `SELECT pergunta_id, resposta, detalhes
     FROM historico_familiar
     WHERE idoso_id = ?
     ORDER BY id`,
    Number(idosoId)
  );
}
 
// Listar todos os idosos cadastrados
export function listarIdosos() {
  return db.getAllSync(
    `SELECT id, nome, idade, genero, foto
     FROM idosos
     ORDER BY nome`
  );
}
 
// Salva um registro diário e suas respostas
export function salvarRegistroDiario({
  idosoId,
  data,
  importancia,
  audio,
  respostas,
}) {
  db.withTransactionSync(() => {
    const resultado = db.runSync(
      `INSERT INTO registros_diarios
       (idoso_id, data, importancia, audio, criado_em)
       VALUES (?, ?, ?, ?, ?)`,
      [
        idosoId,
        data,
        importancia,
        audio ?? null,
        new Date().toISOString(),
      ]
    );
 
    const registroId = resultado.lastInsertRowId;
 
    // Cada chave deve identificar uma afirmativa única.
    for (const [perguntaId, resposta] of Object.entries(respostas)) {
      db.runSync(
        `INSERT INTO ocorrencias
         (registro_id, pergunta_id, resposta)
         VALUES (?, ?, ?)`,
        [
          registroId,
          Number(perguntaId),
          resposta ? 1 : 0,
        ]
      );
    }
  });
}
 
// Busca os registros de um idoso em determinado período
export function buscarHistorico(idosoId, dataInicial, dataFinal) {
  return db.getAllSync(
    `SELECT
       id,
       idoso_id,
       data,
       importancia,
       audio,
       criado_em
     FROM registros_diarios
     WHERE idoso_id = ?
       AND date(data) BETWEEN date(?) AND date(?)
     ORDER BY date(data) DESC`,
    [idosoId, dataInicial, dataFinal]
  );
}
 
// Busca as respostas de um registro específico
export function buscarRespostasRegistro(registroId) {
  return db.getAllSync(
    `SELECT pergunta_id, resposta
     FROM ocorrencias
     WHERE registro_id = ?`,
    [registroId]
  );
}
export function salvarClassificacoesTranscricao({
  registroId,
  transcricao,
  classificacoes,
}) {
  db.withTransactionSync(() => {
    db.runSync(
      `DELETE FROM classificacoes_transcricao
       WHERE registro_id = ?`,
      [registroId]
    );
 
    for (const item of classificacoes) {
      db.runSync(
        `INSERT INTO classificacoes_transcricao
          (registro_id, transcricao, categoria, trecho, confirmada)
         VALUES (?, ?, ?, ?, ?)`,
        [
          registroId,
          transcricao,
          item.categoria,
          item.trecho,
          item.confirmada ? 1 : 0,
        ]
      );
    }
  });
}