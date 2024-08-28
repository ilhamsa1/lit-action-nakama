// import { crypto } from "https://deno.land/std@0.224.0/crypto/mod.ts";

import {
  getPublicKey,
  // nip04,
  // SimplePool,
  // finalizeEvent,
  // verifyEvent,
} from "@nostr/tools";

import { hkdf } from "https://esm.sh/@noble/hashes@1.4.0/hkdf.js";
import { sha256 } from "https://esm.sh/@noble/hashes@1.4.0/sha256.js";
import { hexToBytes  } from "https://esm.sh/@noble/hashes@1.4.0/utils.js";

async function generateRandomSeed() {
  // const message = new SiweMessage({
  //   domain,
  //   address,
  //   statement,
  //   uri: origin,
  //   version: "1",
  //   chainId: "1",
  //   nonce, // provided as a jsParam global
  //   issuedAt, // provided as a jsParam global
  // });
  // return message.prepareMessage();

  return await crypto.subtle.generateKey(
    {name: "HMAC", hash: "SHA-256"}, 
    false, //extractable
    ["sign", "verify"] //uses
  )
}


export function add(a: number, b: number): number {
  return a + b;
}

function bytesToHexString(bytes: Uint8Array) {
  return Array.from(bytes)
    .map(byte => byte.toString(16).padStart(2, "0"))
    .join("");
}

const key = await crypto.getRandomValues(new Uint8Array(32));
const hexString = bytesToHexString(key);

// const rawKey = await crypto.subtle.exportKey("raw", key);

// const a = await crypto.subtle.sign("HMAC", rawKey, new TextEncoder().encode("hello"));

console.log(hexString, 'sssssssss');
// Learn more at https://docs.deno.com/runtime/manual/examples/module_metadata#concepts
if (import.meta.main) {
  console.log("Add 2 + 3 =", add(2, 3));
}

function numToBytes(num: number, bytes: number) {
  const b = new ArrayBuffer(bytes);
  const v = new DataView(b);
  v.setUint32(0, num);
  return new Uint8Array(b);
}

const initialKey = "e5d4bc23127369ab4f9d594e46bd8a29782c2181f1c8363721bcbb64348226c2f02d301309d8a0c2024c08bb2b60d5b286dfb69611385ba3660838f3104c9fbba38d5cd0c15eeddd773829f8cae41d8d5b6aee249e698dd0d46cc29b9ab99e70"

async function generateSeckey(initialKey: string, keyIndex: number) {
  const dkLen = 32; // HKDF output key length
  const salt = numToBytes(keyIndex, dkLen); // HKDF salt is set to a zero-filled byte sequence equal to the hash's output length
  const info = "nostr"; // HKDF info is set to an application-specific byte sequence distinct from other uses of HKDF in the application
  const seckey = hkdf(sha256, hexToBytes(initialKey), salt, info, dkLen);
  console.log(seckey, 'seckey');
  const publicKey = getPublicKey(seckey);
  console.log(publicKey, 'publicKey');
  return publicKey;
}
generateSeckey(initialKey, 0);

// // Function to generate random bytes using Web Crypto API
// function generateRandomBytes() {
//   // const randomValues = new Uint8Array(byteLength); // Array to hold random bytes
//   // crypto.getRandomValues(randomValues); // Fill array with cryptographically secure random values
//   return randomValues;
// }

// // Convert the random bytes to a hexadecimal string (optional)
// function bytesToHexString(bytes) {
//   return Array.from(bytes)
//     .map(byte => byte.toString(16).padStart(2, "0"))
//     .join("");
// }

// // Example usage
// const go = () => {
//   const byteLength = 16; // Length of random bytes
//   const randomBytes = generateRandomBytes(byteLength);
//   console.log("Random Bytes:", randomBytes);

//   const hexString = bytesToHexString(randomBytes);
//   console.log("Hexadecimal String:", hexString);
// };

// go();


// self.addEventListener('load', _ => {
//   for (const myElement of document.querySelectorAll<Element & { name: string }>('.load')) {
//       myElement.name = '3️⃣ SUCCESS - load event'
//   }
// })

// self.addEventListener('mousemove', (e: MouseEvent) => {
//   for (const myElement of document.querySelectorAll<Element & { name: string }>('.mouse')) {
//       myElement.name = `4️⃣ SUCCESS - mousemove event - ${e.x},${e.y}`
//   }
// })

