import React, { useState } from "react";
import { Link } from "react-router-dom";
import GroupList from "../components/GroupList";
import Chat from "../components/Chat";

const Home = () => {
  const [selectedGroup, setSelectedGroup] = useState(null);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      {/* Guruh yaratish tugmasi */}
      <div className="d-flex gap-2 p-3 justify-content-between">
        <Link to="/create-group">
          <button
            className="btn btn-primary"
          >
            Create Group
          </button>
        </Link>
        <div className="d-flex gap-2">
        <Link to={"/login"} className="btn btn-secondary">Login</Link>
        <Link to={"/direct-message"} className="btn btn-secondary">Direct</Link>
        </div>
      </div>

      {/* Asosiy kontent */}
      <div style={{ display: "flex", flex: 1 }}>
        {/* Guruhlar ro'yxati */}
        {/* <div
          style={{ flex: 1, borderRight: "1px solid #ccc", overflowY: "auto" }}
        >
          <GroupList onSelectGroup={handleGroupSelect} />
        </div> */}

        {/* Chat bo'limi */}
        <div style={{ flex: 2, padding: "1rem", overflowY: "auto" }}>
          {selectedGroup ? (
            <Chat groupId={selectedGroup} />
          ) : (
            <Chat groupId={selectedGroup} />

            // <p>Please select a group to start chatting.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
