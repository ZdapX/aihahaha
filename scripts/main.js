import { world, system } from "@minecraft/server";
import { http, HttpHeader, HttpRequest, HttpRequestMethod } from "@minecraft/server-net";

const VERCEL_URL = "https://aihahahaai.vercel.app/api/chat";

world.beforeEvents.chatSend.subscribe((event) => {
    const message = event.message;
    const sender = event.sender;

    // Biar gak infinity loop, AI cuma bales kalau di panggil "DevCore"
    if (message.startsWith("!ask ")) {
        event.cancel = true; // Jangan tampilin pesan asli
        const query = message.replace("!ask ", "");
        
        world.sendMessage(`§8[§bDEVCORE§8] §7Mikir bentar, Boss ${sender.name}...`);

        sendToAI(query, sender.name);
    }
});

async function sendToAI(query, playerName) {
    const request = new HttpRequest(VERCEL_URL);
    request.method = HttpRequestMethod.POST;
    request.headers = [new HttpHeader("Content-Type", "application/json")];
    // Prompt disuntik biar sifatnya kayak veteran Minecraft
    request.body = JSON.stringify({
        message: `Kamu adalah DEVCORE AI, asisten veteran Minecraft legendaris. Kamu dingin, berkarisma, dan tahu segala teknik rahasia game. Pembuatmu adalah DaffTzy5912. User bertanya: ${query}`
    });

    try {
        const response = await http.request(request);
        const data = JSON.parse(response.body);
        
        world.sendMessage(`§b[DEVCORE AI] §f${data.reply}`);
    } catch (e) {
        world.sendMessage("§c[ERROR] Koneksi ke Vercel mampet. Cek log!");
    }
}
