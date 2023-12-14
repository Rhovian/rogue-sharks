import { Keypair } from "@solana/web3.js";
import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";
import fs from 'fs';

const key = ""
// Convert string to bytes
let secretKey = bs58.decode(key);
console.log(`[${Keypair.fromSecretKey(secretKey).secretKey}]`);

// exporting back from Uint8Array to bs58 private key
// == from solana cli id.json key file to phantom private key

//privkey = new Uint8Array([111, 43, 24, ...]); // content of id.json here
// console.log(bs58.encode(privkey));
// const exportedJson = JSON.stringify(keypair); 

// fs.writeFileSync('./keypair.json', exportedJson);
