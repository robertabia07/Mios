export type Classificacao = {
  categoria: string;
  trecho: string;
  confirmada: boolean;
};
 
const regras = [
  {
    categoria: 'Memória',
    palavras: [
      'esqueceu',
      'esquecimento',
      'não se lembra',
      'não lembrou',
      'repetiu a mesma pergunta',
      'perdeu os objetos',
    ],
  },
  {
    categoria: 'Humor deprimido',
    palavras: [
      'triste',
      'desanimado',
      'sem vontade',
      'chorou',
      'desesperançoso',
    ],
  },
  {
    categoria: 'Atividades diárias',
    palavras: [
      'precisou de ajuda',
      'tomar banho',
      'se vestir',
      'vestir-se',
      'dificuldade para caminhar',
      'não conseguiu comer sozinho',
    ],
  },
  {
    categoria: 'Funcionamento mental global',
    palavras: [
      'não compreendeu',
      'não entendeu',
      'confuso',
      'confusão',
      'não reconheceu',
      'desorientado',
    ],
  },
  {
    categoria: 'Função cerebrovascular',
    palavras: [
      'fraqueza de um lado',
      'dificuldade para falar',
      'perda súbita de força',
    ],
  },
  {
    categoria: 'Paranoias e outras características psiquiátricas',
    palavras: [
      'estão tentando me prejudicar',
      'estão me perseguindo',
      'ouviu vozes',
      'viu alguém que não estava lá',
      'desconfiado',
    ],
  },
];
 
function normalizar(texto: string): string {
  return texto
    .toLocaleLowerCase('pt-BR')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}
 
export function classificarTranscricao(
  transcricao: string
): Classificacao[] {
  const texto = normalizar(transcricao);
  const resultados: Classificacao[] = [];
 
  for (const regra of regras) {
    const palavrasEncontradas = regra.palavras.filter(
      palavra => texto.includes(normalizar(palavra))
    );
 
    if (palavrasEncontradas.length > 0) {
      resultados.push({
        categoria: regra.categoria,
        trecho: palavrasEncontradas.join(', '),
        confirmada: false,
      });
    }
  }
 
  return resultados;
}