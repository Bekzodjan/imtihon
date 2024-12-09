import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchGroups,
  fetchMessages,
  sendMessage,
} from "../store/slices/groupSlice";
import { useSubscription } from "react-stomp-hooks";
import Rodal from "rodal";
import AddMemberForm from "./AddMemberForm";
import "rodal/lib/rodal.css"

const Chat = ({ groupId }) => {
  const dispatch = useDispatch();
  const { groups, messages, loading, error } = useSelector(
    (state) => state.groups
  );
  const token =
    useSelector((state) => state.auth.token) || localStorage.getItem("token");

  const [selectedGroup, setSelectedGroup] = useState(null); // Tanlangan guruh
  const [visible, setVisible] = useState(false); // Tanlangan guruh
  const [content, setContent] = useState(""); // Xabar mazmuni


  useEffect(() => {
    if (selectedGroup) {
      getM();
    }
  }, [selectedGroup]);

  useSubscription("/topic/group", (msg) => {
    getM();
  });

  useEffect(() => {
    dispatch(fetchGroups());
  }, []);

  // Xabar yuborish funksiyasi
  const handleSendMessage = () => {
    dispatch(sendMessage({ groupId: selectedGroup, content }));
    setContent(""); // Inputni tozalash
  };

  function getM() {
    dispatch(
      fetchMessages({
        groupId: selectedGroup,
        token: localStorage.getItem("token"),
      })
    );
  }

  // Yuklash jarayonini ko'rsatish
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div style={{ display: "flex", gap: "20px" }}>
      {/* Guruhlar Ro'yxati */}
      <div
        style={{
          width: "30%",
          border: "1px solid lightgray",
          padding: "10px",
          borderRadius: "15px",
        }}
      >
        <h2>Groups</h2>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {groups.map((group) => (
            <li
              key={group.id}
              onClick={() => setSelectedGroup(group.id)}
              style={{
                padding: "10px",
                marginBottom: "5px",
                border: "1px solid #ddd",
                borderRadius: "5px",
                cursor: "pointer",
                backgroundColor:
                  selectedGroup === group.id ? "#f0f0f0" : "#fff",
              }}
            >
              {group.name}
            </li>
          ))}
        </ul>
      </div>

      {/* Tanlangan Guruh Bo'limi */}
      <div
        style={{
          width: "70%",
          border: "1px solid lightgray",
          padding: "10px",
          borderRadius: "15px",
        }}
      >
        {selectedGroup ? (
          <>
            <div className="d-flex justify-content-between align-items-center">
            <h2>Group Chat</h2>
            <button onClick={()=>setVisible(true)} className="btn btn-dark">add member</button>
            </div>
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
              {messages.length > 0 ? (
                messages.map((message) => (
                  <div key={message.id} style={{ marginBottom: "10px" }}>
                    <p>
                      <strong>{message.sender.name}: </strong>
                      {message.content}
                    </p>
                  </div>
                ))
              ) : (
                <p>No messages in this group...</p>
              )}
            </div>

            {/* Xabar Yuborish */}
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
          </>
        ) : (
          <p>Select a group to see messages and users.</p>
        )}
      </div>

      <Rodal visible={visible} onClose={()=>setVisible(false)}>
        <AddMemberForm groupId={selectedGroup}></AddMemberForm>
      </Rodal>
    </div>
  );
};

export default Chat;
