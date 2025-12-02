# ☁️ IsCoolGPT - Assistente de Estudos Inteligente Cloud Native

> **Projeto Final:** Fundamentos de Computação em Nuvem (2025.2)
> 
> **Aluna:** Ana Beatriz Ximenes Alves
> 
> **Link (Load Balancer):** [Acesse aqui](http://iscoolgpt-alb-1020494150.us-east-2.elb.amazonaws.com)

---

## 📑 Sumário
1. [Visão Geral do Projeto](#-visão-geral-do-projeto)
2. [Arquitetura da Solução](#-arquitetura-da-solução)
3. [Jornada de Desenvolvimento](#-jornada-de-desenvolvimento)
4. [Justificativas Técnicas (Design Choices)](#-justificativas-técnicas-design-choices)
5. [Guia de Execução Local](#-guia-de-execução-local)
6. [Pipeline de CI/CD e Automação](#-pipeline-de-cicd-e-automação)
7. [Evidências de Funcionamento](#-evidências-de-funcionamento)

---

## 🎯 Visão Geral do Projeto

O **IsCoolGPT** é uma aplicação *Fullstack* projetada para democratizar o acesso a múltiplos modelos de Inteligência Artificial (LLMs) para estudantes. A aplicação centraliza o acesso a modelos como **Gemini (Google)**, **Llama 3.3(70b Versatile)**, **OpenAI (GPT OSS 20b)"** e **Moonshot Kimi K2 (via Groq)"** em uma interface única, moderna e responsiva.

O diferencial deste projeto não é apenas a aplicação em si, mas a **Infraestrutura em Nuvem (AWS)** e a **Engenharia de Software (DevOps)** utilizadas para sustentá-la, focando em escalabilidade, segurança e entrega contínua. Além disso, o sistema mantém o **contexto da conversa**, permitindo que o aluno faça perguntas sequenciais e a IA entenda a referência, simulando uma memória de curto prazo sem a necessidade de banco de dados complexo.

---

## 🏗️ Arquitetura da Solução

A solução foi arquitetada seguindo os princípios do *Twelve-Factor App*, utilizando contêineres para garantir portabilidade e serviços gerenciados da AWS para garantir disponibilidade.

### Diagrama de Infraestrutura
> *O diagrama abaixo ilustra o fluxo da requisição desde o cliente até o processamento no ECS Fargate.*

![Diagrama da Arquitetura AWS]([TO-DO])
*(Fluxo: Usuário -> Internet Gateway -> Application Load Balancer -> ECS Cluster -> Fargate Task -> Container (FastAPI + React) -> APIs Externas)*

### Componentes Chave:
* **Frontend:** React + Vite + TailwindCSS (Interface otimizada e responsiva).
* **Backend:** Python FastAPI (Alta performance assíncrona).
* **Container Registry (ECR):** Repositório privado e seguro para as imagens Docker versionadas.
* **Orquestração (ECS Fargate):** Gerenciamento de containers *Serverless*, eliminando a necessidade de gerenciar instâncias EC2 manualmente.
* **Traffic Management (ALB):** Application Load Balancer para distribuir tráfego e fornecer um ponto de entrada (DNS) fixo e estável.

---

## 🛠️ Jornada de Desenvolvimento

O projeto foi construído em 4 fases distintas, evoluindo de um ambiente local para uma infraestrutura de produção na nuvem.

### Fase 1: Desenvolvimento da Aplicação (Local)
* Criação do Frontend com React e integração inicial via Mock.
* Desenvolvimento do Backend em FastAPI.
> * **Desafio:** Conectar Frontend e Backend lidando com CORS.
> * **Solução:** Implementação de Proxy no Vite e configuração de CORS no FastAPI.

### Fase 2: Containerização Otimizada
* Criação do `Dockerfile`.
* **Estratégia:** Adoção de *Multi-Stage Build*.
    * *Estágio 1 (Node.js):* Compila o React e gera os arquivos estáticos (HTML/CSS/JS).
    * *Estágio 2 (Python):* Instala apenas o runtime do Python e copia os arquivos estáticos do estágio 1.
* **Resultado:** Uma imagem final leve, contendo apenas o necessário para rodar, sem código fonte de desenvolvimento.

### Fase 3: Provisionamento de Infraestrutura (AWS)
* Criação de Roles IAM seguindo o princípio do **Menor Privilégio** (Acesso apenas ao ECR e CloudWatch).
* Configuração do Cluster ECS Fargate.
* Implementação do Application Load Balancer (ALB) e Target Groups para garantir acesso público estável, contornando a troca de IPs dinâmicos do Fargate.

### Fase 4: Automação DevOps (CI/CD)
* Configuração do GitHub Actions.
* Implementação de pipeline que testa o código, constrói a imagem, envia para o ECR e força a atualização do serviço no ECS automaticamente a cada *push* na branch `main`.

---

## 💡 Justificativas Técnicas (Design Choices)

Nesta seção, detalho o porquê de cada escolha técnica para atender aos requisitos de avaliação.

| Decisão | Justificativa / Benefício |
| :--- | :--- |
| **AWS Fargate** | **Requisito: Escalabilidade e Gestão.** <br/>O modelo *Serverless* remove a carga operacional de gerenciar/atualizar SO de servidores EC2, permitindo focar na aplicação. |
| **Single Container** | **Requisito: Eficiência.** <br/>Servir o Frontend estático através do Backend Python elimina a necessidade de dois containers separados ou baldes S3 complexos, simplificando o deploy e eliminando problemas de CORS em produção. |
| **Load Balancer (ALB)** | **Requisito: Disponibilidade.** <br/>O Fargate altera o IP da tarefa a cada deploy. O ALB fornece um DNS fixo e realiza *Health Checks*, garantindo que o usuário nunca seja direcionado para um container quebrado. |
| **GitHub Actions** | **Requisito: Automação.** <br/>Elimina o erro humano no processo de deploy. O pipeline garante que apenas código testado chegue à produção. |
| **Multi-Stage Build** | **Requisito: Performance.** <br/>Reduz drasticamente o tamanho da imagem final e aumenta a segurança ao não incluir ferramentas de build (como npm e gcc) no ambiente de produção. |

---

## 💻 Guia de Execução Local

Para rodar o projeto na sua máquina para desenvolvimento ou testes.

### Pré-requisitos
* Docker instalado.
* Chaves de API (Gemini/Google e Groq).

### 1. Configuração de Segredos (.env)
Crie um arquivo `.env` na raiz do projeto:
```env
# Chaves de API (Obtenha no Google AI Studio e Groq Console)
GEMINI_API_KEY="sua_chave_aqui"
GROQ_API_KEY="sua_chave_aqui"
```

### 2. Rodar com Docker (Recomendado)
 ```bash
    # 1. Construir a imagem
    docker build -t abxa-iscoolgpt-local .
    
    # 2. Rodar o container
    docker run -p 8080:80 --env-file .env abxa-iscoolgpt-local
```
Acesse: http://localhost:8080

---

## 🚀 Pipeline de CI/CD e Automação
O projeto conta com um pipeline robusto definido em `.github/workflows/deploy.yml`:
- CI (Integração): Roda testes automatizados (pytest) a cada Pull Request na branch `main` para validar integridade do código e presença de chaves.
- CD (Entrega): No merge para a main, constrói a imagem Docker, envia para o ECR e força o Rolling Update no ECS.

---

## 📸 Evidências de Funcionamento
1. Aplicação com Memória (Contexto)

*Print mostrando uma conversa onde a IA lembra do que foi dito anteriormente.*

![Chat com Contexto]([TO-DO])

2. Pipeline DevOps (Sucesso)

*Print do GitHub Actions.*

![Pipeline]([TO-DO])

3. Infraestrutura AWS

*Print do Console AWS (ECS/ALB).*

![AWS Console]([TO-DO])
