export async function transcreverAudio(audioUri: string): Promise<string> {
  const arquivo = {
    uri: audioUri,
    name: 'gravacao.m4a',
    type: 'audio/m4a',
  };
 
  const formData = new FormData();
 
  formData.append('audio', arquivo as any);
 
  const resposta = await fetch(
    'https://SEU-SERVIDOR/transcrever',
    {
      method: 'POST',
      body: formData,
    }
  );
 
  if (!resposta.ok) {
    throw new Error('Não foi possível transcrever o áudio.');
  }
 
  const dados = await resposta.json();
 
  if (!dados.transcricao) {
    throw new Error('O serviço não retornou uma transcrição.');
  }
 
  return dados.transcricao;
}