import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMessagesUser, sendMessageToUser } from "../store/slices/groupSlice"; // sendMessage va fetchMessages boshqacha bo'lishi mumkin
import { useSubscription } from "react-stomp-hooks";
import { Link } from "react-router-dom";

const DirectMessage = () => {
  const dispatch = useDispatch();
  const { messages, loading } = useSelector((state) => state.groups);
  const token = useSelector((state) => state.auth.token) || localStorage.getItem("token");

  const [email, setEmail] = useState("");
  const [receiverId, setReceiverId] = useState(null);
  const [content, setContent] = useState("");

  useSubscription("/topic/user", ()=>{
    dispatch(fetchMessagesUser({ groupId: receiverId }))
  })

  const fetchUserByEmail = async (email) => {
    try {
      // Backendga emailni yuborib, foydalanuvchining ID sini olish
      const response = await fetch(`http://localhost:8080/api/users/by-email?email=${email}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });
      const user = await response.json();
      console.log(user);
      if (user) {
        
        setReceiverId(user.id); // Foydalanuvchi ID sini state'ga saqlash
        // console.log(user);
        
        dispatch(fetchMessagesUser({ groupId: user.id })); // Xabarlarni olish
      } else {
        alert("User not found");
      }
    } catch (error) {
      console.error("Error fetching user by email:", error);
    }
  };

  const handleSendMessage = () => {
    console.log(receiverId);
    
    if (content.trim() && receiverId) {
      dispatch(sendMessageToUser({ groupId: receiverId, content }));
      setContent(""); // Inputni tozalash
      // dispatch(fetchMessagesUser({ groupId: receiverId })); // Xabarlarni olish
      fetchUserByEmail(email);
    }
  };

  if (loading) return <p>Loading messages...</p>;

  return (
    <div>
      <Link to={"/"} className="btn btn-dark m-2">Home</Link>
      <h2>Send Direct Message</h2>
      <div>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter the recipient's email"
        />
        <button onClick={()=>fetchUserByEmail(email)}>find</button>
      </div>

      {receiverId && (
        <div>
          <h3>Chat with {email}</h3>
          <div
            style={{
              height: "300px",
              overflowY: "auto",
              border: "1px solid #ddd",
              borderRadius: "5px",
              padding: "10px",
              marginBottom: "10px",
            }}
          >
            {messages && messages.length > 0 ? (
              messages.map((message) => (
                <div key={message.id} style={{ marginBottom: "10px" }}>
                  <p>
                    <strong>{message.sender.name}: </strong>
                    {message.content}
                  </p>
                </div>
              ))
            ) : (
              <p>No messages yet...</p>
            )}
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <input
              type="text"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Type your message..."
              style={{
                flex: 1,
                padding: "10px",
                border: "1px solid #ddd",
                borderRadius: "5px",
              }}
            />
            <button
              onClick={handleSendMessage}
              style={{
                padding: "10px 20px",
                backgroundColor: "#007bff",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DirectMessage;