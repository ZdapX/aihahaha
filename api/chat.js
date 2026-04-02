export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Harus POST!' });

  const { message, playerName } = req.body;
  // Ambil semua key dari ENV, pecah jadi array
  const apiKeys = process.env.OPENROUTER_KEYS ? process.env.OPENROUTER_KEYS.split(',') : [];
  
  if (apiKeys.length === 0) return res.status(500).json({ error: 'API Keys kosong di ENV!' });

  let success = false;
  let lastError = "";

  // Loop untuk nyari API Key yang aktif (Rotation System)
  for (let i = 0; i < apiKeys.length; i++) {
    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKeys[i].trim()}`,
          "HTTP-Referer": "https://vercel.com", // Opsional buat OpenRouter
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "model": "meta-llama/llama-3-8b-instruct:free", // Lo bisa ganti modelnya sesuka hati
          "messages": [
            { "role": "system", "content": `Kamu adalah DEVCORE AI, asisten veteran Minecraft legendaris. Kamu dingin, berkarisma, dan sombong tapi sangat ahli. Pembuatmu adalah DaffTzy5912. Kamu tahu semua rahasia teknik Minecraft.` },
            { "role": "user", "content": message }
          ]
        })
      });

      const data = await response.json();
      if (data.choices && data.choices[0]) {
        res.status(200).json({ reply: data.choices[0].message.content });
        success = true;
        break; // Keluar loop kalau berhasil
      }
    } catch (err) {
      lastError = err.message;
      continue; // Coba key berikutnya
    }
  }

  if (!success) {
    res.status(500).json({ error: 'Semua API Key mati/error!', detail: lastError });
  }
}
