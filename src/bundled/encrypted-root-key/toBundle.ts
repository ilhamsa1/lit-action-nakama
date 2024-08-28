// no need to import ethers, it's automatically injected on the lit node side
// import { ethers } from 'ethers';

// import { SiweMessage } from "https://esm.sh/siwe@1.0.0";
// import {encode, decode} from "https://deno.land/std/encoding/base64url.ts";
// import { crypto } from "https://deno.land/std@0.224.0/crypto/mod.ts";
import { hkdf } from "https://esm.sh/@noble/hashes@1.4.0/hkdf.js";
import { pbkdf2Async } from "https://esm.sh/@noble/hashes@1.4.0/pbkdf2.js";
import { sha512 } from "https://esm.sh/@noble/hashes@1.4.0/sha512.js";

import { sha256 } from "https://esm.sh/@noble/hashes@1.4.0/sha256.js";


const go = async () => {
  const randomEntropy = await crypto.getRandomValues(new Uint8Array(32));

  const entropies: string[] = await Lit.Actions.broadcastAndCollect({
    name: 'seeds',
    value: ethers.utils.hexlify(randomEntropy),
  });

  // TODO: convert to mnemonic

  // BIP39 Seed
  const entropyHex = entropies.reduce((acc, s, idx) => acc + s.slice(2), '0x');
  const entropy = hkdf(sha256, ethers.utils.arrayify(entropyHex), new Uint8Array(32), 'seed', 32);

  const password = ''

  const encoder = new TextEncoder();
  const salt = encoder.encode("mnemonic" + password);

  const seed = await pbkdf2Async(sha512, entropy, salt, { c: 2048, dkLen: 64 });

  // BIP32 Root Key
  const rootHDNode = ethers.utils.HDNode.fromSeed(seed);
  const { extendedKey: bip32RootKey } = rootHDNode;

  // BIP32 Derivation Path
  const path = "m/44'/60'/0'/0";

  // BIP32 Extended Private Key
  const networkHDNode = rootHDNode.derivePath(path);
  const { extendedKey: bip32ExtendedPrivateKey } = networkHDNode

  const firstAddressHDNode = rootHDNode.derivePath("m/44'/60'/0'/0/0");
  const firstWallet = new ethers.Wallet(firstAddressHDNode);
  const { address: firstAddress, publicKey: firstAddressPubKey } = firstWallet;

  const response = JSON.stringify({
    entropy: ethers.utils.hexlify(entropy),
    bip39Seed: ethers.utils.hexlify(seed),
    bip32RootKey,
    bip32ExtendedPrivateKey,
    firstAddress,
    firstAddressPubKey,
    firstAddressPubKeyShort: firstAddressHDNode.publicKey,
  })

  Lit.Actions.setResponse({ response });
};

go();