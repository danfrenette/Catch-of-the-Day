import React from 'react';
import AddFishForm from './AddFishForm';

class Inventory extends React.Component {
  constructor() {
    super();
    this.renderInventory = this.renderInventory.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e, key) {
    const fish = this.props.fishes[key]
    const updatedFish = {
      ...fish,
      [e.target.name]: e.target.value
    }
    this.props.updateFish(key, updatedFish);
  }

  renderInventory(key) {
    const fish = this.props.fishes[key]
    return(
      <div className="fish-edit" key={key}>
        <input onChange={(e) => this.handleChange(e, key)} type="text" name="name" value={fish.name} placeholder="Fish Name"/>
        <input onChange={(e) => this.handleChange(e, key)} name="price" type="text" value={fish.price} placeholder="Fish Price"/>
        <select onChange={(e) => this.handleChange(e, key)} name="status" value={fish.status}>
          <option value="available">Fresh!</option>
          <option value="unavailable">Sold Out!</option>
        </select>
        <textarea onChange={(e) => this.handleChange(e, key)} name="desc" value={fish.desc} type="text" placeholder="Fish Desc"/>
        <input onChange={(e) => this.handleChange(e, key)} name="image" value={fish.image} type="text" placeholder="Fish Image"/>
      </div>
    )
  }

  render() {
    return(
      <div>
        <h2>Inventory</h2>
        {Object.keys(this.props.fishes).map(this.renderInventory)}
        <AddFishForm addFish={this.props.addFish}/>
        <button onClick={this.props.loadSamples}>Load Sample Fishes</button>
      </div>
    )
  }
}

export default Inventory;
