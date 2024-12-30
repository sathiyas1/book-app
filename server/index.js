const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const axios = require('axios');  // If you are fetching books from an external API

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose.connect('mongodb+srv://parthasarathis22cse:partha%4026@book.vd0be.mongodb.net/?retryWrites=true&w=majority&appName=book', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("Connected to MongoDB Atlas"))
.catch((error) => console.error("MongoDB connection error:", error));

// User Schema
const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  likedBooks: [String]  // Store book IDs as strings now
});

const User = mongoose.model('User', UserSchema);

// Signup Route
app.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Login Route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, 'secret', { expiresIn: '1h' });
    res.status(200).json({
      token,
      user: { userId: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Route to Like a Book
app.post('/api/likeBook', async (req, res) => {
  const { userId, bookId } = req.body;
  console.log("Received request to like book with data:", req.body);

  if (!userId || !bookId) {
    return res.status(400).json({ message: "userId and bookId are required" });
  }

  try {
    // Fetch book details from an external API (for example, Google Books API)
    const bookResponse = await axios.get(`https://www.googleapis.com/books/v1/volumes/${bookId}`);
    
    // Check if book exists in the external API
    if (!bookResponse.data || !bookResponse.data.volumeInfo) {
      return res.status(404).json({ message: "Book not found" });
    }
    
    const book = bookResponse.data.volumeInfo;

    // Find user by userId
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the book is already liked
    if (!user.likedBooks.includes(bookId)) {
      user.likedBooks.push(bookId);
      await user.save();
      return res.status(200).json({ message: "Book liked successfully", book });
    }

    res.status(400).json({ message: "Book already liked" });
  } catch (error) {
    console.error("Error liking book:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Route to Remove a Liked Book
// Route to Remove a Liked Book
app.delete('/api/removeLike/:userId/:bookId', async (req, res) => {
  const { userId, bookId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    user.likedBooks = user.likedBooks.filter((id) => id !== bookId);
    await user.save();

    res.status(200).json({ message: "Book removed from liked books" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});


// Route to Get Liked Books for a User
app.get('/api/getLikedBooks/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const likedBooks = user.likedBooks;

    console.log(likedBooks);
    res.status(200).json(likedBooks);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
             