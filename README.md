# 🎟️ EventPulse

> Plataforma completa de gestão e comercialização de bilhetes para eventos.

O **EventPulse** é uma aplicação web full-stack desenvolvida para facilitar a criação de eventos, gestão de categorias/lotes de bilhetes e reservas em tempo real, oferecendo uma experiência fluida tanto para organizadores quanto para participantes.

---

## 🛠️ Tecnologias Utilizadas

### **Frontend**
* **React** (com TypeScript)
* **CSS Modules / Glassmorphism** (Design Responsivo e Mobile-First)
* **Lucide React** (Iconografia)

### **Backend**
* **Node.js** com **Express** e **TypeScript**
* **Clean Architecture** & **Princípios SOLID**
* **Prisma ORM** (Modelagem e Persistência de Dados)
* **PostgreSQL** (Banco de dados relacional)
* **Docker Compose** (Container)
* **Redis** (Cache)
* **RabbitMQ**

---

## 📐 Arquitetura e Decisões de Design

* **Modelagem de Bilhetes e Preços:** O preço de cada evento é gerido dinamicamente através dos tipos e tipos de bilhetes (`TicketType` / `Ticket`). A rota principal de listagem realiza a agregação do menor valor disponível por lote.
* **Geolocalização e Mídia:** Suporte a integração visual de localização dos eventos e gerenciamento de uploads de capas/banners.
* **Arquitetura em Camadas:** Backend estruturado com separação clara de responsabilidades entre Controllers, Services, Repositories e Routes.

---

## 🚀 Como Executar o Projeto Localmente

### **Pré-requisitos**
Antes de começar, certifique-se de ter instalado em sua máquina:
* [Node.js](https://nodejs.org/) (v18 ou superior)
* [Git](https://git-scm.com/)
* [PostgreSQL](https://www.postgresql.org/) rodando localmente ou uma instância no Supabase/Docker.

---

## 📦 Estrutura da Base de Dados (Schema)

O projeto utiliza o **Prisma ORM** com **PostgreSQL**. As entidades principais estão organizadas com relações de dependência direta entre Eventos, Tipos de Bilhetes e Reservas.

<details>
<summary><b>Clique para expandir o schema.prisma completo</b></summary>

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model Event {
  id          String       @id @default(uuid())
  title       String
  description String
  location    String
  date        DateTime
  imageUrl    String?
  ticketTypes TicketType[]
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt
}

model TicketType {
  id        String   @id @default(uuid())
  name      String   // Ex: VIP, Pista, Geral
  price     Float
  quantity  Int
  eventId   String
  event     Event    @relation(fields: [eventId], references: [id], onDelete: Cascade)
  tickets   Ticket[]
  createdAt DateTime @default(now())
}

model Ticket {
  id           String     @id @default(uuid())
  ticketTypeId String
  ticketType   TicketType @relation(fields: [ticketTypeId], references: [id], onDelete: Cascade)
  status       String     @default("AVAILABLE") // AVAILABLE, RESERVED, SOLD
  createdAt    DateTime   @default(now())
}

git clone [https://github.com/seu-usuario/eventpulse.git](https://github.com/seu-usuario/eventpulse.git)
cd eventpulse

cd backend
npm install
cp .env.example .env
# Configurar DATABASE_URL no .env
npx prisma migrate dev
npm run dev

cd ../frontend
npm install
cp .env.example .env
# Configurar VITE_API_URL no .env
npm run dev
