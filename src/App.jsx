import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import ProtectedRoute from "./components/ProtectedRoute";
import CreateGroup from "./components/CreateGroup";
import DirectMessage from "./components/DirectMessage";
import { StompSessionProvider } from "react-stomp-hooks";
import Dashboard from "./pages/Dashboard";
import axios from "axios";
import { useEffect } from "react";

const App = () => {  

  useEffect(() => {  
    return () => {
      window.addEventListener("unload", ()=>{
        console.log("o'ldi");
        
        axios({
          url: "http://localhost:8080/api/users/status?status=false",
          method: "POST",
          headers: {Authorization: "Bearer "+localStorage.getItem("token")}
        }).then(res=>{
          console.log(res.data);
          
        })
      })
    }
  }, [])
  
  

  return (
    <StompSessionProvider url="http://localhost:8080/ws">
      <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/create-group" element={<ProtectedRoute><CreateGroup /></ProtectedRoute>} />
          <Route path="/direct-message" element={<ProtectedRoute><DirectMessage /></ProtectedRoute>} />
          <Route path="/online-users" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        </Routes>
      </Router>
    </Provider>
    </StompSessionProvider>
  );
};

export default App;
