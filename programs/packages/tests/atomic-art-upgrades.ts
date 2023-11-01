import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { AtomicArtUpgrades } from "../../target/types/atomic_art_upgrades";
import { AtomicArtUpgradesClient } from "../client";
import { expect } from "chai";
import testAuthority from "./fixtures/id.json";
import { Keypair, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import {
  Account,
  createMint,
  getOrCreateAssociatedTokenAccount,
  mintToChecked,
} from "@solana/spl-token";
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";
import { Metaplex, Nft, keypairIdentity } from "@metaplex-foundation/js";

describe("atomic-art-upgrades", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace
    .AtomicArtUpgrades as Program<AtomicArtUpgrades>;
  const authority = Keypair.fromSecretKey(Uint8Array.from(testAuthority));
  const badAuthority = Keypair.generate();
  const newAuthority = Keypair.generate();
  const baseUri = "https://arweave.net/1234/";
  const metaplex = Metaplex.make(program.provider.connection).use(
    keypairIdentity(authority)
  );

  let client: AtomicArtUpgradesClient;
  let mint: anchor.web3.PublicKey;
  let upgradeConfigAddress: PublicKey;
  let bump: number;
  let collectionTokenAccount: Account;
  let nft: Nft;

  before(async () => {
    mint = await createMint(
      program.provider.connection,
      authority,
      authority.publicKey,
      null,
      0
    );

    collectionTokenAccount = await getOrCreateAssociatedTokenAccount(
      program.provider.connection,
      authority,
      mint,
      authority.publicKey,
      true
    );

    await mintToChecked(
      program.provider.connection,
      authority,
      mint,
      collectionTokenAccount.address,
      authority.publicKey,
      1,
      0
    );

    [upgradeConfigAddress, bump] =
      await AtomicArtUpgradesClient.getUpgradeConfigAddress(mint);

    nft = (
      await metaplex.nfts().create({
        uri: "https://arweave.net/123",
        name: "My NFT",
        sellerFeeBasisPoints: 500, // Represents 5.00%.
      })
    ).nft;
  });

  beforeEach(async () => {
    await program.provider.connection
      .requestAirdrop(authority.publicKey, 100 * LAMPORTS_PER_SOL)
      .then(async (sig) => program.provider.connection.confirmTransaction(sig));

    await program.provider.connection
      .requestAirdrop(newAuthority.publicKey, 100 * LAMPORTS_PER_SOL)
      .then(async (sig) => program.provider.connection.confirmTransaction(sig));

    await program.provider.connection
      .requestAirdrop(badAuthority.publicKey, 100 * LAMPORTS_PER_SOL)
      .then(async (sig) => program.provider.connection.confirmTransaction(sig));
  });
  it("Cannot register a base_uri that is too long", async () => {
    try {
      await AtomicArtUpgradesClient.createUpgradeConfig(
        authority.publicKey,
        mint,
        "https://example.com/" + "a".repeat(200)
      );
    } catch (error) {
      const e = error as anchor.AnchorError;
      expect(e.error.errorCode.code).to.equal("UriExceedsMaxLength");
    }
  });
  it("Can register a new upgrade config", async () => {
    client = await AtomicArtUpgradesClient.createUpgradeConfig(
      authority.publicKey,
      mint,
      baseUri
    );

    expect(client.upgradeConfigAddress).not.to.be.null;

    const upgradeConfig = await program.account.upgradeConfig.fetch(
      client.upgradeConfigAddress
    );

    expect(upgradeConfig.baseUri).to.equal(baseUri);
    expect(upgradeConfig.collectionMint.toBase58()).to.equal(mint.toBase58());
    expect(upgradeConfig.updateAuthority.toBase58()).to.equal(
      authority.publicKey.toBase58()
    );
    expect(upgradeConfig.bump[0]).to.equal(bump);
  });
  it("Cannot update an upgrade config without update authority", async () => {
    const newBaseUri = "https://arweave.net/5678";

    try {
      await AtomicArtUpgradesClient.updateUpgradeConfig(
        badAuthority.publicKey,
        mint,
        newBaseUri,
        new NodeWallet(badAuthority)
      );
    } catch (error) {
      const e = error as anchor.AnchorError;
      expect(e.error.errorCode.code).to.equal("PayerMustBeUpdateAuthority");
    }
  });
  it("Can update an existing upgrade config", async () => {
    const newBaseUri = "https://arweave.net/5678";

    client = await AtomicArtUpgradesClient.updateUpgradeConfig(
      newAuthority.publicKey,
      mint,
      newBaseUri
    );

    const upgradeConfig = await program.account.upgradeConfig.fetch(
      client.upgradeConfigAddress
    );

    expect(upgradeConfig.baseUri).to.equal(newBaseUri);
    expect(upgradeConfig.collectionMint.toBase58()).to.equal(mint.toBase58());
    expect(upgradeConfig.updateAuthority.toBase58()).to.equal(
      newAuthority.publicKey.toBase58()
    );
    expect(upgradeConfig.bump[0]).to.equal(bump);
  });
  it("Cannot relinquish authority without authorization", async () => {
    try {
      await AtomicArtUpgradesClient.relinquishUpgradeAuthority(
        badAuthority.publicKey,
        mint,
        nft.address,
        nft.metadataAddress
      );
    } catch (error) {
      const e = error as anchor.AnchorError;
      expect(e.error.errorCode.code).to.equal("PayerMustBeUpdateAuthority");
    }
  });
  it("Cannot relinquish authority without proper mint", async () => {
    const badMint = await createMint(
      program.provider.connection,
      authority,
      authority.publicKey,
      null,
      0
    );

    await AtomicArtUpgradesClient.updateUpgradeConfig(
      authority.publicKey,
      mint,
      "https://arweave.net/123",
      new NodeWallet(newAuthority)
    );

    try {
      await AtomicArtUpgradesClient.relinquishUpgradeAuthority(
        authority.publicKey,
        mint,
        badMint,
        nft.metadataAddress
      );
    } catch (error) {
      const e = error as anchor.AnchorError;
      expect(e.error.errorCode.code).to.equal("InvalidMetadataAccount");
    }
  });
  it("PDA can relinquish authority", async () => {
    expect(nft.updateAuthorityAddress.toBase58()).to.equal(
      authority.publicKey.toBase58()
    );
    // update nfts update authority to be the upgrade config address
    await metaplex.nfts().update({
      nftOrSft: nft,
      newUpdateAuthority: upgradeConfigAddress,
    });

    let updatedNft = await metaplex.nfts().refresh(nft);

    expect(updatedNft.updateAuthorityAddress.toBase58()).to.equal(
      upgradeConfigAddress.toBase58()
    );

    try {
      // relinquish authority
      await AtomicArtUpgradesClient.relinquishUpgradeAuthority(
        authority.publicKey,
        mint,
        nft.address,
        nft.metadataAddress
      );

      updatedNft = await metaplex.nfts().refresh(nft);

      expect(nft.updateAuthorityAddress.toBase58()).to.equal(
        authority.publicKey.toBase58()
      );
    } catch (e) {
      console.log(e);
    }
  });
  it("Cannot upgrade metadata without correct metadata account", async () => {
    const badNft = (
      await metaplex.nfts().create({
        uri: "https://arweave.net/123",
        name: "My NFT",
        sellerFeeBasisPoints: 500, // Represents 5.00%.
      })
    ).nft;

    try {
      await AtomicArtUpgradesClient.upgradeMetadata(
        mint,
        nft.address,
        badNft.metadataAddress
      );
    } catch (error) {
      const e = error as anchor.AnchorError;
      expect(e.error.errorCode.code).to.equal("InvalidMetadataAccount");
    }
  });
  it("Can update an existing upgrade config with a new authority", async () => {
    const { nft } = await metaplex.nfts().create({
      uri: "https://arweave.net/123",
      name: "Rogue Sharks #420",
      sellerFeeBasisPoints: 500, // Represents 5.00%.
    });

    expect(nft.updateAuthorityAddress.toBase58()).to.equal(
      authority.publicKey.toBase58()
    );
    // update nfts update authority to be the upgrade config address
    await metaplex.nfts().update({
      nftOrSft: nft,
      newUpdateAuthority: upgradeConfigAddress,
    });

    let updatedNft = await metaplex.nfts().refresh(nft);

    expect(updatedNft.updateAuthorityAddress.toBase58()).to.equal(
      upgradeConfigAddress.toBase58()
    );

    try {
      await AtomicArtUpgradesClient.upgradeMetadata(
        mint,
        nft.address,
        nft.metadataAddress
      );
    } catch (error) {
      const e = error as anchor.AnchorError;
      expect(e.error.errorCode.code).to.equal("InvalidMetadataAccount");
    }

    updatedNft = await metaplex.nfts().refresh(nft);
    const upgradeConfig = await program.account.upgradeConfig.fetch(
      client.upgradeConfigAddress
    );

    expect(updatedNft.uri).to.equal(upgradeConfig.baseUri + "/420.json");
  });
});
