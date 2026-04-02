const axios = require('axios');

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');
  
  const { message } = req.body;
  const targetUrl = 'https://gemini.google.com/_/BardChatUi/data/assistant.lamda.BardFrontendService/StreamGenerate?hl=id';

  try {
    const response = await axios.post(targetUrl, 
      `f.req=[null,"[[\"${message}\",0,null,null,null,null,0],[\"id\"],null,null]"]`, 
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
          // Catatan: Endpoint internal ini biasanya butuh Cookie/Auth. 
          // Pastikan lo masukin header Cookie kalau kena blokir.
        }
      }
    );

    // Parsing data aneh dari internal Google API
    const rawData = response.data;
    // Logika parsing disesuaikan dengan response stream Google
    res.status(200).json({ reply: rawData }); 
  } catch (err) {
    res.status(500).json({ error: 'Gagal konek ke core AI', detail: err.message });
  }
}
