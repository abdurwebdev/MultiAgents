# Luminous AI — Frontend (React + Vite)

A modern, production-ready frontend for an AI-powered chat application built with React, Vite and TailwindCSS. This project demonstrates realtime chat (Socket.IO), authenticated user flows, conversation state management (Zustand), Markdown rendering, and polished UI components.

Demo media
- Add a GIF or video demonstrating the app in action at: /public/assets/demo.gif or /public/assets/demo.mp4
- Embed in this README with:
  - GIF: `![Demo](/public/assets/demo.gif)`
  - Video (HTML): `<video src="/public/assets/demo.mp4" controls muted loop />`

Tech stack
- React 19 + Vite
- TailwindCSS
- Socket.IO client
- Zustand for client state
- Axios for REST calls
- Sonner for toasts
- react-markdown + remark-gfm for rich AI responses

Key features
- Realtime chat UI with streaming AI responses and verified sources
- Auth (register/login), protected routes, profile management
- Conversation list, per-conversation messages, code rendering with syntax highlighting and live preview
- Mobile-first responsive UI with accessible components

Running locally
1. npm install
2. npm run dev
3. App expects backend at http://localhost:3000 for Socket.IO and API routes; update src/app/hooks/AppSocket.jsx to change URL.

How recruiters can evaluate
- Look in src/features for UI flows (chat, auth, profile)
- src/store shows client state patterns (Zustand)
- Add a short GIF (5–15s) showing: login → create chat → AI response with sources

Scaling to millions — architecture & numbers (practical guide)
This section outlines how to scale the system from a single-instance prototype to supporting millions of users. The numbers below are example targets and assumptions — measure and adjust for your workload.

1) Goals & assumptions
- Target: 1,000,000 monthly active users (MAU)
- Peak concurrent users (PCU): assume 5–10% of MAU → 50k–100k concurrent sockets
- Typical message rate per active user: 1 message/min → 50k–100k messages/min peak

2) Web & WebSocket layer
- Use a load balancer (AWS ALB, Nginx) + autoscaling groups
- Socket scaling: run Socket.IO across multiple Node.js instances behind the LB, and use Redis (pub/sub) to broadcast events between instances (socket.io-redis adapter).
- Example sizing: if one Node instance can handle ~2k concurrent WebSocket connections (depends on CPU/memory), then for 100k PCU require ~50 instances. Use smaller instances (t3.medium) and autoscaling rules.

3) Backend compute (AI inference / orchestrator)
- Separate the realtime gateway from heavy AI inference. Gateway receives messages and enqueues jobs.
- Use a scalable worker pool (Kubernetes, ECS) to process AI tasks; autoscale by queue length and worker CPU/GPU utilization.
- For LLM inference: use managed APIs (OpenAI/Anthropic) or self-hosted GPU clusters. If self-hosting, a single A100 GPU can serve ~10–50 concurrent streaming inferences depending on model and prompt size.

4) State & storage
- Use a primary DB for user/account data (Postgres). For scale: use read replicas and partitioning (by user id).
- Conversations/messages: consider storing in a document DB (MongoDB Atlas) or sharded Postgres. Archive old messages to cheaper storage (S3).
- Session store / rate-limits: Redis cluster (AWS ElastiCache) for ephemeral state, presence, and pub/sub.

5) Search & retrieval / embeddings
- Use a vector DB (Pinecone, Milvus, Weaviate) for retrieval-augmented generation (RAG). Host with replication and autoscaling.
- Index size example: 1B vectors (~1536 dim) requires hundreds of GBs — plan for sharding and replica sets.

6) CDN & static assets
- Serve images, fonts, GIFs and video from a CDN (CloudFront) to offload traffic and reduce latency.

7) Observability & reliability
- Use Prometheus + Grafana for metrics, and distributed tracing (Jaeger) to monitor request latency across components.
- Implement circuit breakers and graceful degradation: if AI backend is slow, return cached summaries or fallback responses.

8) Cost and rough numbers (monthly estimates — region dependent)
- 50 Node.js gateway instances (t3.medium) for sockets: $1,500–3,000
- Redis cluster (3 nodes): $500–1,500
- Postgres managed (db.r5.large with replicas): $1,000–3,000
- Vector DB & AI inference: highly variable — managed API costs scale with tokens (could be $5k–50k+ depending on usage)
- CDN and storage: $200–1,000

Start small, measure, and optimize: autoscale each layer independently and add capacity where metrics show bottlenecks.

Security & production notes
- Use HTTPS, secure cookies, and token-based auth (JWT or session tokens with refresh flow)
- Rate-limit endpoints and socket events
- Sanitize/validate all user inputs and carefully vet any embedded HTML rendering

How I can help next
- Add CI (lint, tests) and production build pipeline
- Provide ready-to-run Docker + Kubernetes manifests and a sizing calculator for your expected traffic

Contact / Notes
- Replace the demo media placeholders with short GIFs (5–10s) and a 20–30s MP4 overview for recruiters.
- If you want, I can generate suggested GIF recording steps and a short README badge list for quick scanning.

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>
