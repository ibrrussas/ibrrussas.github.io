# Walkthrough – Site de Louvores IBRR

## O que foi criado

Site completo para o repertório de louvores da **Igreja Batista Reformada em Russas**, com 210 hinos extraídos automaticamente dos arquivos `.docx`.

## Arquivos criados

| Arquivo | Descrição |
|---------|-----------|
| [index.html](file:///home/dmontier/workspace-pessoal/ibrrussas.github.io/index.html) | Página principal — HTML semântico com header, sidebar, área de letras e botão WhatsApp |
| [styles.css](file:///home/dmontier/workspace-pessoal/ibrrussas.github.io/styles.css) | Design system completo — cores da marca (vermelho/carmesim do logo), sidebar escura, tipografia serif para letras, responsivo |
| [app.js](file:///home/dmontier/workspace-pessoal/ibrrussas.github.io/app.js) | Lógica da aplicação — lista alfabética, busca, controle de fonte, toggle sidebar, expansão de refrão |
| [louvores_data.js](file:///home/dmontier/workspace-pessoal/ibrrussas.github.io/louvores_data.js) | Dados dos 210 hinos extraídos (auto-gerado pelo script) |
| [extract_louvores.py](file:///home/dmontier/workspace-pessoal/ibrrussas.github.io/extract_louvores.py) | Script auxiliar para extrair letras dos `.docx` (uso único) |

## Funcionalidades implementadas

### 1. Cabeçalho com logo
- Logo da IBRR (`images/logo_black.png`) no header fixo
- Nome "Louvores IBRR" com subtítulo da igreja
- Clicar no logo volta para a tela inicial

### 2. Sidebar com índice alfabético
- 210 louvores em **ordem alfabética** com divisores por letra
- **Busca rápida** com filtro em tempo real (normaliza acentos)
- Indicador de contagem de resultados
- Sidebar **retrátil** via botão hambúrguer
- No desktop: sidebar colapsa deslizando para a esquerda
- No mobile: sidebar abre como overlay com backdrop blur

### 3. Exibição de letras com refrão formatado
- Refrão aparece em **negrito e itálico** com borda lateral vermelha e fundo sutil
- Quando a letra tem `[REFRÃO]` como referência, o texto completo do refrão é substituído
- Instruções como `[REPETE ACIMA]` aparecem em itálico com cor muted
- Animação suave de entrada ao selecionar um hino

### 4. Controle de tamanho de fonte (A+/A−)
- Botões para aumentar e diminuir a fonte em steps de 0.125rem
- Limites: 0.75rem a 2.5rem
- Botão "Resetar" para voltar ao padrão

### 5. Download DOCX
- Botão verde no header com ícone de download
- Link para `docs/lista_louvores/lista_louvores.docx` com atributo `download`

### 6. WhatsApp FAB
- Botão flutuante verde no canto inferior direito
- Direciona para `https://wa.me/558888250560` (número da igreja)
- Tooltip "Fale conosco" no hover
- Animação de escala no hover/click

### 7. Extras
- **Atalhos de teclado**: `Ctrl+K` ou `/` para focar na busca, `Esc` para fechar
- **SEO**: meta description, theme-color, favicon, lang="pt-BR"
- **Acessibilidade**: aria-labels, role=list, aria-live=polite
- **Print CSS**: esconde UI, mostra apenas a letra
- **Responsividade**: breakpoints em 1024px, 768px e 480px

## Como testar

```bash
cd /home/dmontier/workspace-pessoal/ibrrussas.github.io
python3 -m http.server 8080
# Abrir http://localhost:8080 no navegador (localmente)
# Abrir https://ibrrussas.github.io/ no navegador (ver na internet)
```

## Observação sobre o download

O botão de download aponta para `docs/lista_louvores/lista_louvores.docx`. Se esse arquivo não existir, você pode criá-lo ou apontar para outro caminho de arquivo `.docx` existente editando o `href` no `index.html`.
