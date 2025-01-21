package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/gorilla/websocket"
)

// โครงสร้างสำหรับจัดการแต่ละ Room
type ChatRoom struct {
	clients   map[*websocket.Conn]string // เก็บ connection และ username
	broadcast chan string                // Channel สำหรับส่งข้อความใน room
}

// Map สำหรับเก็บ Room ทั้งหมด
var chatRooms = make(map[string]*ChatRoom)
var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

type Message struct {
	ID        string    `json:"id"`
	Text      string    `json:"text"`
	Sender    string    `json:"sender"`
	Timestamp time.Time `json:"timestamp"`
}

// ตัวแปรสำหรับจัดการ broadcast ทั่วไป
var broadcast = make(chan string)            // Channel สำหรับส่งข้อความถึงทุกคน
var clients = make(map[*websocket.Conn]bool) // Map สำหรับเก็บ clients ที่เชื่อมต่อทั้งหมด

// ฟังก์ชันจัดการการเชื่อมต่อ
// ฟังก์ชันจัดการการเชื่อมต่อ
// ฟังก์ชันจัดการการเชื่อมต่อ
func handleConnections(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
		return
	}
	defer conn.Close()

	// ดึงชื่อ room จาก Query Parameter
	roomName := r.URL.Query().Get("room")
	if roomName == "" {
		roomName = "default" // กำหนดค่าเริ่มต้นเป็น "default"
	}

	// ตรวจสอบว่ามี room นี้หรือยัง ถ้าไม่มีให้สร้างใหม่
	if _, exists := chatRooms[roomName]; !exists {
		chatRooms[roomName] = &ChatRoom{
			clients:   make(map[*websocket.Conn]string),
			broadcast: make(chan string),
		}
		go handleRoomBroadcast(chatRooms[roomName]) // ฟังก์ชันจัดการ broadcast ใน room
	}

	// ดึง username จาก Query Parameter
	username := r.URL.Query().Get("username")
	if username == "" {
		username = "Anonymous"
	}

	// บันทึกการเชื่อมต่อใน room
	chatRoom := chatRooms[roomName]
	chatRoom.clients[conn] = username
	log.Printf("%s joined room: %s", username, roomName)

	// ฟังข้อความจากผู้ใช้งานใน room
	for {
		_, msg, err := conn.ReadMessage()
		if err != nil {
			log.Printf("error: %v", err)
			delete(chatRoom.clients, conn)
			break
		}

		// สร้าง Message struct โดยใช้ข้อมูลที่ได้รับ
		message := Message{
			ID:        fmt.Sprintf("%d", time.Now().UnixNano()), // สร้าง ID แบบ unique
			Text:      string(msg),
			Sender:    username, // ใช้ username เป็น Sender
			Timestamp: time.Now(),
		}

		// แปลง Message เป็น JSON
		msgJSON, err := json.Marshal(message)
		if err != nil {
			log.Printf("error marshaling message: %v", err)
			continue
		}

		// ส่งข้อความที่แปลงเป็น JSON ไปที่ broadcast ของ room
		chatRoom.broadcast <- string(msgJSON)
	}
}

// ฟังก์ชันสำหรับจัดการ broadcast ใน room
func handleRoomBroadcast(chatRoom *ChatRoom) {
	for {
		// รับข้อความจาก broadcast
		msg := <-chatRoom.broadcast
		// ส่งข้อความให้ผู้ใช้ทุกคนใน room
		for conn := range chatRoom.clients {
			err := conn.WriteMessage(websocket.TextMessage, []byte(msg))
			if err != nil {
				log.Printf("error: %v", err)
				conn.Close()
				delete(chatRoom.clients, conn)
			}
		}
	}
}

// ฟังก์ชันสำหรับ broadcast ทั่วไป
func handleMessages() {
	for {
		msg := <-broadcast
		for client := range clients {
			err := client.WriteMessage(websocket.TextMessage, []byte(msg))
			if err != nil {
				log.Printf("error: %v", err)
				client.Close()
				delete(clients, client)
			}
		}
	}
}

func main() {
	// เริ่มเซิร์ฟเวอร์
	http.HandleFunc("/ws", handleConnections)
	go handleMessages()

	log.Println("Server started on :3001")
	log.Fatal(http.ListenAndServe(":3001", nil))
}
