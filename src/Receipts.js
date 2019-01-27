import React, { Component } from "react";
import Decks from "./Decks";
import { Redirect } from "react-router-dom";
import { MyContext } from "./context";

class Receipts extends Component {
  render() {
    if (this.props.active)
      return (
        <Redirect to={`/recipe/${this.props.active.title.toLowerCase()}`} />
      );

    return (
      <div className="Receipts">
        <div className="card-deck">
          <MyContext.Consumer>
            {context => (
              <Decks
                notification={this.props.notification}
                acceptRecipe={this.props.acceptRecipe}
                receipts={context.receipts}
              />
            )}
          </MyContext.Consumer>
        </div>
      </div>
    );
  }
}

export default Receipts;
