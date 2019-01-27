import React, { Component } from "react";

class Ingredients extends Component {
  render() {
    const ingredientsList = this.props.active.ingredients.map(i => (
      <li>{i}</li>
    ))

    return (
      <div className="Ingredients">
        {ingredientsList}
      </div>
    );
  }
}

export default Ingredients;