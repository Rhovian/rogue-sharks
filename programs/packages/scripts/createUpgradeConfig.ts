import { PublicKey } from '@metaplex-foundation/js';
import { AtomicArtUpgradesClient } from '../client';

// Setup provider and client 
process.env['ANCHOR_PROVIDER_URL'] = 'https://api.devnet.solana.com';
process.env['ANCHOR_WALLET'] = '/Users/elo/.config/solana/devnet.json';

// Keypairs 
const updateAuthority = new PublicKey("A4c5nctuNSN7jTsjDahv6bAWthmUzmXi3yBocvLYM4Bz");
const collectionMint = new PublicKey("FREP9swLijQRyFXyrJTP8AB4ucx1iFP5jr4b3N1zRx52");

// Call createUpgradeConfig
const baseUri = "https://shdw-drive.genesysgo.net/BnRuSZ8ApLuTog3LUfSbpHXyg8ZwmKzBsdgve5sRTyva";

(async () => {
    await AtomicArtUpgradesClient.createUpgradeConfig(
        updateAuthority,
        collectionMint,
        baseUri  
      );
})();
