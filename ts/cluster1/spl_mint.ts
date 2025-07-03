import { Keypair, PublicKey, Connection, Commitment } from "@solana/web3.js";
import { getOrCreateAssociatedTokenAccount, mintTo } from '@solana/spl-token';
import wallet from "/home/fc/.config/solana/id.json";

// Import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

//Create a Solana devnet connection
const commitment: Commitment = "confirmed";
const connection = new Connection("https://api.devnet.solana.com", commitment);

const token_decimals = 1_000_000n;

// Mint address
const mint = new PublicKey("GF5xEvk2QLgbL7YhqWFgQZy3EUeU692MY6SwvbvvuC1W");

(async () => {
    try {
        // Create an ATA
        const ata = await getOrCreateAssociatedTokenAccount(connection, keypair, mint, keypair.publicKey);
        console.log(`Your ata is: ${ata.address.toBase58()}`); // 9cH25DVH3B4Ytjt9AqJdJaNmz48aDHij9hMkagPfz5CV

        // Mint to ATA
        const mintTx = await mintTo(connection, keypair, mint, ata.address, keypair.publicKey, 199_2025_000_000n);
        console.log(`Your mint txid: ${mintTx}`); // 3sHTRXRMwf87SZ1om7Gt99VEwRfMK61cpbDE3Ae4QDYop9Gh9jWEX6nJxHLTMSRoZYvvcT7EaSWQzkVDb4aUJgkU
    } catch(error) {
        console.log(`Oops, something went wrong: ${error}`)
    }
})()
