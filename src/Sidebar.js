import React, { Component } from "react";
import { MyContext } from "./context";

class Sidebar extends Component {
  render() {
    return (
      <div className="Sidebar py-5">
        <MyContext.Consumer>
          {context => {
            const totalCookingTime = context.receipts.reduce((accu, receipt) => receipt.time + accu, 0)
            const theHeight = (context.totalTime !== 0) ? (context.totalTime / totalCookingTime) * 100 : 0;
            return (
              <div className=" bg-white d-flex h-75 justify-content-center mw-3 overflow-hidden position-relative rounded-left text-center z-index-0">
                 <span className="z-index-1 text-white">
                  {context.totalTime} m
                </span>
                <span
                  className="bg-primary text-white w-100 position-absolute top-0 z-index-minus-1 top"
                  style={{
                    minHeight: "3em",
                    height: theHeight + "%",
                    transition: "height 0.3s ease 0s"
                  }}
                />
              </div>
            );
          }}
        </MyContext.Consumer>
      </div>
    );
  }
}

export default Sidebar;
