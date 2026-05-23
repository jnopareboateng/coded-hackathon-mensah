# Mensah — User Flow & Architecture (Miro Content)

Use this for **Option B (LLM-Assisted Flow)** in the hackathon. You can explain and present these flows.

---

## Diagram 1: User Journey Flow

```mermaid
flowchart TD
    A([User visits Mensah site]) --> B["Homepage loads<br/>GET /merchants/mensah/items<br/>GET /merchants/mensah/campaigns"]
    B --> C{User intent}
    C -->|Browse products| D["Shop Page<br/>GET /merchants/mensah/items"]
    C -->|View campaigns| E["Campaigns Page<br/>GET /merchants/mensah/campaigns"]
    D --> F["Product Detail<br/>GET /items/:id"]
    E --> G["Campaign Detail<br/>GET /campaigns/:id"]
    F --> H["Add to Cart<br/>Zustand store updated"]
    G --> H
    H --> I["Cart Drawer opens<br/>Enter name / phone / note"]
    I --> J{Cart empty?}
    J -->|Yes| K["Prompt: add items"]
    J -->|No| L["Order via WhatsApp<br/>POST /baskets<br/>merchant_id: mensah / team_slug: mensah"]
    L --> M["API returns basket ID<br/>GET /baskets/:id - Fetch full basket"]
    M --> N["WhatsApp link rendered<br/>wa.me/233551856093"]
    N --> O["User clicks link<br/>WhatsApp opens pre-filled"]
    O --> P([Merchant receives order - SALE])

    style A fill:#1a1a1a,color:#fff
    style P fill:#1a1a1a,color:#fff
    style H fill:#d4f0d4,color:#1a1a1a
    style N fill:#d4f0d4,color:#1a1a1a
    style L fill:#fff3cd,color:#1a1a1a
```

---

## Diagram 2: System Architecture

```mermaid
graph LR
    subgraph Browser["Browser — Next.js App Router"]
        direction TB
        Pages["Pages<br/>/ · /shop · /products/:id<br/>/campaigns · /campaigns/:id"]
        TQ["TanStack Query<br/>cache + background refetch"]
        ZS["Zustand Cart Store<br/>sessionStorage persist"]
        SD["ShadCN Sheet<br/>Cart Drawer"]
    end

    subgraph API["api-hackathon.codedematrixtech.com"]
        direction TB
        M["GET /merchants/mensah"]
        I["GET /merchants/mensah/items<br/>GET /items/:id"]
        C["GET /merchants/mensah/campaigns<br/>GET /campaigns/:id<br/>POST /campaigns"]
        B["POST /baskets<br/>GET /baskets/:id"]
        T["POST /teams - registration"]
    end

    WA["WhatsApp<br/>wa.me/233551856093"]

    Browser -- "fetch() HTTPS" --> API
    B -- "basket id + total" --> WA
```

---

## What to say when presenting the Miro board

> "We mapped the full user journey from landing on the Mensah site through to a completed WhatsApp order. The frontend is a Next.js App Router app that fetches inventory and campaigns from the hackathon API. The checkout flow creates a basket via POST /baskets, retrieves the full basket detail, then generates a WhatsApp deep-link pre-filled with the order summary — the merchant receives it directly in WhatsApp and can reply to confirm. We tag every basket and campaign with team_slug: 'mensah' for data attribution."
