// no need to import ethers, it's automatically injected on the lit node side
// import { ethers } from 'ethers';

// import { SiweMessage } from "https://esm.sh/siwe@1.0.0";
// import {encode, decode} from "https://deno.land/std/encoding/base64url.ts";
// import { crypto } from "https://deno.land/std@0.224.0/crypto/mod.ts";
import { hkdf } from "https://esm.sh/@noble/hashes@1.4.0/hkdf.js";
import { sha256 } from "https://esm.sh/@noble/hashes@1.4.0/sha256.js";
import { hexToBytes  } from "https://esm.sh/@noble/hashes@1.4.0/utils.js";


// const domain = "localhost:3000";
// const origin = "http://localhost:3000";

function bytesToHexString(bytes: Uint8Array) {
  return Array.from(bytes)
    .map(byte => byte.toString(16).padStart(2, "0"))
    .join("");
}

function numToBytes(num: number, bytes: number) {
  const b = new ArrayBuffer(bytes);
  const v = new DataView(b);
  v.setUint32(0, num);
  return new Uint8Array(b);
}

// async function generateSeckey(initialKey: string, keyIndex: number) {
//   const dkLen = 32; // HKDF output key length
//   const salt = numToBytes(keyIndex, dkLen); // HKDF salt is set to a zero-filled byte sequence equal to the hash's output length
//   const info = "nostr"; // HKDF info is set to an application-specific byte sequence distinct from other uses of HKDF in the application
//   const seckey = hkdf(sha256, hexToBytes(initialKey), salt, info, dkLen);

//   return seckey;
// }

// async function generateSeckey(initialKey: string, keyIndex: number) {
//   const dkLen = 32; // HKDF output key length
//   const salt = numToBytes(keyIndex, dkLen); // HKDF salt is set to a zero-filled byte sequence equal to the hash's output length
//   const info = "seckey";
//   const seckey = hkdf(sha256, hexToBytes(initialKey), salt, '', 32);
//   console.log(seckey, 'seckey');
//   // const publicKey = getPublicKey(seckey);
//   // console.log(publicKey, 'publicKey');
  
//   return seckey;
// }

const go = async () => {
  const randomSeed = await crypto.getRandomValues(new Uint8Array(32));

  const seeds: string[] = await Lit.Actions.broadcastAndCollect({
    name: 'seeds',
    value: ethers.utils.hexlify(randomSeed),
  });

  // BIP39 Seed
  const seedsHex = seeds.reduce((acc, s, idx) => acc + s.slice(2), '0x');
  const seed = hkdf(sha256, ethers.utils.arrayify(seedsHex), new Uint8Array(32), 'seed', 32);

  // BIP32 Root Key
  const rootHDNode = ethers.HDNode.fromSeed(seed);
  const { extendedKey: bip32RootKey } = rootHDNode;

  // BIP32 Derivation Path
  const path = "m/44'/60'/0'/0";

  // BIP32 Extended Private Key
  const networkHDNode = rootHDNode.deriveKey(path);
  const { extendedKey: bip32ExtendedPrivateKey } = networkHDNode

  const firstWallet = new ethers.Wallet(rootHDNode.deriveKey("m/44'/60'/0'/0/0"));
  const { address: firstAddress, publicKey: firstAddressPubKey } = firstWallet;

  const response = JSON.stringify({
    bip39Seed: ethers.utils.hexlify(seed),
    bip32RootKey,
    bip32ExtendedPrivateKey,
    firstAddress,
    firstAddressPubKey,
  })

  Lit.Actions.setResponse({ response });
};

go();