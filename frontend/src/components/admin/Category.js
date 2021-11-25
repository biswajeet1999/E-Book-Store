import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import { createCategory, getCategories, deleteCategory, editCategory } from "../helper/admin";
import { isAuthenticated } from "../helper/auth";
import Navbar from "../Navbar";

const Category = ({ history }) => {
  const [data, setData] = useState({
    category: "",
    err: "",
    msg: "",
    needToFetchAllCategory: false,
  });
  const { category } = data;

  const [categoriesData, setCategoriesData] = useState({
    categories: [],
    err: "",
    msg: "",
  });

  const [updateCategory, setUpdateCategory] = useState({
    _id: "",
    name: "",
    err: "",
    msg: "",
  });

  const { token, user } = isAuthenticated();

  useEffect(() => {
    if (!user || !token || user.role !== 0) {
      history.push("/signin");
    } else {
      // get all categories from server
      getCategories(token)
        .then((res) => {
          if (res.err) {
            setCategoriesData({ ...categoriesData, err: res.err, msg: "" });
          } else {
            setCategoriesData({
              ...categoriesData,
              categories: res.msg,
              err: "",
            });
          }
          setData({ ...data, needToFetchAllCategory: false });
        })
        .catch((err) => {
          setCategoriesData({
            ...categoriesData,
            err: "Unable to get Categories",
            msg: "",
          });
        });
    }
  }, [data.needToFetchAllCategory]);

  const handleChange = (event) => {
    setData({ ...data, category: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setData({ ...data, err: "", msg: "" });
    createCategory({ category, user, token })
      .then((res) => {
        if (res.err) {
          setData({ ...data, err: res.err, msg: "" });
        } else {
          setData({
            category: "",
            err: "",
            msg: res.msg,
            needToFetchAllCategory: true,
          });
        }
      })
      .catch((err) => {
        console.log(err);
        setData({ ...data, msg: "", err: "unable to create product" });
      });
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
          className="alert  text-primary"
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
        {/* Create category */}
        <div className="row mt-3">
          <h3 className="col-12 text-center create-category-heading mt-4">
            You can create your category here
          </h3>
          <div className="col-11 col-md-8 col-lg-6">
            <div className="form-outline mb-4 pt-2">
              {handleErr(data)}
              {handleMsg(data)}
              <label className="form-label my-2" htmlFor="form1Example1">
                Create Category
              </label>
              <input
                type="email"
                id="form1Example1"
                className="form-control"
                value={category}
                onChange={handleChange}
              />
              <div className="row mx-auto">
                <button type="button" className="btn btn-info mt-4" onClick={handleSubmit}>
                  create
                </button>
              </div>
            </div>
          </div>
        </div>
        <hr />
        {/* delete and update category */}

        <div className="row">
          <h3 className="col-12 text-center create-category-heading my-4">
            You can manage your categories here
          </h3>
          <div className="col-12">
            {/* <!-- Modal --> */}
            <div
              className="modal fade"
              id="exampleModal"
              tabIndex="-1"
              aria-labelledby="exampleModalLabel"
              aria-hidden="true"
            >
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title" id="exampleModalLabel">
                      Update Category
                    </h5>
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div className="modal-body">
                    <input
                      type="text"
                      className="form-control"
                      value={updateCategory.name}
                      onChange={(evnt) =>
                        setUpdateCategory({
                          ...updateCategory,
                          name: evnt.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-primary"
                      data-dismiss="modal"
                      onClick={() => {
                        editCategory({ token, user, updateCategory })
                          .then((res) => {
                            if (res.err) {
                              setUpdateCategory({
                                _id: "",
                                name: "",
                                err: res.err,
                                msg: "",
                              });
                            } else {
                              setUpdateCategory({
                                _id: "",
                                name: "",
                                err: "",
                                msg: res.msg,
                              });
                              setData({
                                ...data,
                                needToFetchAllCategory: true,
                              });
                            }
                          })
                          .catch((err) => console.log(err));
                      }}
                    >
                      Save changes
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {handleErr(categoriesData)}
            {handleMsg(categoriesData)}
            {handleErr(updateCategory)}
            {handleMsg(updateCategory)}

            <table className="table table-hover category-table">
              <thead style={{ backgroundColor: "#1E88E5g" }}>
                <tr>
                  <th scope="col">sl</th>
                  <th scope="col">Categories</th>
                  <th scope="col">Demand</th>
                  <th scope="col">Update</th>
                  <th scope="col">Delete</th>
                </tr>
              </thead>
              <tbody>
                {categoriesData.categories.map((cate, index) => {
                  return (
                    <tr key={index}>
                      <th scope="row">{index + 1}</th>
                      <td>{cate.name}</td>
                      <td>{cate.count}</td>
                      <td>
                        <i
                          className="fa fa-pencil category-update text-info"
                          data-toggle="modal"
                          data-target="#exampleModal"
                          aria-hidden="true"
                          onClick={() => {
                            // set the id of category
                            setUpdateCategory({
                              _id: cate._id,
                              name: "",
                              msg: "",
                              err: "",
                            });
                          }}
                        ></i>
                      </td>
                      <td className="px-4">
                        <i
                          className="fa fa-trash-o category-delete text-danger"
                          aria-hidden="true"
                          onClick={() => {
                            deleteCategory({ token, user, category: cate })
                              .then((res) => {
                                if (res.err) {
                                  setCategoriesData({
                                    ...categoriesData,
                                    err: res.err,
                                    msg: "",
                                  });
                                } else {
                                  setCategoriesData({
                                    ...categoriesData,
                                    err: "",
                                    msg: "Category deleted successfully",
                                  });
                                  setData({
                                    ...data,
                                    needToFetchAllCategory: true,
                                  });
                                }
                              })
                              .catch((err) =>
                                setCategoriesData({
                                  ...categoriesData,
                                  err: "Unable to delete category",
                                  msg: "",
                                })
                              );
                          }}
                        ></i>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default withRouter(Category);
