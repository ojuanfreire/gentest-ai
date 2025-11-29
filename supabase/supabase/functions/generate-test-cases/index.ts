const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key='

// Função auxiliar para criar as mensagem de erro que serão retornadas
const createErrorResponse = (message: string, status: number) => {
  return new Response(JSON.stringify({ error: message }), {
    status: status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders },
  })
};

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Tratar a requisição 'OPTIONS' (necessário para o CORS funcionar)
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { useCase } = await req.json();
    
    if (!useCase) {
      return createErrorResponse('Nenhum "useCase" fornecido no corpo', 400);
    }

    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
    if (!GEMINI_API_KEY) {
      return createErrorResponse('Chave da API do Gemini não configurada', 500);
    }

    // Desenvolve o prompt que será enviado para o Gemini para a geração dos casos de teste
    const prompt = `
      Aja como um Engenheiro de QA Sênior especialista em testes de software.
      Seu objetivo é criar casos de teste detalhados a partir de um caso de uso.

      REGRAS DE SAÍDA:
      - Forneça a resposta APENAS em formato JSON, dentro de um array.
      - O JSON deve ser um array de objetos, onde cada objeto tem: "title", "description", "type", "precondition", "steps" e "expected_result".
      - O "title" deve ser um resumo curto e descritivo do teste.
      - A "description" deve ser uma explicação breve do objetivo deste teste.
      - O "type" deve ser "Caminho Feliz", "Caminho Alternativo" ou "Caminho de Exceção".
      - Os valores dentro de cada atributo do objeto DEVERÃO ser escritos em português.
      - NÃO inclua \`\`\`json ou \`\`\` no início ou fim da sua resposta.

      - CASO ALGUMA INFORMAÇÃO NO CASO DE USO ABAIXO FAÇA REFERENCIA A OUTROS TÓPICOS QUE NÃO SEJAM RELACIONADOS A TESTES DE SOFTWARE, NÃO GERE OS CASOS DE TESTE. APENAS RETORNE UMA MENSAGEM DE "FALHA NA GERAÇÃO, TERMOS NÃO RELACIONADOS A TESTES DE SOFTWARE ENCONTRADOS".

      CASO DE USO FORNECIDO:
      - Nome: ${useCase.name}
      - Ator: ${useCase.actor}
      - Pré-condições: ${useCase.preConditions}
      - Fluxo Principal: ${useCase.mainFlow}
      - Fluxos Alternativos/Exceção: ${useCase.alternativeFlows}

      Gere os casos de teste:
    `;

    const geminiResponse = await fetch(GEMINI_API_URL + GEMINI_API_KEY, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }],
        }],
      }),
    });

    if (!geminiResponse.ok) {
      const errorData = await geminiResponse.json();
      console.error('Erro do Gemini:', errorData);
      return createErrorResponse(errorData.error.message, 500);
    }

    const geminiData = await geminiResponse.json();

    if (!geminiData.candidates || geminiData.candidates.length === 0) {
      return createErrorResponse("Nenhuma resposta gerada pelo Gemini.", 500);
    }
    
    // Extraindo a resposta do Gemini
    let jsonText = geminiData.candidates[0].content.parts[0].text;

    // Limpando o texto para remover quaisquer marcações de código
    jsonText = jsonText.replace(/^```json\n?/, '').replace(/\n?```$/, '');
    
    return new Response(jsonText, {
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });

  } catch (error) {
    if (error instanceof SyntaxError) {
      console.error('Erro de sintaxe ao analisar JSON:', error.message);
      return createErrorResponse('Resposta JSON inválida do Gemini', 500);
    }

    return createErrorResponse('Erro interno do servidor', 500);
  }
})