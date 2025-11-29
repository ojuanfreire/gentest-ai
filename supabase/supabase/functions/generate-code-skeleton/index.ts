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
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { testCase, framework } = await req.json();

    if (!testCase || !framework) {
      return createErrorResponse("Dados incompletos: testCase e framework são obrigatórios.", 400);
    }

    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
    if (!GEMINI_API_KEY) {
      return createErrorResponse("Chave da API do Gemini não configurada.", 500);
    }

    const prompt = `
      Aja como um Engenheiro de Automação de Testes Sênior.
      Gere um script de teste automatizado utilizando o framework: "${framework}".
      
      Contexto do Teste:
      - Título: ${testCase.title}
      - Descrição: ${testCase.description}
      - Pré-condição: ${testCase.precondition}
      - Passos: ${testCase.steps}
      - Resultado Esperado: ${testCase.expectedResult}

      REGRAS:
      1. Retorne APENAS o código fonte. Não inclua explicações, comentários introdutórios ou conclusões.
      2. O código deve ser completo e executável (imports, setup, assertions).
      3. Se for Cypress, use sintaxe cy.get(). Se for Playwright, use await page.locator().
      4. Inclua comentários no código explicando o que cada bloco faz.
      5. NÃO inclua \`\`\` ou qualquer outra marcação no início ou fim da sua resposta.
      6. SE ALGUMA INFORMAÇÃO DE CONTEXTO, POR MÍNIMA QUE SEJA, FOR FORNECIDA E NÃO ESTIVER RELACIONADA A TESTES DE SOFTWARE, RETORNE APENAS UMA MENSAGEM DE "FALHA NA GERAÇÃO, TERMOS NÃO RELACIONADOS A TESTES DE SOFTWARE ENCONTRADOS".
    `;

    const response = await fetch(GEMINI_API_URL + GEMINI_API_KEY, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ 
            parts: [{ text: prompt }],
          }]
        })
      });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Erro do Gemini:', errorData);
      return createErrorResponse(errorData.error.message, 500);
    }
      
    const data = await response.json();

    if (!data.candidates || data.candidates.length === 0) {
      return createErrorResponse("Nenhuma resposta gerada pelo Gemini.", 500);
    }

    let generatedText = data.candidates[0].content.parts[0].text;

    // Limpando o texto para remover quaisquer marcações de código
    generatedText = generatedText.replace(/^```json\n?/, '').replace(/\n?```$/, '');

    return new Response(JSON.stringify({ code: generatedText }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    if (error instanceof SyntaxError) {
      console.error('Erro de sintaxe ao analisar JSON:', error.message);
      return createErrorResponse('Resposta JSON inválida do Gemini', 500);
    }

    return createErrorResponse('Erro interno do servidor', 500);
  }
});