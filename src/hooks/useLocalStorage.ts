import { useState } from "react"
import type { UserData } from "../types"

//  const now = new Date()
//  const expiryDate = new Date()
//  expiryDate.setDate(now.getDate() + 10)

//  const item = {
//    token: token,
//    expiryDate: expiryDate,
//  }
//  localStorage.setItem("productTableAuth", JSON.stringify(item))

//  const tokenItemData = localStorage.getItem("productTableAuth")
//  if (!tokenItemData) {
//    console.log("no saved token item")
//    setLoginToken(null)
//    return
//  }

//  const tokenItem = JSON.parse(tokenItemData)
//  const now = new Date()
//  if (now > tokenItem.expiryDate) {
//    localStorage.removeItem("productTableAuth")
//    return
//  }
//  setLoginToken(tokenItem.token)
//  setLoggedIn(true)

export const useLocalStorage = (keyName: string) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const value = window.localStorage.getItem(keyName)
      if (value) {
        const parsedValue = JSON.parse(value)
        const now = new Date()
        if (parsedValue.expiryDate && now > new Date(parsedValue.expiryDate)) {
          // Clear expired data from local storage
          window.localStorage.removeItem(keyName)
          return null
        }
        return parsedValue
      } else {
        return null
      }
    } catch (err) {
      return null
    }
  })
  const setValue = (newValue: UserData) => {
    try {
      if (newValue === null) {
        window.localStorage.removeItem(keyName)
        setStoredValue(null)
        return
      }
      const now = new Date()
      const expiryDate = new Date()
      expiryDate.setDate(now.getDate() + 10)
      const updatedValue = {
        ...newValue,
        expiryDate,
      }
      window.localStorage.setItem(keyName, JSON.stringify(updatedValue))
    } catch (err) {}
    setStoredValue(newValue)
  }
  return [storedValue, setValue]
}
