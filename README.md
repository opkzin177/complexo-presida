# Complexo Presida — Painel do Escritório

Site admin: gestão de alunos, planos, pulseiras, financeiro e Asaas.

## Deploy
- **Live:** https://complexo-presida.netlify.app
- **GitHub:** este repositório
- **Nuvem dados:** Supabase (`clientes`, `pulseiras`)

## Estrutura
```
/
├── index.html              # SPA principal (escritório)
├── admin.html              # cópia espelho
├── netlify.toml            # SPA + functions
├── netlify/functions/
│   └── asaas.js            # proxy API Asaas (recorrência / link)
├── logo.svg
└── README.md
```

Dados de alunos ficam no **Supabase** (não no GitHub). No app, cada aluno tem sua “pasta” (página individual) com:
- Resumo financeiro e parcelas
- WhatsApp 1 clique
- Trancar / destrancar (adiar treinos e pausar cobrança)
- Links Asaas de cobrança

## Planos
| Plano | Valor |
|-------|-------|
| **6x R$ 200** | R$ 1.200 total (6 parcelas) |
| Anual | R$ 200 |
| Semestral | R$ 230 |
| Mensal | R$ 280 |

## Travar aluno
Na ficha do aluno → **Trancar** → informa quantos meses. Nesse período:
- não cobra mensalidade
- parcelas em aberto são **adiadas** (meses sem treino vão para frente)
- status fica **Trancado**

## WhatsApp
Botão verde em lista e na ficha abre `wa.me` com o número cadastrado.

## Asaas
Configurações → API Key. Financeiro → gerar link avulso ou recorrência cartão.

## Desenvolvimento
Edite `index.html` e publique no Netlify (pasta raiz + functions).
