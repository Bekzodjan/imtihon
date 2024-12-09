import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../redux/authSlice";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.css'

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state) => state.auth);

  const handleLogin = async (e) => {
    e.preventDefault();
    const result = await dispatch(login({ email, password }));
    if (result.meta.requestStatus === "fulfilled") {
      navigate("/");
    }
  };

  return (
    <form className="card w-50 mx-auto text-center p-2 pt-5 mt-5" onSubmit={handleLogin}>
      <h2>Login</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="form-control mb-2"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className="form-control mb-2"
      />
      <button className="btn btn-success mb-3" type="submit" disabled={isLoading}>
        {isLoading ? "Loading..." : "Login"}
      </button>
      <p>Do you haven't an account? <a className="text-decoration-none text-primary" href="/register">Register</a></p>
      {error && <p>{error}</p>}
    </form>
  );
};

export default Login;
