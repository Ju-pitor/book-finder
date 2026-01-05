import { useState } from "react";
import "./styles.css";

interface Book {
  title: string;
  author_name?: string[];
  first_publish_year?: number;
  cover_i?: number;
}

export default function App(): JSX.Element {
  const [query, setQuery] = useState<string>("");
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const searchBooks = async (): Promise<void> => {
    if (!query.trim()) {
      setError("Please enter a book title");
      return;
    }

    setLoading(true);
    setError("");
    setBooks([]);

    try {
      const res = await fetch(
        `https://openlibrary.org/search.json?title=${encodeURIComponent(query)}`
      );

      if (!res.ok) {
        throw new Error("Network response was not ok");
      }

      const data: { docs: Book[] } = await res.json();
      setBooks(data.docs.slice(0, 10));
    } catch (err) {
      setError("Failed to fetch books");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <h1>📚 Book Finder</h1>
      <p>Search books by title</p>

      <div className="search-box">
        <input
          type="text"
          placeholder="Enter book title..."
          value={query}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setQuery(e.target.value)
          }
        />
        <button onClick={searchBooks}>Search</button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}

      <div className="book-list">
        {books.map((book, index) => (
          <div key={index} className="book-card">
            {book.cover_i ? (
              <img
                src={`https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`}
                alt={book.title}
              />
            ) : (
              <div className="no-cover">No Cover</div>
            )}

            <h3>{book.title}</h3>
            <p>
              <strong>Author:</strong>{" "}
              {book.author_name?.[0] ?? "Unknown"}
            </p>
            <p>
              <strong>First Published:</strong>{" "}
              {book.first_publish_year ?? "N/A"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
