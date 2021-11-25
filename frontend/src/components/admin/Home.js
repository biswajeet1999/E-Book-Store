import React, { useEffect, useState } from "react";
import { isAuthenticated } from "../helper/auth";
import { withRouter } from "react-router-dom";
import Navbar from "../Navbar";
import { getInfo } from "../helper/admin";

const Home = ({ history }) => {
  const { token, user } = isAuthenticated();
  const [info, setInfo] = useState({
    noOfUsers: 0,
    noOfBooks: 0,
    noOfCategories: 0,
    noOfBlockedUsers: 0,
  });

  useEffect(() => {
    if (!user || !token || user.role !== 0) {
      history.push("/signin");
    } else {
      getInfo({ token, user })
        .then((res) => {
          if (res.err) {
            console.log(res.err);
          } else {
            setInfo(res);
          }
        })
        .catch((err) => console.log(err));
    }
  }, []);

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="row">
          <div className="col-12 text-center">
            <h1 className="mt-5 mb-3  text-primary">Welcome to Admin Dash Board</h1>
            <h3>Manage your Library </h3>
          </div>

          <div className="row">
            <div className="col-12 col-md-7 col-lg-6 mx-auto my-5 py-5">
              <ul className="list-group">
                <li
                  className="list-group-item d-flex align-items-center justify-content-center"
                  style={{ backgroundColor: "rgba(50, 110, 220, 0.3)" }}>
                  <i class="fa fa-user" aria-hidden="true"></i>
                  &nbsp; {user.name}
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  Total Categories
                  <span className="badge bg-secondary rounded-pill">{info.noOfCategories}</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  Total Books
                  <span className="badge bg-secondary rounded-pill">{info.noOfBooks}</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  Total Users
                  <span className="badge bg-secondary rounded-pill">{info.noOfUsers}</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  Total Blocked Users
                  <span className="badge bg-secondary rounded-pill">{info.noOfBlockedUsers}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default withRouter(Home);
