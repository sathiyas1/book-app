import React,{useState, useEffect} from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Signup from './Signup';
import Login from './Login';
import Main from './Components/Main'; // Import Main component
import Liked from "./Components/Liked";
//import './Components/style.css';

function App() {

  const [user, setUser] = useState({userId : "0", name: "User", email: "user@example.com" });

  useEffect(() => {
    const username = localStorage.getItem("username");
    const userEmail = localStorage.getItem("userEmail");
    const userId = localStorage.getItem("userId");

    if (username && userEmail) {
        setUser({ userId : userId, name: username, email: userEmail });
    }
}, [user.userId, user.name, user.email]);

  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/main" element={<Main />} /> {/* Route for Main component */}
          <Route path="/Liked" element={<Liked userId={user.userId}/>} />  {/* Liked page route */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
