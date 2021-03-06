import React, { Component } from "react";
import MyToken from "./contracts/MyToken.json";
import MyTokenSale from "./contracts/MyTokenSale.json";
// import KycContract from "./contracts/KycContract.json"; 
import getWeb3 from "./getWeb3";
// import ipfs from "./ipfs";


// <script src="https://cdn.jsdelivr.net/npm/web3@latest/dist/web3.min.js"></script> // same as import getWeb3?

import "./App.css";


class App extends Component {
  state = { loaded: false, kycAddress: "0x123", tokenSaleAddress: "", userTokens: 0};
  

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      this.web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      this.accounts = await this.web3.eth.getAccounts();

      // Get the contract instance.
      this.networkId = await this.web3.eth.net.getId();
      
     
      this.myToken = new this.web3.eth.Contract(
        MyToken.abi,
        // MyToken.networks[this.networkId] && MyToken.networks[this.networkId].address,
        MyToken.networks[this.networkId] && '0xeef5cC136C5D90d2b298ee607A952b19ff478bc8',
        );
        

        this.myTokenSale = new this.web3.eth.Contract( MyTokenSale.abi,
          MyTokenSale.networks[this.networkId] && MyTokenSale.networks[this.networkId].address,
          );

          /*
          this.kycContract = new this.web3.eth.Contract(
          KycContract.abi,
          KycContract.networks[this.networkId] && KycContract.networks[this.networkId].address,
          );
          */

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      // this.listenToTokenTransfer();
      this.setState({ loaded:true, tokenSaleAddress: this.myTokenSale._address }, this.updateUserTokens);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
    
  };

  

  runExample = async () => {
    const { accounts, contract } = this.state;

    // Stores a given value, 5 by default.
    await contract.methods.set(5).send({ from: accounts[0] });

    // Get the value from the contract to prove it worked.
    const response = await contract.methods.get().call();

    // Update state with the result.
    this.setState({ storageValue: response });
  };

  handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value; const name = target.name;
    this.setState({
        [name]: value
    });
  }

  /* 
  handleKycSubmit = async () => {
    const {kycAddress} = this.state;
    await this.kycContract.methods.setKycCompleted(kycAddress).send({from: this.accounts[0 ]});
    alert("Account "+kycAddress+" is now whitelisted");
    }
    */

    handleBuyToken = async () => {
      await this.myTokenSale.methods.buyTokens(this.accounts[0]).send({from: this.accounts[0]
      , value: 1e18});
      }

      updateUserTokens = async() => {
      let userTokens = await this.myToken.methods.balanceOf(this.accounts[0]).call();
      this.setState({userTokens: userTokens}); }
      

       listenToTokenTransfer = async() => {
        this.myToken.events.Transfer({to: this.accounts[0]}).on("data", this.updateUserTokens);
        } 

    
  render() {
    if (!this.state.loaded) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      
      <div className="App">

<br />
       <div className="tweet"> <img src="https://gateway.pinata.cloud/ipfs/QmVxZCAvxab8bUhaScwqw6NWABmqz4jmjJ3qnYUbdKweEf/trips_T_logo256x256.png" alt="logo" width="100px"></img>
       </div>
        
       <h1 className="tweet2">Welcome to this Test Token Sale<br /><i>by Luca</i></h1>
     
   
       <h3 className="tweet">1) Switch Metamask to Ropsten Network<br /></h3>
       <br />
       <div className="tweet"><img src="ropsten.png"></img></div>

       <br />
       <h3 className="tweet">2) Get some test ETH <a target ="_blank" href="https://faucet.ropsten.be/">here</a></h3>
       <br />
       <div className="tweet"><img src="eth.png" width="100px"></img></div>
       <br />
    <h2 className="tweet3">Rate: 1000 TRIPS2 for 1 ETH</h2>

    <h1 className="tweet2">Buy TRIPS2 in two ways:</h1>
    
    <h4 className="tweet">A) Click on the button below and get a 1000 TRIPS2</h4><br />
    <button className="button" type="button" onClick={this.handleBuyToken}>Buy 1000 Tokens with 1 ETH</button><br />
    <br /> <br />
    <h1 className="tweet2">OR</h1>
    <br /> <br />

    <br /><h4 className="tweet">B) Send ETH to this address and buy the amount you want: {this.state.tokenSaleAddress}</h4><br />

    <h5 className="tweet"> 1 ETH = 1000 TRIPS2, 0.1 ETH = 100, 0.001 ETH = 10, 0.0001 ETH = 1</h5>
 <br /><br /><br /><br />
 <h3 className="tweet2">That's it. That's what I can do.</h3>
 <br /><br />
  
      </div>

      
    );

    


  }
}

export default App;
