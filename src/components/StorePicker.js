import React from "react";

class StorePicker extends React.Component {
  render() {
    return (
      <form className="store">
        <h2> Please return a store</h2>
        <input type="text" required placeholder="Store Name"/>
        <button type="submit">Visit Store</button>
      </form>
    )
  };
};

export default StorePicker;
