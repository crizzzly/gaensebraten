import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { MyContext } from "./context";
import Ingredients from "./Ingredients";

class Receipt extends Component {
  slider = React.createRef();
  render() {
    if (!this.props.active) return <Redirect to={`/receipts`} />;
    
    return (
      <div className="deck">
        <div className="wrap">
          <h1>{this.props.active.title}</h1>
          <Ingredients active={this.props.active}/>

          <MyContext.Consumer>
            {context => {
              const { dispatch } = context;
              return (
                <div>
                  <div className="slider">
                    <div className="">
                      <button>-</button>5 min.
                      <button>+</button>
                    </div>
                    <br />
                  </div>
                  Change cookingtime:
                  <input
                    ref={this.slider}
                    className="bar"
                    onChange={e =>
                      dispatch({
                        type: "changeTime",
                        value: this.slider.current.value
                      })
                    }
                    type="range"
                    id="rangeinput"
                  />
                </div>
              );
            }}
          </MyContext.Consumer>
        </div>
      </div>
    );
  }
}

export default Receipt;
