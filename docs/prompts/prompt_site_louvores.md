# Prompt para Desenvolvimento: Site de Louvores da Igreja

**Contexto e Papel:**
Atue como um Desenvolvedor Front-end Experiente. Sua tarefa é criar o código completo (HTML, CSS e JavaScript) para um aplicativo web/site que exibirá o repertório de louvores utilizados pela igreja.

**Requisitos e Funcionalidades a serem implementados:**

1. **Cabeçalho e Identidade Visual:**
   - Inclua um cabeçalho superior que exiba a **logomarca da igreja** (insira uma tag `<img>` com um placeholder descritivo).
   - O design deve ser limpo, moderno e adequado para leitura (modo claro com bom contraste).

2. **Navegação (Barra Lateral):**
   - Crie uma **barra lateral esquerda (sidebar)** contendo o índice com a lista de todos os louvores.
   - Os louvores no menu devem estar estritamente em **ordem alfabética**.
   - A barra lateral deve ser **retrátil/ocultável**. Crie um botão de "toggle" (ícone de menu/hambúrguer) para esconder ou mostrar a barra, melhorando a experiência em telas menores e permitindo foco na letra.

3. **Área de Exibição e Formatação da Letra:**
   - A área central exibirá a letra do louvor selecionado no menu.
   - **Regra de formatação:** Identifique o refrão das músicas. Todo refrão deve estar formatado obrigatoriamente em **negrito e itálico** (ex: `<span class="refrao" style="font-weight:bold; font-style:italic;">`).

4. **Controle de Acessibilidade (Tamanho da Fonte):**
   - Adicione botões na tela de leitura da música que permitam ao usuário **aumentar e diminuir o tamanho da fonte** da letra via JavaScript (ex: botões "A+" e "A-").

5. **Download de Arquivo DOCX:**
   - Adicione um botão ou link claro na interface permitindo que o usuário faça o download da lista de louvores em formato **.docx** (crie um link `<a>` com `href="lista_louvores.docx"` e atributo `download`).

6. **Contato via WhatsApp:**
   - Crie um botão de contato, de preferência um botão flutuante no canto inferior direito, com um ícone do WhatsApp.
   - O botão deve direcionar para o número de celular da igreja: **+55 88 8825-0560**.
   - Utilize a API do WhatsApp (ex: `https://wa.me/558888250560`) para que abra automaticamente a conversa.

**Entregáveis:**
- Código HTML estruturado e semântico.
- CSS para estilização completa e responsividade.
- JavaScript para interatividade (ocultar sidebar, zoom na fonte, navegação entre louvores).
