import { useState, useEffect } from "react"

let crypto: Crypto

if (typeof window === "undefined") {
  // Server-side
  import("crypto").then((module) => {
    crypto = module.webcrypto as unknown as Crypto
  })
} else {
  // Client-side
  crypto = window.crypto
}

export async function encryptData(text: string): Promise<string> {
  if (!crypto) {
    console.warn("Crypto not available, returning plain text")
    return text
  }

  const encoder = new TextEncoder()
  const data = encoder.encode(text)

  const key = await crypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, true, ["encrypt", "decrypt"])

  const iv = crypto.getRandomValues(new Uint8Array(12))
  const encryptedData = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, data)

  const exportedKey = await crypto.subtle.exportKey("raw", key)
  const encryptedArray = new Uint8Array(iv.length + encryptedData.byteLength + exportedKey.byteLength)
  encryptedArray.set(iv, 0)
  encryptedArray.set(new Uint8Array(encryptedData), iv.length)
  encryptedArray.set(new Uint8Array(exportedKey), iv.length + encryptedData.byteLength)

  return btoa(String.fromCharCode.apply(null, encryptedArray as unknown as number[]))
}

export async function decryptData(encryptedText: string): Promise<string> {
  if (!crypto) {
    console.warn("Crypto not available, returning encrypted text")
    return encryptedText
  }

  const encryptedArray = Uint8Array.from(atob(encryptedText), (c) => c.charCodeAt(0))
  const iv = encryptedArray.slice(0, 12)
  const encryptedData = encryptedArray.slice(12, -32)
  const exportedKey = encryptedArray.slice(-32)

  const key = await crypto.subtle.importKey("raw", exportedKey, { name: "AES-GCM", length: 256 }, true, [
    "encrypt",
    "decrypt",
  ])

  const decryptedData = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, encryptedData)

  const decoder = new TextDecoder()
  return decoder.decode(decryptedData)
}

export function useCrypto() {
  const [isAvailable, setIsAvailable] = useState(false)

  useEffect(() => {
    setIsAvailable(!!crypto)
  }, [])

  return { isAvailable, encryptData, decryptData }
}
