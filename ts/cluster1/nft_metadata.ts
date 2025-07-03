import wallet from "/home/fc/.config/solana/id.json"
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { createGenericFile, createSignerFromKeypair, signerIdentity } from "@metaplex-foundation/umi"
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys"

// Create a devnet connection
const umi = createUmi('https://api.devnet.solana.com');

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);

umi.use(irysUploader());
umi.use(signerIdentity(signer));

(async () => {
    try {
        // Follow this JSON structure
        // https://docs.metaplex.com/programs/token-metadata/changelog/v1.0#json-structure
        const image = "https://gateway.irys.xyz/3LekizSJRWkV55R7YUWZS33ouqwFe6RrXeBppTy5NUSs"
        const metadata = {
            name: "testRug",
            symbol: "TR",
            description: "rug nft test",
            image: image,
            attributes: [
                {trait_type: 'color', value: '20'}
            ],
            properties: {
                files: [
                    {
                        type: "image/png",
                        uri: "image"
                    },
                ]
            },
            creators: []
        };
        const myUri = await umi.uploader.uploadJson([metadata]);
        console.log("Your metadata URI: ", myUri); // https://gateway.irys.xyz/F5K1PEWGCwjVuxxo6berrzDSTP64fwp2HjV1bFv6pJjQ
    }
    catch(error) {
        console.log("Oops.. Something went wrong", error);
    }
})();
