Dinâmica do Sonho - Final package
==================================

Conteúdo pronto para deploy na Render (ZIP upload).

Admin default password: alfredo123
WhatsApp (handoff): +351 918393290
Default language: PT

Files:
- index.html, styles.css, script.js
- server.js (Express) - endpoints: /api/stock, /api/upload, /admin
- admin.html - painel admin (login simples)
- images/ - placeholders and uploads dir created at runtime
- stock.json - initial stock data
- package.json - dependencies and start script

To run locally:
1. npm install
2. node server.js
3. Open http://localhost:3000 and http://localhost:3000/admin
