import React from 'react';
import AddFishForm from './AddFishForm';
import base from '../base'

class Inventory extends React.Component {
  constructor() {
    super();
    this.renderLogin = this.renderLogin.bind(this);
    this.renderInventory = this.renderInventory.bind(this);
    this.authenticate = this.authenticate.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.authHandler = this.authHandler.bind(this);
    this.logout = this.logout.bind(this);
    this.state = {
      uid: null,
      owner: null
    }
  }

  componentDidMount() {
    base.onAuth((user) => {
      if(user) {
        this.authHandler(null, { user });
      }
    });
  }

  logout() {
    base.unauth();
    this.setState({ uid: null });
  }

  handleChange(e, key) {
    const fish = this.props.fishes[key]
    const updatedFish = {
      ...fish,
      [e.target.name]: e.target.value
    }
    this.props.updateFish(key, updatedFish);
  }

  renderLogin() {
    return (
      <nav className="login">
        <h2>Inventory</h2>
        <p>Sign in to manage your store's inventory</p>
        <button className="github" onClick={() => this.authenticate('github')}>Log In with Github</button>
        <button className="facebook" onClick={() => this.authenticate('facebook')} >Log In with Facebook</button>
        <button className="twitter" onClick={() => this.authenticate('twitter')} >Log In with Twitter</button>
      </nav>
    )
  }

  authenticate(provider) {
    base.authWithOAuthPopup(provider, this.authHandler);
  }

  authHandler(error, authData) {
    if(error) {
      console.error(error);
      return;
    }

    const storeRef = base.database().ref(this.props.storeId);

    storeRef.once('value', (snapshot) => {
      const data = snapshot.val() || {};

      if(!data.owner) {
        storeRef.set({
          owner: authData.user.uid
        });
      }

      this.setState({
        uid: authData.user.uid,
        owner: data.owner || authData.user.uid
      });
    })
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
        <button onClick={() => this.props.removeFish(key)}>Remove Fish</button>
      </div>
    )
  }

  render() {
    const logout = <button onClick={this.logout}>Log Out</button>

    if(!this.state.uid) {
      return <div>{this.renderLogin()}</div>
    }

    if(this.state.uid !== this.state.owner) {
      return(
        <div>
          <p>Sorry you aren't the owner of the store!</p>
          {logout}
        </div>
      )
    }

    return(
      <div>
        <h2>Inventory</h2>
        {Object.keys(this.props.fishes).map(this.renderInventory)}
        <AddFishForm addFish={this.props.addFish}/>
        <button onClick={this.props.loadSamples}>Load Sample Fishes</button>
        {logout}
      </div>
    )
  }
}

Inventory.propTypes = {
  updateFish: React.PropTypes.func.isRequired,
  removeFish: React.PropTypes.func.isRequired,
  addFish: React.PropTypes.func.isRequired,
  loadSamples: React.PropTypes.func.isRequired,
  fishes: React.PropTypes.object.isRequired,
  storeId: React.PropTypes.string.isRequired
};

export default Inventory;
