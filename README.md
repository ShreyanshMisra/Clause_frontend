# Clause

<img width="1305" height="749" alt="Screenshot 2025-11-08 at 8 52 38 PM" src="https://github.com/user-attachments/assets/f0c3e822-f6e7-4d3f-88e3-199c80f626a5" />

Clause is an AI-powered legal enforcement platform. Upload a lease, medical bill, or contract! Our system detects violations, calculates damages, and generates demand letters with statute citations. A Chrome extension flags illegal clauses in real-time on Airbnb listings. Everything is timestamped on Solana's blockchain for tamper-proof evidence in court. Ask questions via voice or text (in any language), and get instant answers grounded in Massachusetts law.

Devpost: [https://devpost.com/software/clause-bu9l74?ref_content=user-portfolio&ref_feature=in_progress](https://devpost.com/software/clause-bu9l74)
Demo: [https://youtu.be/FwFLnbPbcfw?si=vFtDSl1wAQ-vxfBA](https://youtu.be/FwFLnbPbcfw?si=vFtDSl1wAQ-vxfBA)
Presentation: [https://docs.google.com/presentation/d/1Dk0eTkfH2HfcC2rGY1lnY7-viMub2LUqeJZXiIdstzQ/edit?usp=sharing](https://docs.google.com/presentation/d/1Dk0eTkfH2HfcC2rGY1lnY7-viMub2LUqeJZXiIdstzQ/edit?usp=sharing)

## Tech Stack

<img width="577" height="594" alt="Screenshot 2025-11-10 at 5 11 24 PM" src="https://github.com/user-attachments/assets/4c89df59-0d02-442d-a850-cd97e865bf18" />

- Frontend: React web app + Chrome extension for real-time scanning
- Backend: FastAPI with PII redaction (spaCy NER + regex) before processing
- RAG Pipeline: Snowflake Cortex (vector embeddings via snowflake-arctic-embed-l-v2.0) + chunked legal documents stored in Snowflake tables
- LLM: Gemini 2.0 Flash Thinking for legal analysis, grounded by retrieved statutes
- Voice Chat: ElevenLabs
- Blockchain: Solana for immutable document hashing + future escrow/reputation features
- Storage: Cloudflare R2 for documents, Solana for metadata
- Deployment: Vultr Cloud hosting
  
