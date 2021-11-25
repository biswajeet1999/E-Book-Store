import React from "react";
import { Doughnut } from "react-chartjs-2";

const DoughnutGraph = ({ labels, values, legend, title }) => {
  const colors = [
    "rgba(255,99,132,0.2)",
    "rgba(255,132,99,0.2)",
    "rgba(60,132,99,0.2)",
    "rgba(60,132,220,0.2)",
    "rgba(132,0,220,0.2)",
    "rgba(150,160,220,0.2)",
    "rgba(200,75,153,0.2)",
  ];
  const data = {
    labels: labels,
    datasets: [
      {
        label: legend,
        data: values,
        backgroundColor: [...Array(labels.length).keys()].map((i) => colors[i % colors.length]),
        borderWidth: 1,
        hoverBackgroundColor: "rgba(0,0,0,0.2)",
        hoverBorderWidth: 2,
      },
    ],
  };
  const options = {
    title: {
      display: true,
      text: title,
      fontSize: 30,
    },
    legend: {
      display: true,
      position: "top",
      fullWidth: true,
      reverse: false,
      labels: {
        fontColor: "rgb(255, 99, 132)",
      },
    },
    layout: {
      padding: {
        // left: 50,
        // right: 50,
        // top: 10,
        // bottom: 0,
      },
    },
    tooltips: {
      enabled: true,
    },
  };
  return (
    <>
      <div className="col-12 col-lg-8 mx-auto my-5 py-5">
        <Doughnut data={data} options={options} />
      </div>
    </>
  );
};

export default DoughnutGraph;
