import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 3000;
const VAULT_ADDR = process.env.VAULT_ADDR || "http://127.0.0.1:8200";
const VAULT_TOKEN = process.env.VAULT_TOKEN || "root";

// Body parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Statische index (simpel loginformulier)
app.get("/", (_req, res) => {
  res.type("html").send(`
    <!doctype html>
    <html>
      <head><meta charset="utf-8"><title>Secure Login Demo</title></head>
      <body style="max-width:480px;margin:40px auto;font-family:system-ui;">
        <h1>Secure Login Demo</h1>
        <form method="POST" action="/submit">
          <label>Username<br><input name="username" required></label><br><br>
          <label>Password<br><input name="password" type="password" required></label><br><br>
          <button type="submit">Save to Vault</button>
        </form>
        <p style="color:#666">Credentials worden niet gelogd, alleen doorgestuurd naar Vault (KV v2).</p>
      </body>
    </html>
  `);
});

// POST -> schrijf naar Vault KV v2 onder secret/data/logins/<timestamp>
app.post("/submit", async (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ error: "username en password verplicht" });
  }

  const path = `secret/data/logins/${Date.now()}`;
  try {
    const r = await fetch(`${VAULT_ADDR}/v1/${path}`, {
      method: "POST",
      headers: {
        "X-Vault-Token": VAULT_TOKEN,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        data: { username, password },
        options: { cas: 0 }
      })
    });

    if (!r.ok) {
      const msg = await r.text();
      return res.status(500).json({ error: "Vault write failed", details: msg });
    }

    // Terug naar homepage zonder de credentials te tonen
    res.type("html").send(`
      <!doctype html><html><body style="font-family:system-ui;">
        <h2>Opgeslagen in Vault</h2>
        <p>Je gegevens zijn veilig opgeslagen.</p>
        <a href="/">Terug</a>
      </body></html>
    `);
  } catch (e) {
    res.status(500).json({ error: "Vault error", details: String(e) });
  }
});

app.listen(PORT, () => {
  console.log(`Login app listening on http://0.0.0.0:${PORT}`);
});