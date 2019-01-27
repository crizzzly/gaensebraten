import React, { Component } from "react";
import Decks from "./Decks";
import Sidebar from "./Sidebar";
import { Redirect } from "react-router-dom";
import { MyContext } from "./context";

class Receipts extends Component {
  render() {
    return (
      <div className="Receipts h-100 d-flex ">
        <>
          <div className="cards-deck d-flex flex-column  align-items-center flex-grow-1">
            <MyContext.Consumer>
              {context => {
                const { dispatch } = context;
                return (
                  <Decks
                    notification={this.props.notification}
                    dispatch={dispatch}
                    receipts={context.receipts}
                  />
                );
              }}
            </MyContext.Consumer>
          </div>
          <Sidebar />

        </>
      </div>
    );
  }
}

export default Receipts;
