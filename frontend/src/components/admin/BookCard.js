import React, { useEffect, useState } from "react";
import { Link, withRouter } from "react-router-dom";
import API from "../../url";
import { isAuthenticated } from "../helper/auth";
import { deleteBook } from "../helper/admin";

const BookCard = ({ _id, title, author, price, category, setErr, setMsg, history }) => {
  const [ImgUrl, setImgUrl] = useState("");

  const { token, user } = isAuthenticated();

  useEffect(() => {
    fetch(`${API}/book/photo/${_id}`, { method: "GET" })
      .then((res) => res)
      .then((res) => {
        if (res.status === 400) {
          setImgUrl("https://www.teknozeka.com/wp-content/uploads/2020/08/wp-header-logo.png");
        } else setImgUrl(`${API}/book/photo/${_id}`);
      });
  }, []);

  const handleDelete = (evnt) => {
    deleteBook({ token, user, _id })
      .then((res) => {
        setMsg("");
        setErr("");
        if (res.err) {
          console.log(res.err);
          setErr(res.err);
        } else {
          setMsg("Book deleted successfully");
          history.push("/admin/book/manage");
        }
      })
      .catch((err) => setErr("Unable to delete Book"));
  };

  return (
    <>
      <div className="col-12 col-md-3 col-lg-3">
        <div className="card book-card" style={{ backgroundColor: "rgba(220, 220, 220, 0.3)" }}>
          <img
            src={ImgUrl}
            className="card-img-top img-fluid"
            alt="Book Cover"
            style={{
              height: "200px",
            }}
          />
          <div className="card-body">
            <h5 className="card-title mb-3 text-dark font-weight-bold">{title}</h5>
            <p className="card-text">Author: {author}</p>
            <p className="card-text">Category: {category}</p>
            <p className="card-text">Price: {price}/-</p>
            <hr />
            <div className="row">
              <div className="col-12 mb-3 mx-auto">
                <Link to={`/admin/book/update/${_id}`} className="btn btn-block btn-outline-info">
                  Update &nbsp;&nbsp;
                  <i className="fa fa-pencil category-update"></i>
                </Link>
              </div>
              <div className="col-12 mx-auto">
                <button className="btn btn-block btn-outline-danger" onClick={handleDelete}>
                  Delete &nbsp;&nbsp;
                  <i className="fa fa-trash-o category-delete"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default withRouter(BookCard);
