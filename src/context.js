import React, { Component } from "react";

// 1st, make a new context
export const MyContext = React.createContext();

const reducer = (state, action) => {
  switch (action.type) {
    case "changeTime":
      return {
        ...state,
        time: action.value
      };
    case "DECREMENT_Y":
      return {
        ...state,
        y: state.y - 1
      };
    default:
      return state;
  }
};

// 2nd, create a provider component
export class MyProvider extends Component {
  state = {
    time: 0,
    y: 0,
    dispatch: action => {
      this.setState(state => reducer(state, action));
    },
    receipts: [
      {
        title: "Gaensebraten",
        ingredients: ["Semmelknödel", "Rotkohl", "Rotkohl"]
      },
      {
        title: "Gegrillter Lachs",
        ingredients: ["Ratatouille", "Kräuter-Kartoffel", "Zitrone"]
      },
      {
        title: "Pute Piccata",
        ingredients: ["Semmelknödel", "Rotkohl"]
      },
      {
        title: "Semmelknödel",
        ingredients: ["Semmelbroesel", "Knoedel", "Handruehrgeraet", "Liebe"]
      }
    ],
  };

  // we return a context provider
  render() {
    return (
      // <MyContext.Provider value="I am the value">
      <MyContext.Provider value={this.state}>
        {this.props.children}
      </MyContext.Provider>
    );
  }
}
