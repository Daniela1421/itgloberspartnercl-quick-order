import React, { useState, useEffect } from "react"
import { useMutation, useLazyQuery } from "react-apollo"
import UPDATE_CART from "../graphql/updateCart.graphql"
import GET_PRODUCT from "../graphql/getProductBySku.graphql"
import { useCssHandles } from "vtex.css-handles"

import "./styles.css"

const QuickOrder = () => {
  const [inputText, setInputText] = useState("");
  const [search, setSearch] = useState("");
  const [getProductData, { data: product }] = useLazyQuery(GET_PRODUCT)
  const [addToCart] = useMutation(UPDATE_CART)

  const CSS_HANDLES = [
    "quick__order--container",
    "quick__order--title", 
    "quick__order--form",
    "quick__order--label", 
    "quick__order--input", 
    "quick__order--btn"
  ]

  const handles = useCssHandles(CSS_HANDLES)
  
  
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

  return <div className={`mb4 ${handles["quick__order--container"]}`}>
    <h2 className={handles["quick__order--title"]}>Compra rápida Kanu Pet</h2>
    <form className={`mt5 ${handles["quick__order--form"]}`} onSubmit={searchProduct}>
      <div>
        <label className={handles["quick__order--label"]} htmlFor="sku">Ingresa el número de sku</label>
        <input className={`ml5 ${handles["quick__order--input"]}`} id="sku" type="text" onChange={handleChange}></input>
      </div>
      <input className={`mt5 ${handles["quick__order--btn"]}`} type="submit" value="Añadir al Carrito"/>
    </form>
  </div>
}

export default QuickOrder