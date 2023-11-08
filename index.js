import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

app.use(express.static("public"));

//Database configuration
const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "books",
  password: "3bkr@2251998",
  port: 5432,
});
//Starting DB
db.connect();

//Body Parser for accessing the data sendt from the client side
app.use(bodyParser.urlencoded({ extended: true }));
//For accessing the files in the 'public' directory
app.use(express.static("public"));

let books = [];
let orderByDate = false;
let orderByRating = false;

function formatDate(date) {
  const options = { year: "numeric", month: "2-digit", day: "2-digit" };
  return new Date(date).toLocaleDateString("en-GB", options);
}

//get all books data with different orders
async function getBooks() {
  if (orderByDate) {
    const results = await db.query(
      "SELECT * FROM read_books ORDER BY read_date ASC"
    );
    books = results.rows;
    books.forEach((book) => {
      book.read_date = formatDate(book.read_date);
    });
  } else if (orderByRating) {
    const results = await db.query(
      "SELECT * FROM read_books ORDER BY rating ASC"
    );
    books = results.rows;
    books.forEach((book) => {
      book.read_date = formatDate(book.read_date);
    });
  } else {
    const results = await db.query("SELECT * FROM read_books ORDER BY id ASC");
    books = results.rows;
    books.forEach((book) => {
      book.read_date = formatDate(book.read_date);
    });
  }
}

//Home Route
app.get("/", async (req, res) => {
  try {
    await getBooks();
    console.log(`Order By Rating: ${orderByRating}`);
    console.log(`Order By Date: ${orderByDate}`);
    res.render("index.ejs", {
      books: books,
      orderByRating: orderByRating,
      orderByDate: orderByDate,
    });
  } catch (error) {
    res.status(404).json({ message: "Error fetching books" });
  }
});

//Order books by read date
app.get("/orderByDate", async (req, res) => {
  orderByDate = !orderByDate;
  orderByRating = false;
  res.redirect("/");
});

//Order books by book rating
app.get("/orderByRating", async (req, res) => {
  orderByDate = false;
  orderByRating = !orderByRating;
  res.redirect("/");
});

//book details route
app.get("/bookDetails/:id", async (req, res) => {
  try {
    const bookId = req.params.id;
    const results = await db.query(
      "SELECT read_books.id, cover_id, title, author, brief, rating, read_date, notes FROM read_books JOIN book_notes ON read_books.id = book_notes.id WHERE read_books.id = $1",
      [bookId]
    );
    const book = results.rows[0];
    book.read_date = formatDate(book.read_date);

    res.render("bookDetails.ejs", {
      book: book,
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

//edit book notes
app.post("/editNotes", async (req, res) => {
  try {
    const id = req.body.bookId;
    const notes = req.body.editedNotes;
    console.log(id);
    console.log(notes);
    const results = await db.query(
      "UPDATE book_notes SET notes = $1 WHERE id = $2",
      [notes, id]
    );
    const book = results.rows[0];
    console.log(book);
    res.redirect(`/bookDetails/${id}`);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

//Run Server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
