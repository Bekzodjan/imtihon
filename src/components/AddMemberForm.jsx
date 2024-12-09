import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { addMemberToGroup, fetchGroups } from "../store/slices/groupSlice";

const AddMemberForm = ({ groupId }) => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState(""); // Har bir guruh uchun input holati

  useEffect(()=>{
    // dispatch(fetchGroups())
  }, [])

  const handleAddMember = () => {
    if (email.trim()) {
      dispatch(addMemberToGroup({ groupId, email }));
      setEmail(""); // Inputni tozalash
    }
  };

  return (
    <div style={{ marginTop: "10px" }}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter user's email"
      />
      {/* <select className="form-select">
        {
          groups.map((item)=>{
            return <option key={item.id} value={item.id}>{item.name}</option>
          })
        }
      </select> */}
      <button onClick={handleAddMember}>Add</button>
    </div>
  );
};

export default AddMemberForm;
