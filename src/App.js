import React, { Component } from "react";
import helpers from './helpers/helpers';
import TableContainer from './components/TableContainer/TableContainer';

import "./App.css";

class App extends Component {
  state = {
    searchTerm: '',
    data: [],
    filteredData: [],
    total: 0,
    isLoaded: false,
    error: null
  }

  changedHandler = (el) => {
    //input change handler, realtime typing filter
    const value = el.target.value;
    const filteredData = this.state.data.filter((item) => item.name.toLowerCase().includes(value.toLowerCase())); // don't need to spread array - filter returns new array
    const newTotal = this.totalAmount(filteredData);

    this.setState({
      searchTerm: value, 
      filteredData: filteredData, 
      total: newTotal
    });
  }

  dataAggregator() {
    // central function that takes all data, runs sorting and de-duping 
    const newData = [...this.state.data]; //array is reference type - this creates a copy of array for manipulation
    const uniqueArray = [];
    let newTotal = 0;

    newData.sort( function( prev, next ) {
        // sorting array alphabetically
        prev = prev.name.toLowerCase();
        next = next.name.toLowerCase();
    
        return prev < next ? -1 : prev > next ? 1 : 0;
    }).forEach((product)=> { 
        // de-duping array
        const duplicate = uniqueArray.filter(item => item.id === product.id);
        (duplicate.length > 0) ? duplicate[0].sold += product.sold : uniqueArray.push(product);
    });

    newTotal = this.totalAmount(uniqueArray);

    this.setState({
      data: uniqueArray,
      total: newTotal
    });
  }

  totalAmount = (data) => {
    // gets total amount based on data
    let sumAmount = 0;
    
    data.map(product => sumAmount += (product.sold * product.unitPrice));
    sumAmount = helpers.formatNumber(sumAmount);

    return sumAmount;
  }

  // react default lifecycles
  //-------------------------

  componentDidMount() {
    Promise.all([
      fetch("api/branch1.json").then(value => value.json()),
      fetch("api/branch2.json").then(value => value.json()),
      fetch("api/branch3.json").then(value => value.json())
    ])
    .then(response => {
      const mainData = [];

      response.map(data => mainData.push(...data.products));

      this.setState({
        data: mainData
      });
    })
    .then(() => {
      this.dataAggregator();

      this.setState({
        isLoaded: true
      })
    })
    .catch((err) => {
      this.setState({
        isLoaded: true,
        error: err
      });
    });
  }

  render() {
    const dataHolder = this.state.filteredData.length > 0 ? this.state.filteredData : this.state.data;

    return (
      <section className="product-list">
        <input type="text" placeholder="Search products" onChange={this.changedHandler} value={this.state.searchTerm} />
        
      {
      !this.state.isLoaded ?
        <p>Loading...</p> 
      : 
        !this.state.error ? <TableContainer total={this.state.total} productData={dataHolder} /> : <p>Something went wrong...</p>
      }

      </section>
    );
  }
}

export default App;
