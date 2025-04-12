# 🚀 Desafio Técnico Backend - Green Acesso

Este projeto foi desenvolvido como solução ao desafio técnico para a vaga de Desenvolvedor Backend na empresa Green Acesso.

## 📌 Tecnologias Utilizadas

- **Node.js**
- **Express**
- **Sequelize (ORM)**
- **PostgreSQL** (pode ser alterado facilmente para outro SQL)
- **Multer** (upload de arquivos)
- **CSV-Parser** (leitura de .csv)
- **PDF-Lib** (manipulação de PDF)
- **dotenv**

## 🧠 Descrição das Funcionalidades

### ✅ Atividade 1 - Importar .CSV

- Endpoint: `POST /boletos/csv`
- Recebe um arquivo (como `file` no body da requisição) `.csv` no formato:  
  `nome;unidade;valor;linha_digitavel`
  (Arquivo disponível na pasta DOCS_PARA_USO)
- Faz o mapeamento da `unidade` para o `id` da tabela `lotes`
- Cria registros na tabela `boletos`

### ✅ Atividade 2 - Mapeamento de Lotes

- Os nomes dos lotes no CSV são como `17`, `18`...
- No banco, os lotes são `0017`, `0018`, etc.
- Realiza o mapeamento automático com base no sufixo do nome do lote

### ✅ Atividade 3 - Importar PDF e Separar por Página

- Endpoint: `POST /boletos/pdf`
- Recebe um único PDF (como `file` no body da requisição) com várias páginas (cada uma representando um boleto)
- (Arquivo disponível na pasta DOCS_PARA_USO)
- Divide esse PDF em páginas únicas
- Salva cada página com o nome sendo o `id` do boleto correspondente

### ✅ Atividade 4 - Listagem de Boletos com Filtros

- Endpoint: `GET /boletos`
- Filtros disponíveis:
  - `nome`
  - `valor_inicial`
  - `valor_final`
  - `id_lote`

### ✅ Atividade 5 - Relatório em PDF (Base64)

- Endpoint: `GET /boletos?relatorio=1`
- Retorna um `base64` representando o PDF
- O PDF contém uma tabela com os boletos filtrados

## 🧪 Testes com Postman

Coleção Postman exportada e disponível na raiz do projeto como:
`GreenAcesso.postman_collection.json`

Ou, através do link:
https://documenter.getpostman.com/view/25271115/2sB2cYe1iQ

## 🔧 Configuração do Projeto

### Pré-requisitos

- Node.js (versão 18 ou superior)
- PostgreSQL

### Passos para rodar o projeto

```bash
git clone https://github.com/matheusrizzati/desafio-backend-green-acesso.git
cd desafio-backend-green-acesso

npm install

npm run dev
```

A .env está junto no repositório! Mesmo que não seja uma prática segura, foi disponibilizado para auxiliar na conexão com o banco de dados.
