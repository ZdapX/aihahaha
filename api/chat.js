export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Mana ada method ginian? Pake POST!');
  
  const { message } = req.body;
  const targetUrl = 'https://gemini.google.com/_/BardChatUi/data/assistant.lamda.BardFrontendService/StreamGenerate?hl=id';

  try {
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
      body: `f.req=[null,"[[\"${message}\",0,null,null,null,null,0],[\"id\"],null,null]"]`
    });

    const data = await response.text(); // Google biasanya balikin format string aneh
    res.status(200).json({ reply: data });
  } catch (err) {
    res.status(500).json({ error: 'Server lo tepar!', detail: err.message });
  }
}
