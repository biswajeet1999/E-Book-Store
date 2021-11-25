import React, { useEffect, useState } from "react";
import { Redirect, withRouter } from "react-router-dom";
import { isAuthenticated } from "../helper/auth";
import { getBooks } from "../helper/admin";
import Navbar from "../Navbar";
import BookCard from "./BookCard";

const ManageBook = ({ history }) => {
  const [books, setBooks] = useState({
    books: [],
    err: "",
  });

  // used for delete book component
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");

  const { token, user } = isAuthenticated();

  useEffect(() => {
    if (!token || !user || user.role !== 0) {
      history.push("/signin");
    } else {
      getBooks({ token, user })
        .then((res) => {
          if (res.err) {
            console.log(res.err);
            setBooks({ ...books, err: "Unable to fetch all books" });
          } else {
            setBooks({ books: res.msg, err: "" });
            console.log(res.msg);
          }
        })
        .catch((err) => setBooks({ ...books, err: "Unable to fetch all books" }));
    }
  }, [msg]);

  const handleErr = () => {
    if (err) {
      return (
        <div
          className="alert text-danger"
          role="alert"
          style={{ background: "rgba(255, 0, 0, 0.2)" }}
        >
          {err}
        </div>
      );
    }
  };

  const handleMsg = () => {
    if (msg) {
      return (
        <div
          className="alert text-primary"
          role="alert"
          style={{ background: "rgba(0, 0, 255, 0.2)" }}
        >
          {msg}
        </div>
      );
    }
  };

  return (
    <>
      <Navbar />
      <div className="container">
        {handleMsg()}
        {handleErr()}
        <div className="row my-5 gy-4 ">
          {books.books.map((book, index) => {
            return (
              <BookCard
                key={index}
                _id={book._id}
                title={book.title}
                author={book.author}
                category={book.category.name}
                price={book.price}
                setErr={setErr}
                setMsg={setMsg}
              />
            );
          })}
        </div>
      </div>
    </>
  );
};

export default withRouter(ManageBook);
