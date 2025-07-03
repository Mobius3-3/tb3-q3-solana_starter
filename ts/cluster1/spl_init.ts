import { Keypair, Connection, Commitment } from "@solana/web3.js";
import { createMint } from '@solana/spl-token';
import wallet from "/home/fc/.config/solana/id.json";

// Import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

//Create a Solana devnet connection
const commitment: Commitment = "confirmed";
const connection = new Connection("https://api.devnet.solana.com", commitment);

(async () => {
    try {
        const mint = await createMint(connection, keypair, keypair.publicKey, null, 6);
        console.log(`successfully created mint: ${mint.toBase58()}`); // mintAcc: GF5xEvk2QLgbL7YhqWFgQZy3EUeU692MY6SwvbvvuC1W
    } catch(error) {
        console.log(`Oops, something went wrong: ${error}`)
    }
})()
