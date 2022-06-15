import React from "react";
import '../app.css';
import { client } from "..";
import { ALL_QUERY } from "../gql/Query";
import All from "./Allproducts";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Pdp from "./productsdetail/pdp";
import Cart from "./cartDetails/cartDetail";



  class App extends React.Component {
    state = { 
      products: [],
      category: 'all',
      index: 0,
      details: [],
      cartAttributes: [],
      imgIndex: 0,
      cartInfo: [],
      productsAmount: [],
      productsPrices: [],
      num: 0,
      totalAmount: 0,
      comindx: 0,
      calcImageIndex: []
    }

      getApi() {
        const fetch = async() => {
          console.log(this.state.category)
          const response = await client.query({
            query: ALL_QUERY, variables:{input: this.state.category}
          })
            this.setState({
              products: response.data.category  
            })
          }
      fetch()
    }
    UNSAFE_componentWillMount(){
      let data = window.localStorage.getItem('type')
      if(data !== null){
      data = JSON.parse(data)
      this.setState({
        category: data
      })
    }
  }

      componentDidMount(){
      this.getApi()
      
    }

      componentDidUpdate(_prevProps, prevState){
        if(this.state.category !== prevState.category){
          window.localStorage.setItem('type', JSON.stringify(this.state.category))
          this.getApi()
        }
        if(prevState.cartAttributes.length !== this.state.cartAttributes.length && 
          prevState.cartAttributes.length < this.state.cartAttributes.length){
          this.calcProductsAmount()
          this.itemsPrices(this.state.comindx)
          this.calcImageIndex()
        }
        if(prevState.productsPrices!== this.state.productsPrices){
          this.calcTotalAmount()
        }
      }

    handleChange = (value) => {
      this.setState({
        category: value
      })
    }

    valueChange = (index) => {
      this.setState({
        index: index
      })
    }

    addDetails = (product) => {
      this.setState({
        details: product
      })
    }

    imageIndex = (index) => {
      this.setState({
        imgIndex: index
      })
    }
    addToCart = (attributes) => {
      this.setState(prevState => ({
        cartAttributes: [
          ...prevState.cartAttributes,
          attributes
        ]
      })
    )
  }
    
    addTocartInfo = (details) => {
      this.setState(prevState => ({
        cartInfo: [
          ...prevState.cartInfo,
          details
        ]
      }))
    }
    
    calcProductsAmount = () => {
      this.setState(prevState => ({
        productsAmount: [
          ...prevState.productsAmount,
          1
        ]
      })
    )
  }

    itemsPrices = (comindx) => {
      this.setState(prevState => ({
        productsPrices: [
          ...prevState.productsPrices,
            this.state.cartInfo[comindx].prices[0].amount
        ]
      })
    )
      this.setState({
        comindx: comindx + 1
      })
    }

    add = (index) => {
      let amounts = [...this.state.productsAmount];
      let amount = amounts[index]
      amount = this.state.productsAmount[index] + 1
      amounts[index] = amount
        this.setState({
          productsAmount: amounts
        })
      let prices = [...this.state.productsPrices];
      let total = this.state.num
      total = this.state.cartInfo[index].prices[0].amount * amount
      prices[index] = total
        this.setState({
          productsPrices: prices
        })
    }

    reduce = (index) => {
      let amounts = [...this.state.productsAmount];
      let amount = amounts[index]
      amount = this.state.productsAmount[index] - 1
      amounts[index] = amount
        this.setState({
          productsAmount: amounts
        })
      let prices = [...this.state.productsPrices];
      let total = this.state.num
      total = prices[index] -  this.state.cartInfo[index].prices[0].amount 
      prices[index] = total
        this.setState({
          productsPrices: prices
        })
      if(amount === 0){
      let cart = [...this.state.cartInfo]
      let attributes = [...this.state.cartAttributes]
      let images = [...this.state.calcImageIndex]
      images.splice(index, 1)
      cart.splice(index, 1)
      attributes.splice(index, 1)
      amounts.splice(index, 1)
      prices.splice(index, 1)
        this.setState({
          cartInfo: cart
        })
        this.setState({
          cartAttributes: attributes,
          productsAmount: amounts,
          productsPrices: prices,
          comindx: this.state.comindx - 1,
          calcImageIndex: images
      })
      }
      
    }
    calcTotalAmount = () => {
    let prices = [...this.state.productsPrices]
    let sum = 0
      prices.map(price => {
        return(
        sum = sum + price
        )
      })  
      this.setState({
        totalAmount: sum
      })
    }

    calcImageIndex = () => {
      this.setState(prevState => ({
        calcImageIndex: [
          ...prevState.calcImageIndex,
          0
        ]
      }))
    }
    
    changeImg = (type, amount, index) => {
      let images = [...this.state.calcImageIndex]
      let image = images[index]
      if(type === 'right' && image  !== amount){
        image = this.state.calcImageIndex[index] + 1
        images[index] = image
        this.setState({
          calcImageIndex: images
        })
      }
      if(type === 'left' && image === 0){
        image = amount - 1
        images[index] = image
        this.setState({
          calcImageIndex: images
        })
      }
      else if(type === 'left' && image !== 0){
        image = this.state.calcImageIndex[index] - 1
        images[index] = image
        this.setState({
          calcImageIndex: images
        })
      }
      if(type === 'right' && image  === amount){
        image = 0
        images[index] = image
        this.setState({
          calcImageIndex: images
        })
      }
    }

    render() {
      console.log(this.state.cartInfo)
      console.log(this.state.cartAttributes)
    return (
      <div>
        <BrowserRouter> 
          <Routes>
          <Route  
          path={this.state.category === 'all'? '/': this.state.category}
          exact element= {
            <All   
              categoryAll={this.state.products}
              value={this.state.category}
              index={this.state.index}
              onvalueChange={this.valueChange}
              onhandleChange={this.handleChange}
              addDetails={this.addDetails}
              selectedAttributes={this.state.cartAttributes}
              addToCart={this.addToCart}
              addToCartInfo={this.addTocartInfo}
              cartDetails={this.state.cartInfo}
              productsAmount={this.state.productsAmount}
              add={this.add}
              reduce={this.reduce}
              itemsPrices={this.itemsPrices}
              productsPrices={this.state.productsPrices}
              total={this.state.totalAmount}
            />
          } 
        />
          <Route 
            path="/details" 
            exact element= {
            <Pdp 
              categoryAll={this.state.products}
              onvalueChange={this.valueChange}
              onhandleChange={this.handleChange}
              selectedAttributes={this.state.cartAttributes}
              cartDetails={this.state.cartInfo}
              details={this.state.details}
              index={this.state.index}
              addToCart={this.addToCart}
              imageIndex={this.imageIndex}
              imgIndex={this.state.imgIndex}
              addToCartInfo={this.addTocartInfo}
              productsAmount={this.state.productsAmount}
              add={this.add}
              reduce={this.reduce}
              itemsPrices={this.itemsPrices}
              productsPrices={this.state.productsPrices}
              total={this.state.totalAmount}
              />
              }
            />
            <Route
            path="/cart" 
            exact element={
            <Cart 
              categoryAll={this.state.products}
              onvalueChange={this.valueChange}
              onhandleChange={this.handleChange}
              imgIndex={this.state.imgIndex}
              selectedAttributes={this.state.cartAttributes}
              cartDetails={this.state.cartInfo}
              index={this.state.index}
              productsAmount={this.state.productsAmount}
              add={this.add}
              reduce={this.reduce}
              itemsPrices={this.itemsPrices}
              productsPrices={this.state.productsPrices}
              total={this.state.totalAmount}
              imageIndex={this.state.calcImageIndex}
              changeImg={this.changeImg}
            />
            }
          />
          </Routes>
        </BrowserRouter>
      </div>
    )
  } 
}




export default App;