# Complexo Presida — Painel do Escritório

Sistema de gestão de alunos para o Complexo Presida (Vôlei de Praia e Futevôlei).

## Funcionalidades

- Dashboard com busca por nome/CPF
- Cadastro de clientes (modal flutuante)
- Página individual de cada aluno
- Planos: Anual R$ 200 | Semestral R$ 230 | Mensal R$ 280
- Modalidades: Vôlei de Praia e Futevôlei
- Lista de clientes com filtro
- Menu lateral responsivo (mobile)

## Banco na nuvem (para vários computadores)

Hoje os dados ficam no navegador (localStorage).
Para sincronizar em todos os PCs sem peso, use **Supabase** (grátis):

1. Crie conta em https://supabase.com
2. Crie um projeto
3. No SQL Editor rode a tabela `clientes` (veja instruções no README completo do repo)
4. Depois integramos a URL e a chave no painel

## Planos oficiais

| Modalidade | Anual | Semestral | Mensal |
|------------|-------|-----------|--------|
| Vôlei de Praia | R$ 200 | R$ 230 | R$ 280 |
| Futevôlei | R$ 200 | R$ 230 | R$ 280 |

---
by: Complexo Presida
