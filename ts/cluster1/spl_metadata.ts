import wallet from "/home/fc/.config/solana/id.json"
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { 
    createMetadataAccountV3, 
    CreateMetadataAccountV3InstructionAccounts, 
    CreateMetadataAccountV3InstructionArgs,
    DataV2Args
} from "@metaplex-foundation/mpl-token-metadata";
import { createSignerFromKeypair, signerIdentity, publicKey } from "@metaplex-foundation/umi";
import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";

// Define our Mint address
const mint = publicKey("GF5xEvk2QLgbL7YhqWFgQZy3EUeU692MY6SwvbvvuC1W")

// Create a UMI connection
const umi = createUmi('https://api.devnet.solana.com');
const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);
umi.use(signerIdentity(createSignerFromKeypair(umi, keypair)));

(async () => {
    try {
        let accounts: CreateMetadataAccountV3InstructionAccounts = {
            mint,
            mintAuthority: signer,
        }

        let data: DataV2Args = {
            name: "Rug Möbius Strip",
            symbol: "RMS",
            uri: "https://gateway.irys.xyz/3rdDr339tSiQXpNR7sDbsubWu9X1bdP3b9FdzbwSACpj",
            sellerFeeBasisPoints: 5,
            creators: null,
            collection: null,
            uses: null,
        }

        let args: CreateMetadataAccountV3InstructionArgs = {
            data,
            isMutable: true,
            collectionDetails: null,
        }

        let tx = createMetadataAccountV3(
            umi,
            {
                ...accounts,
                ...args
            }
        )

        let result = await tx.sendAndConfirm(umi);
        console.log(bs58.encode(result.signature)); // token metadata acc: 3T5UoWqNwHKPmg7FmNHzdJ6baPVaU5UvrawWtuDV7EiM
    } catch(e) {
        console.error(`Oops, something went wrong: ${e}`)
    }
})();
