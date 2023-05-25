import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { RpsGame } from "../target/types/rps_game";
import { SystemProgram, SYSVAR_RENT_PUBKEY } from "@solana/web3.js";
import { assert } from "chai";

const PublicKey = anchor.web3.PublicKey;

const GLOBAL_STATE_SEED = "GLOBAL-STATE-SEED";
const USER_STATE_SEED = "USER-STATE-SEED";
const VAULT_SEED = "VAULT_SEED";
const CLASS_TYPES = 3;

describe("rps_game", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.RpsGame as Program<RpsGame>;
  const superOwner = anchor.web3.Keypair.generate();
  const user = anchor.web3.Keypair.generate();

  let deposit_amount = 5_000_000_000;
  let bet_amount = 2_000_000_000;
  let win_percentage = [33, 66, 99];
  let reward_policy = [10, 0, 0];

  it("Is initialized!", async () => {
    // Add your test here.
    const latestBlockHash = await provider.connection.getLatestBlockhash();
    await provider.connection.confirmTransaction({
      blockhash: latestBlockHash.blockhash,
      lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
      signature: await provider.connection.requestAirdrop(
        superOwner.publicKey,
        9000000000
      ),
    });
    await provider.connection.confirmTransaction({
      blockhash: latestBlockHash.blockhash,
      lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
      signature: await provider.connection.requestAirdrop(
        user.publicKey,
        9000000000
      ),
    });

    console.log("super owner =", superOwner.publicKey.toBase58());
    console.log("user =", user.publicKey.toBase58());

    const [global_state_pda, bump] = await PublicKey.findProgramAddress(
      [Buffer.from(GLOBAL_STATE_SEED), superOwner.publicKey.toBuffer()],
      program.programId
    );
    console.log("global_state account =", global_state_pda.toBase58());

    const [vault_pda] = await PublicKey.findProgramAddress(
      [Buffer.from(VAULT_SEED)],
      program.programId
    );
    const tx = await program.methods
      .initialize()
      .accounts({
        admin: superOwner.publicKey,
        globalState: global_state_pda,
        vault: vault_pda,
        systemProgram: SystemProgram.programId,
        rent: SYSVAR_RENT_PUBKEY,
      })
      .signers([superOwner])
      .rpc();
    console.log("Your transaction signature", tx);

    let _global_state = await program.account.globalState.fetch(
      global_state_pda
    );
    console.log("superOwner from contract = ", _global_state.admin.toBase58());
    assert.ok(
      _global_state.admin.toBase58() == superOwner.publicKey.toBase58()
    );
    console.log("second win percentage : ", _global_state.winPercentage[1]);
    console.log("third reward policy : ", _global_state.rewardPolicyByClass[2]);
  });

  it("Set Info", async () => {
    const [global_state_pda, bump] = await PublicKey.findProgramAddress(
      [Buffer.from(GLOBAL_STATE_SEED), superOwner.publicKey.toBuffer()],
      program.programId
    );

    const tx = await program.methods
      .setInfo(
        win_percentage,
        reward_policy
      )
      .accounts({
        admin: superOwner.publicKey,
        globalState: global_state_pda,
      })
      .signers([superOwner])
      .rpc();
    console.log("Your transaction signature", tx);

    let _global_state = await program.account.globalState.fetch(
      global_state_pda
    );
    console.log("second win percentage : ", _global_state.winPercentage[1]);
    console.log("third reward policy : ", _global_state.rewardPolicyByClass[2]);
  });

  it("Deposit Reward", async () => {
    const [global_state_pda] = await PublicKey.findProgramAddress(
      [Buffer.from(GLOBAL_STATE_SEED), superOwner.publicKey.toBuffer()],
      program.programId
    );
    const [vault_pda] = await PublicKey.findProgramAddress(
      [Buffer.from(VAULT_SEED)],
      program.programId
    );
    const tx = await program.methods
      .depositReward(new anchor.BN(deposit_amount))
      .accounts({
        user: user.publicKey,
        globalState: global_state_pda,
        vault: vault_pda,
        systemProgram: SystemProgram.programId,
      })
      .signers([user])
      .rpc();
    console.log("Your transaction signature", tx);

    console.log(
      "Vault balance : ",
      await provider.connection.getBalance(vault_pda)
    );
  });

  it("Coin Flip", async () => {
    const [global_state_pda] = await PublicKey.findProgramAddress(
      [Buffer.from(GLOBAL_STATE_SEED), superOwner.publicKey.toBuffer()],
      program.programId
    );
    const [vault_pda] = await PublicKey.findProgramAddress(
      [Buffer.from(VAULT_SEED)],
      program.programId
    );
    const [user_state_pda] = await PublicKey.findProgramAddress(
      [Buffer.from(USER_STATE_SEED), user.publicKey.toBuffer()],
      program.programId
    );

    console.log(
      "User balance --------------- 1 : ",
      await provider.connection.getBalance(user.publicKey)
    );
    const tx = await program.methods
      .coinflip(new anchor.BN(bet_amount))
      .accounts({
        user: user.publicKey,
        pythAccount: user.publicKey,
        globalState: global_state_pda,
        vault: vault_pda,
        userState: user_state_pda,
        systemProgram: SystemProgram.programId,
        rent: SYSVAR_RENT_PUBKEY,
      })
      .signers([user])
      .rpc();
    console.log("Your transaction signature", tx);

    let _user_state = await program.account.userState.fetch(user_state_pda);
    console.log("user address : ", _user_state.user.toBase58());
    console.log("reward amount : ", _user_state.rewardAmount.toNumber());
    console.log("last spin result : ", _user_state.lastSpinresult);
    console.log(
      "Vault balance : ",
      await provider.connection.getBalance(vault_pda)
    );
    console.log(
      "treasury balance : ",
      await provider.connection.getBalance(superOwner.publicKey)
    );
    console.log(
      "User balance --------------- 2 : ",
      await provider.connection.getBalance(user.publicKey)
    );
  });

  it("Bet Sol", async () => {
    const [global_state_pda] = await PublicKey.findProgramAddress(
      [Buffer.from(GLOBAL_STATE_SEED), superOwner.publicKey.toBuffer()],
      program.programId
    );
    const [vault_pda] = await PublicKey.findProgramAddress(
      [Buffer.from(VAULT_SEED)],
      program.programId
    );
    const [user_state_pda] = await PublicKey.findProgramAddress(
      [Buffer.from(USER_STATE_SEED), user.publicKey.toBuffer()],
      program.programId
    );

    console.log(
      "User balance --------------- 1 : ",
      await provider.connection.getBalance(user.publicKey)
    );
    const tx = await program.methods
      .betSol(new anchor.BN(bet_amount), new anchor.BN(93571))
      .accounts({
        user: user.publicKey,
        pythAccount: user.publicKey,
        globalState: global_state_pda,
        vault: vault_pda,
        userState: user_state_pda,
        systemProgram: SystemProgram.programId,
        rent: SYSVAR_RENT_PUBKEY,
      })
      .signers([user])
      .rpc();
    console.log("Your transaction signature", tx);

    let _user_state = await program.account.userState.fetch(user_state_pda);
    console.log("user address : ", _user_state.user.toBase58());
    console.log("reward amount : ", _user_state.rewardAmount.toNumber());
    console.log("last spin result : ", _user_state.lastSpinresult);
    console.log(
      "Vault balance : ",
      await provider.connection.getBalance(vault_pda)
    );
    console.log(
      "treasury balance : ",
      await provider.connection.getBalance(superOwner.publicKey)
    );
    console.log(
      "User balance --------------- 2 : ",
      await provider.connection.getBalance(user.publicKey)
    );
  });

  // it("Claim Reward", async () => {
  //   const [global_state_pda] = await PublicKey.findProgramAddress(
  //     [Buffer.from(GLOBAL_STATE_SEED), superOwner.publicKey.toBuffer()],
  //     program.programId
  //   );
  //   const [vault_pda] = await PublicKey.findProgramAddress(
  //     [Buffer.from(VAULT_SEED)],
  //     program.programId
  //   );
  //   const [jackpot_pda] = await PublicKey.findProgramAddress(
  //     [Buffer.from(JACKPOT_SEED)],
  //     program.programId
  //   );
  //   const [user_state_pda] = await PublicKey.findProgramAddress(
  //     [Buffer.from(USER_STATE_SEED), user.publicKey.toBuffer()],
  //     program.programId
  //   );

  //   const tx = await program.methods
  //     .claimReward()
  //     .accounts({
  //       user: user.publicKey,
  //       globalState: global_state_pda,
  //       vault: vault_pda,
  //       userState: user_state_pda,
  //       systemProgram: SystemProgram.programId,
  //     })
  //     .signers([user])
  //     .rpc();
  //   console.log("Your transaction signature", tx);

  //   let _user_state = await program.account.userState.fetch(user_state_pda);
  //   console.log("user address : ", _user_state.user.toBase58());
  //   console.log("reward amount : ", _user_state.rewardAmount.toNumber());
  //   console.log("last spin result : ", _user_state.lastSpinresult);
  //   console.log(
  //     "Vault balance : ",
  //     await provider.connection.getBalance(vault_pda)
  //   );
  //   console.log(
  //     "Jackpot balance : ",
  //     await provider.connection.getBalance(jackpot_pda)
  //   );
  // });

  it("Withdraw All", async () => {
    const [global_state_pda] = await PublicKey.findProgramAddress(
      [Buffer.from(GLOBAL_STATE_SEED), superOwner.publicKey.toBuffer()],
      program.programId
    );
    const [vault_pda] = await PublicKey.findProgramAddress(
      [Buffer.from(VAULT_SEED)],
      program.programId
    );

    const tx = await program.methods
      .withdrawAll()
      .accounts({
        admin: superOwner.publicKey,
        globalState: global_state_pda,
        vault: vault_pda,
        systemProgram: SystemProgram.programId,
      })
      .signers([superOwner])
      .rpc();
    console.log("Your transaction signature", tx);

    console.log(
      "Vault balance : ",
      await provider.connection.getBalance(vault_pda)
    );
  });
});
