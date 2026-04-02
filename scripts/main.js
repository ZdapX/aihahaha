import { world, system } from "@minecraft/server";
import { http, HttpHeader, HttpRequest, HttpRequestMethod } from "@minecraft/server-net";

const VERCEL_URL = "https://aihahahaai.vercel.app/api/chat";

// 1. Fitur Title & Chat pas Player Masuk
world.afterEvents.playerSpawn.subscribe((event) => {
    const { player, initialSpawn } = event;
    
    // Cek kalau ini spawn pertama kali masuk world
    if (initialSpawn) {
        // Tampilkan Title di tengah layar
        player.onScreenDisplay.setTitle("§bAI DEVCORE ACTIVE");
        player.onScreenDisplay.setSubtitle("§7Veteran Assistant by §fDaffTzy5912");
        
        // Kirim pesan ke chat khusus buat dia
        player.sendMessage("§b[SYSTEM] §fAI DEVCORE ACTIVE. §7Ketik §b!ask [pertanyaan] §7untuk menantang pengetahuan gue.");
    }
});

// 2. Logika Chat AI
world.beforeEvents.chatSend.subscribe((event) => {
    const message = event.message;
    const sender = event.sender;

    if (message.startsWith("!ask ")) {
        event.cancel = true;
        const query = message.replace("!ask ", "");
        
        world.sendMessage(`§8[§bDEVCORE§8] §7Menganalisa data buat §f${sender.name}...`);
        sendToOpenRouter(query, sender.name);
    }
});

async function sendToOpenRouter(query, playerName) {
    const request = new HttpRequest(VERCEL_URL);
    request.method = HttpRequestMethod.POST;
    request.headers = [new HttpHeader("Content-Type", "application/json")];
    request.body = JSON.stringify({
        message: query,
        playerName: playerName
    });

    try {
        const response = await http.request(request);
        const data = JSON.parse(response.body);
        
        if (data.reply) {
            // Split jawaban panjang biar nggak kepotong di chat Minecraft
            world.sendMessage(`§b[DEVCORE AI] §f${data.reply}`);
        } else {
            world.sendMessage("§c[DEVCORE] API error, lapor ke DaffTzy5912!");
        }
    } catch (e) {
        world.sendMessage("§c[DEVCORE] Koneksi Vercel mampet!");
    }
}
