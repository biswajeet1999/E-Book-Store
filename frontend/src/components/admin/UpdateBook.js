import React, { useEffect, useState } from "react";
import { useParams, withRouter } from "react-router-dom";
import { isAuthenticated } from "../helper/auth";
import { getCategories, getBook, updateBook } from "../helper/admin";
import Navbar from "../Navbar";

const Updatebook = ({ history }) => {
  const [categories, setCategories] = useState({
    categories: [],
    err: "",
  });

  const [bookData, setBookData] = useState({
    title: "",
    author: "",
    price: "",
    category: "",
    photo: "",
    pdf: "",
    formData: new FormData(),
    err: "",
    msg: "",
  });

  const { token, user } = isAuthenticated();
  const { _id } = useParams();

  useEffect(() => {
    if (!token || !user || user.role !== 0) {
      history.push("/signin");
    } else {
      // get all categories
      getCategories(token)
        .then((res) => {
          if (res.err) {
            setCategories({
              ...categories,
              err: "Unable to fetch categories.",
            });
          } else {
            setCategories({ categories: res.msg, err: "" });
          }
        })
        .catch((err) => setCategories({ ...categories, err: "Unable to fetch categories." }));

      // get book data
      getBook({ token, user, _id })
        .then((res) => {
          if (res.err) {
            setBookData({
              ...bookData,
              err: "Unable to fetch book data",
            });
          } else {
            bookData.formData.set("title", res.msg.title);
            bookData.formData.set("author", res.msg.author);
            bookData.formData.set("category", res.msg.category._id);
            bookData.formData.set("price", res.msg.price);
            setBookData({
              ...bookData,
              title: res.msg.title,
              author: res.msg.author,
              category: res.msg.category._id,
              price: res.msg.price,
              photo: "",
              pdf: "",
              err: "",
              msg: "",
            });
          }
        })
        .catch((err) => setBookData({ ...bookData, err: "Unable to fetch book data" }));
    }
  }, []);

  const handleChange = (field) => {
    return (evnt) => {
      const value = field === "photo" || field === "pdf" ? evnt.target.files[0] : evnt.target.value;
      bookData.formData.set(field, value);
      setBookData({ ...bookData, err: "", [field]: value });
    };
  };

  const handleSubmit = (evnt) => {
    evnt.preventDefault();
    setBookData({ ...bookData, err: "", msg: "" });
    updateBook({ token, user, _id, updatedBook: bookData.formData })
      .then((res) => {
        if (res.err) {
          setBookData({ ...bookData, err: res.err, msg: "" });
        } else {
          setBookData({
            title: "",
            author: "",
            price: "",
            category: "",
            photo: "",
            pdf: "",
            err: "",
            formData: new FormData(),
            msg: "Book updated successfully",
          });
          history.push("/admin/book/manage");
        }
      })
      .catch((err) => setBookData({ ...bookData, err: "Unable to update book" }));
  };

  const handleErr = (data) => {
    if (data.err) {
      return (
        <div
          className="alert text-danger"
          role="alert"
          style={{ background: "rgba(255, 0, 0, 0.2)" }}
        >
          {data.err}
        </div>
      );
    }
  };

  const handleMsg = (data) => {
    if (data.msg) {
      return (
        <div
          className="alert text-primary"
          role="alert"
          style={{ background: "rgba(0, 0, 255, 0.2)" }}
        >
          {data.msg}
        </div>
      );
    }
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="row mt-5">
          <div className="row">
            <div className="row">
              <div className="col-12 col-md-8 col-lg-6">
                {handleErr(bookData)}
                {handleMsg(bookData)}
              </div>
            </div>
            <h3 className="col-12 col-md-8 col-lg-6 text-center mb-4">Update Book</h3>
          </div>
          <div className="col-12 col-md-8 col-lg-6">
            <form>
              <div className="form-outline mb-3">
                <input
                  type="text"
                  id="form1Example1"
                  className="form-control"
                  value={bookData.title}
                  onChange={handleChange("title")}
                />
                <label className="form-label" htmlFor="form1Example1">
                  Title
                </label>
              </div>

              <div className="form-outline mb-3">
                <input
                  type="text"
                  id="form1Example2"
                  className="form-control"
                  value={bookData.author}
                  onChange={handleChange("author")}
                />
                <label className="form-label" htmlFor="form1Example2">
                  Author
                </label>
              </div>

              <div className="form-outline mb-3">
                <select
                  className="select w-100 p-2"
                  value={bookData.category}
                  onChange={handleChange("category")}
                >
                  <option value="">Select Category</option>
                  {categories.categories.length &&
                    categories.categories.map((cate, index) => {
                      return (
                        <option value={cate._id} key={index}>
                          {cate.name}
                        </option>
                      );
                    })}
                </select>
                <label className="form-label select-label">Category</label>
              </div>

              <div className="form-group mb-3">
                <span>Cover photo</span>
                <label className="btn btn-block btn-secondary">
                  <input
                    onChange={handleChange("photo")}
                    type="file"
                    name="photo"
                    accept="image"
                    placeholder="choose a file"
                  />
                </label>
              </div>

              <div className="form-group mb-3">
                <span>Book</span>
                <label className="btn btn-block btn-secondary">
                  <input
                    onChange={handleChange("pdf")}
                    type="file"
                    name="photo"
                    accept="image"
                    placeholder="choose a file"
                  />
                </label>
              </div>

              <div className="form-outline mb-4">
                <input
                  type="text"
                  id="form1Example1"
                  className="form-control"
                  value={bookData.price}
                  onChange={handleChange("price")}
                />
                <label className="form-label" htmlFor="form1Example1">
                  Price
                </label>
              </div>

              <button type="submit" className="btn btn-info btn-block" onClick={handleSubmit}>
                Update
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default withRouter(Updatebook);
