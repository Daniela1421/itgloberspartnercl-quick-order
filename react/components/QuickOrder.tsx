import React, { useState, useEffect } from "react"
import { useMutation, useLazyQuery } from "react-apollo"
import UPDATE_CART from "../graphql/updateCart.graphql"
import GET_PRODUCT from "../graphql/getProductBySku.graphql"

const QuickOrder = () => {
  const [inputText, setInputText] = useState("");
  const [search, setSearch] = useState("");
  const [getProductData, { data: product }] = useLazyQuery(GET_PRODUCT)
  const [addToCart] = useMutation(UPDATE_CART)

  const handleChange = (evt: any) => {
    setInputText(evt.target.value)
    console.log("input changed", inputText);
  }

  useEffect(() => {
    console.log("El resulado de mi producto es:", product, search)
    if(product){
      let skuId = parseInt(inputText)
      addToCart({
        variables: {
          salesChannel: "1", 
          items: [
            {
              id: skuId,
              quantity: 1, 
              seller: "1" 
            }
          ]
        }
      })
      .then(() => {
        window.location.href = "/checkout"
      })
    }
  }, [product, search])

  const addProductToCart = () =>{
    getProductData({
      variables:{
        sku: inputText
      }
    })
  }

  const searchProduct = (evt: any) => {
    evt.preventDefault(); 
   if(!inputText){
    alert("ingresa algo")
   } else {
    setSearch(inputText)
    addProductToCart()
   }
  }

  return <div>
    <h2>Compra rápida Kanu Pet</h2>
    <form onSubmit={searchProduct}>
      <div>
        <label htmlFor="sku">Ingresa el número de sku</label>
        <input id="sku" type="text" onChange={handleChange}></input>
      </div>
      <input type="submit" value="añadir al carrito"/>
    </form>
  </div>
}

export default QuickOrder