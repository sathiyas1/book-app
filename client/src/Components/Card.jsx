import React, { useState, useEffect } from "react";
import Modal from "./Modal";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import axios from "axios";

const Card = ({ book, userId }) => {
  const [show, setShow] = useState(false);
  const [bookItem, setItem] = useState(null);
  const [likedBooks, setLikedBooks] = useState(new Set());
  const [isLoading, setIsLoading] = useState(true);

  // Fetch liked books for the specific user from the server
  const fetchLikedBooks = async () => {
    try {
      const response = await axios.get(`https://bookrecommendation-fullstack-2.onrender.com/api/getLikedBooks/${userId}`);
      // Store liked book IDs in a Set for efficient lookup
      setLikedBooks(new Set(response.data.map((book) => book._id)));
      setIsLoading(false); // Set loading to false after fetching
    } catch (error) {
      console.error("Error fetching liked books", error);
    }
  };

  // Toggle like/unlike for a specific book
  const toggleLike = async (bookId) => {
    const isLiked = likedBooks.has(bookId);
    const endpoint = isLiked ? 'https://bookrecommendation-fullstack-2.onrender.com/api/removeLike' : 'https://bookrecommendation-fullstack-2.onrender.com/api/likeBook';
    const payload = { userId, bookId };
    
    try {
      const response = await axios.post(endpoint, payload);
      if (response.status === 200) {
        // Update likedBooks based on the response for current user
        setLikedBooks((prevLikedBooks) => {
          const updatedLikedBooks = new Set(prevLikedBooks);
          isLiked ? updatedLikedBooks.delete(bookId) : updatedLikedBooks.add(bookId);
          return updatedLikedBooks;
        });
      }
    } catch (error) {
      console.error("Error updating liked books", error);
    }
  };

  // Fetch liked books on mount for the current user
  useEffect(() => {
    if (userId) {
      fetchLikedBooks();
    }
  }, [userId]);

  if (isLoading) {
    return <p>Loading books...</p>; // Optionally, add a loading indicator
  }

  return (
    <>
      {book.map((item) => {
        const thumbnail = item.volumeInfo.imageLinks?.smallThumbnail;
        const amount = item.saleInfo.listPrice?.amount;
        const isLiked = likedBooks.has(item.id); // Check if the book is liked by this user

        if (thumbnail && amount) {
          return (
            <div className="card" key={item.id} onClick={() => { setShow(true); setItem(item); }}>
              <img src={thumbnail} alt="Book cover" />
              <div className="bottom">
                <h3 className="title">{item.volumeInfo.title}</h3>

                <div className="bottom-row">
                  {/* Heart Icon for Like */}
                  <span
                    className={`like-icon ${isLiked ? "liked" : "not-liked"}`}
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent modal from opening on icon click
                      toggleLike(item.id); // Toggle like state for this book
                    }}
                  >
                    {isLiked ? <FaHeart className="liked" /> : <FaRegHeart />}
                  </span>

                  <p className="amount">&#8377;{amount}</p>
                </div>
              </div>
            </div>
          );
        }
        return null;
      })}

      {show && bookItem && <Modal show={show} item={bookItem} onClose={() => setShow(false)} />}
    </>
  );
};

export default Card;
