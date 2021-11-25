import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import { getCategories, createBook } from "../helper/admin";
import { isAuthenticated } from "../helper/auth";
import Navbar from "../Navbar";
import Category from "./Category";

const CreateBook = ({ history }) => {
  const [categories, setCategories] = useState({
    categories: [],
    err: "",
  });

  const [data, setData] = useState({
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

  useEffect(() => {
    if (!token || !user || user.role !== 0) {
      history.push("/signin");
    } else {
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
    }
  }, []);

  const handleChange = (field) => {
    return (evnt) => {
      const value = field === "photo" || field === "pdf" ? evnt.target.files[0] : evnt.target.value;
      data.formData.set(field, value);
      setData({ ...data, err: "", [field]: value });
    };
  };

  const handleSubmit = (evnt) => {
    evnt.preventDefault();
    setData({ ...data, err: "", msg: "" });
    createBook({ token, user, formData: data.formData })
      .then((res) => {
        if (res.err) {
          setData({ ...data, err: res.err, msg: "" });
        } else {
          setData({
            title: "",
            author: "",
            price: "",
            category: "",
            photo: "",
            pdf: "",
            err: "",
            formData: new FormData(),
            msg: "Book created successfully",
          });
        }
      })
      .catch((err) => setData({ ...data, err: "Unable to create book" }));
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
                {handleErr(data)}
                {handleMsg(data)}
              </div>
            </div>
            <h3 className="col-12 col-md-8 col-lg-6 text-center mb-4">Create New Book</h3>
          </div>
          <div className="col-12 col-md-8 col-lg-6">
            <form>
              <div className="form-outline mb-3">
                <input
                  type="text"
                  id="form1Example1"
                  className="form-control"
                  value={data.title}
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
                  value={data.author}
                  onChange={handleChange("author")}
                />
                <label className="form-label" htmlFor="form1Example2">
                  Author
                </label>
              </div>

              <div className="form-outline mb-3">
                <select
                  className="select w-100 p-2"
                  value={data.category}
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
                  value={data.price}
                  onChange={handleChange("price")}
                />
                <label className="form-label" htmlFor="form1Example1">
                  Price
                </label>
              </div>

              <button type="submit" className="btn btn-primary btn-block" onClick={handleSubmit}>
                Create
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default withRouter(CreateBook);
