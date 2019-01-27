import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { MyContext } from "./context";
import Ingredients from "./Ingredients";
import Setting from "./Setting";

class Receipt extends Component {
  slider = React.createRef();
  render() {
    if (!this.props.active) return <Redirect to={`/receipts`} />;
    
    return (
      <div className="deck">
        <div className="wrap">
          <h1>{this.props.active.title}</h1>
          <Ingredients active={this.props.active}/>

        <Setting/>
        </div>
      </div>
    );
  }
}

export default Receipt;
