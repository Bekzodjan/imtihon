import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchGroups, addMemberToGroup } from "../store/slices/groupSlice";
import AddMemberForm from "./AddMemberForm";

const GroupList = ({ onSelectGroup }) => {
  const dispatch = useDispatch();
  const { groups, loading, error } = useSelector((state) => state.groups);
  const token = useSelector((state) => state.auth.token);
  const [memberInputs, setMemberInputs] = useState({}); // Har bir guruh uchun input holatini saqlash

  useEffect(() => {
    if (token) {
      dispatch(fetchGroups(token));
    }
  }, [dispatch, token]);

  const handleInputChange = (groupId, email) => {
    setMemberInputs((prev) => ({
      ...prev,
      [groupId]: email,
    }));
  };

  const handleAddMember = (groupId) => {
    const email = memberInputs[groupId];
    if (email?.trim()) {
      dispatch(addMemberToGroup({ groupId, email }));
      setMemberInputs((prev) => ({
        ...prev,
        [groupId]: "", // Inputni tozalash
      }));
    }

    console.log(memberInputs);
    
  };

  if (loading) return <p>Loading groups...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>Groups</h2>
      <ul>
        {groups.map((group) => (
          <li key={group.id} onClick={() => onSelectGroup(group.id)}>
            {group.name}
            <div style={{ marginTop: "10px" }}>
              <input
                type="email"
                value={memberInputs[group.id] || ""}
                onChange={(e) => handleInputChange(group.id, e.target.value)}
                placeholder="Enter user's email"
              />
              <button onClick={() => handleAddMember(group.id)}>Add</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GroupList;
