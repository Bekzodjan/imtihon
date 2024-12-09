import { Navigate, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { useEffect } from "react";

const ProtectedRoute = ({ children }) => {
  const { token } = useSelector((state) => state.auth);
  let navigate = useNavigate();

  useEffect(() => {
    check();
    console.log("tirildi");
    
    axios({
      url: "http://localhost:8080/api/users/status?status=true",
      method: "POST",
      headers: {Authorization: "Bearer "+localStorage.getItem("token")}
    }).then(res=>{
      console.log(res.data);
      
    })
  }, []);

  function check() {
    axios({
      url: "http://localhost:8080/api/auth/check",
      method: "GET",
      headers: {Authorization: "Bearer "+localStorage.getItem("token")}
    })
      .then(() => {})
      .catch((err) => {
        console.log(err);
        if (err.message === "Request failed with status code 403") {
          navigate("/login");
        }
      });
  }

  if (!token) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
