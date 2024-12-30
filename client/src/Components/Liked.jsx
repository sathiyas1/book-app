import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Modal from "./Modal";
import './style.css';

const Liked = ({ userId }) => {
  const [likedBooks, setLikedBooks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLikedBooks = async () => {
      try {
        const response = await axios.get(`https://bookrecommendation-fullstack-2.onrender.com/api/getLikedBooks/${userId}`);
        const bookIds = response.data;

        const bookDetailsPromises = bookIds.map(async (bookId) => {
          try {
            const bookResponse = await axios.get(`https://www.googleapis.com/books/v1/volumes/${bookId}`);
            const bookData = bookResponse.data.volumeInfo;
            return {
              id: bookId,
              title: bookData.title,
              author: bookData.authors ? bookData.authors.join(", ") : "Unknown Author",
              thumbnail: bookData.imageLinks ? bookData.imageLinks.thumbnail : "No image available",
              volumeInfo: bookData
            };
          } catch (error) {
            console.error(`Error fetching details for book ID ${bookId}`, error);
            return null;
          }
        });

        const bookDetails = await Promise.all(bookDetailsPromises);
        setLikedBooks(bookDetails.filter(book => book !== null));
      } catch (error) {
        console.error("Error fetching liked books", error);
      }
    };

    if (userId) {
      fetchLikedBooks();
    }
  }, [userId]);

  const handleRemoveBook = async (bookId) => {
    try {
      await axios.delete(`https://bookrecommendation-fullstack-2.onrender.com/api/removeLike/${userId}/${bookId}`);
      setLikedBooks(prevBooks => prevBooks.filter(book => book.id !== bookId));
    } catch (error) {
      console.error("Error removing book from liked list", error);
    }
  };

  const openModal = (book) => {
    setSelectedBook(book);
    setShowModal(true);
  };

  return (
    <div>
      <div className="heading-container">
        <h2>Liked Books</h2>
        <button onClick={() => navigate("/main")} className="home-button">
          Home
        </button>
      </div>

      {likedBooks.length === 0 ? (
        <p>No liked books yet.</p>
      ) : (
        <div className="container">
          {likedBooks.map((book) => (
            <div key={book.id} className="card" onClick={() => openModal(book)}>
              <span
                className="heart-icon"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveBook(book.id);
                }}
              >
                ❤️
              </span>
              <img src={book.thumbnail} alt="Book cover" />
              <h3>{book.title}</h3>
              <h3>{book.author}</h3>
            </div>
          ))}
        </div>
      )}

      {showModal && selectedBook && (
        <Modal show={showModal} item={selectedBook} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
};

export default Liked;
