const username = "John"; // ใส่ชื่อผู้ใช้
const socket = new WebSocket(`ws://komacrazy.thddns.net:6990/ws?username=${username}`);
console.log("WebSocket readyState:", socket.readyState);

socket.onopen = () => {
    console.log("Connected to WebSocket server!");
    socket.send("Hello, I'm here!");
};

socket.onmessage = (event) => {
    console.log("Message from server:", event.data);
    document.getElementById("output").innerText = event.data; // แสดงข้อความในหน้าเว็บ
    console.log(event.data)
};

socket.onerror = (error) => {
    console.error("WebSocket error:", error);
};

socket.onclose = () => {
    console.log("WebSocket connection closed.");
};