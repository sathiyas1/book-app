import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Card from "./Card";
import './style.css';

const Main = () => {
    const [search, setSearch] = useState("");
    const [bookData, setData] = useState([]);
    const [startIndex, setStartIndex] = useState(0);
    const [totalItems, setTotalItems] = useState(0);
    const [loading, setLoading] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [user, setUser] = useState({userId : "0", name: "User", email: "user@example.com" });

    const navigate = useNavigate();
    const dropdownRef = useRef(null);
    const avatarRef = useRef(null);

    // Fetch user details from localStorage on component mount
    useEffect(() => {
        const username = localStorage.getItem("username");
        const userEmail = localStorage.getItem("userEmail");
        const userId = localStorage.getItem("userId");

        if (username && userEmail) {
            setUser({ userId : userId, name: username, email: userEmail });
        }
    }, [user.userId, user.name, user.email]);

    // Close the dropdown when clicking outside of it
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current && !dropdownRef.current.contains(event.target) &&
                avatarRef.current && !avatarRef.current.contains(event.target)
            ) {
                setShowDropdown(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const searchBook = (evt) => {
        if (evt.key === "Enter" && search) {
            setLoading(true);
            axios.get(`https://www.googleapis.com/books/v1/volumes?q=${search}&startIndex=${startIndex}&maxResults=40`)
                .then(res => {
                    setData(res.data.items || []);
                    console.log(res.data.items);
                    
                    setTotalItems(res.data.totalItems || 0);
                    setLoading(false);
                })
                .catch(err => {
                    console.log(err);
                    setLoading(false);
                });
        }
    };

    useEffect(() => {
        if (search) {
            setLoading(true);
            axios.get(`https://www.googleapis.com/books/v1/volumes?q=${search}&startIndex=${startIndex}&maxResults=40`)
                .then(res => {
                    setData(res.data.items || []);
                    setTotalItems(res.data.totalItems || 0);
                    setLoading(false);
                })
                .catch(err => {
                    console.log(err);
                    setLoading(false);
                });
        }
    }, [startIndex, search]);

    const toggleDropdown = () => setShowDropdown(!showDropdown);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        localStorage.removeItem("userEmail");
        navigate('/');
    };

    return (
        <>
            <div className="header">
                <div className="row1">
                    <h1>A room without books is like<br /> a body without a soul.</h1>
                    
                    <div className="user-avatar" onClick={toggleDropdown} ref={avatarRef}>
                        <img src="./images/User.png" alt="User" className="avatar-img"/>
                        {showDropdown && (
                            <div className="dropdown-menu" ref={dropdownRef}>
                                <p>{user.name}</p>
                                <p>{user.email}</p>
                                <p onClick={() => navigate('/Liked')}>Liked</p>
                                <p onClick={handleLogout}>Logout</p>
                            </div>
                        )}
                    </div>
                </div>
                <div className="row2">
                    <h2>Find Your Book</h2>
                    <div className="search">
                        <input 
                            type="text" 
                            placeholder="Enter Your Book Name"
                            value={search} 
                            onChange={e => setSearch(e.target.value)}
                            onKeyPress={searchBook} 
                        />
                        <button onClick={searchBook}><i className="fas fa-search"></i></button>
                    </div>
                    <img src="./images/bg2.png" alt="" />
                </div>
            </div>

            <div className="container">
                {loading ? <p>Loading...</p> : <Card book={bookData} userId={user.userId}/>}
            </div>

            <div className="pagination">
                <button onClick={() => setStartIndex(prev => Math.max(prev - 80, 0))} disabled={startIndex === 0}>
                    Previous
                </button>
                <button onClick={() => setStartIndex(prev => prev + 80)} disabled={startIndex + 80 >= totalItems}>
                    Next
                </button>
            </div>
        </>
    );
};

export default Main;
