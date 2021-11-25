import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import { isAuthenticated } from "../helper/auth";
import BarGraph from "./BarGraph";
import DoughnutGraph from "./DoughnutGraph";
import Navbar from "../Navbar";
import { getCategories } from "../helper/admin";

const DashBoard = ({ history }) => {
  const [categories, setCategories] = useState([]);
  const [demands, setDemands] = useState([]);
  const [booksPerCategory, setBooksPerCategory] = useState([]);

  const { token, user } = isAuthenticated();
  useEffect(() => {
    if (!token || !user || user.role !== 0) {
      history.push("/signin");
    } else {
      getCategories(token)
        .then((res) => {
          if (res.err) {
            console.log(res.err);
          } else {
            setCategories(res.msg.map((category, index) => category.name));
            setDemands(res.msg.map((category, index) => category.count));
            setBooksPerCategory(res.msg.map((category, index) => category.noOfBooks));
          }
        })
        .catch((err) => console.log(err));
    }
  }, []);

  return (
    <>
      <Navbar />
      <div className="container-fluid">
        <div className="row">
          <BarGraph
            labels={categories}
            values={demands}
            legend="Demand"
            title="Demand of different categories"
          />
          <br />
          <br />
          <br />
          <br />
          <DoughnutGraph
            labels={categories}
            values={booksPerCategory}
            legend="Books Count"
            title="No of books in each category"
          />
        </div>
      </div>
    </>
  );
};

export default withRouter(DashBoard);
