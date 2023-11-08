# NoteBooks
A web app for saving your read books and your personal notes, rating on it. Using a Node.js backend with npm and EJS (Embedded JavaScript) as the view engine, and PostgreSQL for the database.

## Installation

To get started with this project, follow these steps:

1. Clone the repository:
```bash
git clone https://github.com/abdoSamehDev/NoteBooks
```

2. Navigate to the project directory:
```bash
cd your-repo
```

3. Install the required dependencies:
```bash
npm install
```

4. Start your local server:
```bash
node index.js
```
or
```bash
nodemon index.js
```

5. Install PostgreSQL and create "books" database

6. Create read_books table with (id, cover_id, title, author, brief, rating, read_date) fields
```sql
CREATE TABLE read_books(
  id SERIAL PRIMARY KEY,
  cover_id INT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  brief TEXT NOT NULL,
  rating INT NOT NULL,
  read_date DATE NOT NULL
  );
```

7. Create book_notes table with (id, notes) fields, and make a one-to-one relationship between two tables through the id
```sql
CREATE TABLE book_notes(
  id INT REFERENCES read_books(id) UNIQUE,
  notes TEXT
  );
```

### Your application should now be up and running at http://localhost:3000.


### Books information and cover images from [Open Library](https://openlibrary.org/) APIs.
