import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOnlineUsers } from "../store/slices/usersSlice";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);
  const { onlineUsers, status, error } = useSelector((state) => state.users);

  useEffect(() => {
    if (token) {
      dispatch(fetchOnlineUsers(token));
    }
  }, [dispatch, token]);

  return (
    <div>
      <h1>Welcome, {user?.name}</h1>
      <h2>Online Users:</h2>
      {status === "loading" && <p>Loading...</p>}
      {status === "failed" && <p>Error: {error}</p>}
      <ul>
        {onlineUsers.map((u) => (
          <li key={u.id}>{u.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
