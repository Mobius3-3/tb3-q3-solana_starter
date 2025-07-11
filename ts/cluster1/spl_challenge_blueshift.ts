/** Challenge: Mint an SPL Token
 *
 * In this challenge, you will create an SPL token!
 *
 * Goal:
 *   Mint an SPL token in a single transaction using Web3.js and the SPL Token library.
 *
 * Objectives:
 *   1. Create an SPL mint account.
 *   2. Initialize the mint with 6 decimals and your public key (feePayer) as the mint and freeze authorities.
 *   3. Create an associated token account for your public key (feePayer) to hold the minted tokens.
 *   4. Mint 21,000,000 tokens to your associated token account.
 *   5. Sign and send the transaction.
 */

import {
  Keypair,
  Connection,
  sendAndConfirmTransaction,
  SystemProgram,
  Transaction,
  PublicKey,
} from "@solana/web3.js";

import {
  createAssociatedTokenAccountInstruction,
  createInitializeMint2Instruction,
  createMintToInstruction,
  createMintToCheckedInstruction,
  MINT_SIZE,
  getMinimumBalanceForRentExemptMint,
  TOKEN_PROGRAM_ID,
  getAssociatedTokenAddressSync,

  ASSOCIATED_TOKEN_PROGRAM_ID
} from "@solana/spl-token";

import bs58 from "bs58";
import wallet from "/home/fc/.config/solana/id.json"; // auto inferred as type "number[]"

// Import our keypair from the wallet file
const feePayer = Keypair.fromSecretKey(new Uint8Array(wallet));

//Create a connection to the RPC endpoint
const connection = new Connection(
  "https://api.devnet.solana.com",
  "confirmed"
);

// Entry point of your TypeScript code (we will call this)
async function main() {
  try {

    // Generate a new keypair for the mint account
    const mint = Keypair.generate();

    const mintRent = await getMinimumBalanceForRentExemptMint(connection);

    // START HERE

    // Create the mint account
    const createAccountIx = SystemProgram.createAccount({
      /** The account that will transfer lamports to the created account */
      fromPubkey: feePayer.publicKey,
      /** Public key of the created account */
      newAccountPubkey: mint.publicKey,
      /** Amount of lamports to transfer to the created account */
      lamports: mintRent,
      /** Amount of space in bytes to allocate to the created account */
      space: MINT_SIZE,
      /** Public key of the program to assign as the owner of the created account */
      programId: TOKEN_PROGRAM_ID,
    });


    // Initialize the mint account
    // Set decimals to 6, and the mint and freeze authorities to the fee payer (you).
    const initializeMintIx = createInitializeMint2Instruction(
      mint.publicKey,
      6,
      feePayer.publicKey,
      feePayer.publicKey,
      TOKEN_PROGRAM_ID,
    );


    // Create the associated token account
    const associatedTokenAccount = getAssociatedTokenAddressSync(
      mint.publicKey,
      feePayer.publicKey,
      false,  // allowOwnerOffCurve
      TOKEN_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID
    );

    // Get the associated token account address
    const createAssociatedTokenAccountIx = createAssociatedTokenAccountInstruction(
      feePayer.publicKey,
      associatedTokenAccount,
      feePayer.publicKey,
      mint.publicKey,
      TOKEN_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID,
    )


    // Mint 21,000,000 tokens to the associated token account
    const mintAmount = 21_000_000_000_000n; // or value * 10n ** BigInt(decimals);
    const mintToCheckedIx = createMintToCheckedInstruction(
      mint.publicKey,
      associatedTokenAccount,
      feePayer.publicKey,
      mintAmount,
      6,
      [],
      TOKEN_PROGRAM_ID,
    );


    const recentBlockhash = await connection.getLatestBlockhash();

    const transaction = new Transaction({
      feePayer: feePayer.publicKey,
      blockhash: recentBlockhash.blockhash,
      lastValidBlockHeight: recentBlockhash.lastValidBlockHeight
    }).add(
      createAccountIx,
      initializeMintIx,
      createAssociatedTokenAccountIx,
      mintToCheckedIx
    );

    const transactionSignature = await sendAndConfirmTransaction(
      connection,
      transaction,
      [feePayer, mint]  // This is the list of signers. Who should be signing this transaction?
    );

    console.log("Mint Address:", mint.publicKey.toBase58());
    console.log("Transaction Signature:", transactionSignature);
  } catch (error) {
    console.error(`Oops, something went wrong: ${error}`);
  }
}
main();