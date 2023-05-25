import * as anchor from "@project-serum/anchor";
import {
  PublicKey,
  Signer,
  Keypair,
  Connection,
  TransactionSignature,
  Transaction,
  SystemProgram,
  SYSVAR_CLOCK_PUBKEY,
  SYSVAR_RENT_PUBKEY,
  sendAndConfirmTransaction,
  clusterApiUrl,
} from "@solana/web3.js";
import bs58 from "bs58";
import { IDL } from "./idl";
// import * as IDL from "./coin_flip.json";
import * as Constants from "./constants";
import * as Keys from "./keys";
import NodeWallet from "@project-serum/anchor/dist/cjs/nodewallet";

let networkUrl = clusterApiUrl(Constants.NETWORK);
console.log(networkUrl);
let connection = new Connection(networkUrl, "singleGossip");

const admin = anchor.web3.Keypair.fromSecretKey(
  bs58.decode(Constants.ADMIN_PRIVATE_KEY)
);
// console.log(admin);

let provider = new anchor.AnchorProvider(
  connection,
  new NodeWallet(admin),
  anchor.AnchorProvider.defaultOptions()
);
const program = new anchor.Program(IDL, Constants.PROGRAM_ID, provider);

const isInitialized = async () => {
  try {
    let res = await program.account.globalState.fetch(
      await Keys.getGlobalStateKey()
    );
    console.log("-------------", res.admin.toBase58());
    if (res.admin.toBase58() == Constants.ADMIN_WALLET.toBase58()) {
      console.log("the program is already initialized");
      return true;
    }
  } catch (error) {
    console.log("fail================>");
    console.error(error.message);
  }

  console.log("the program is not initialized");
  return false;
};

const checkBalance = async () => {
  console.log(
    "Vault balance : ",
    await provider.connection.getBalance(await Keys.getVaultKey())
  );
  console.log(
    "treasury balance : ",
    await provider.connection.getBalance(Constants.TREASURY_WALLET)
  );
};

const init = async () => {
  const txHash = await program.methods
    .initialize()
    .accounts({
      admin: provider.wallet.publicKey,
      globalState: await Keys.getGlobalStateKey(),
      vault: await Keys.getVaultKey(),
      systemProgram: SystemProgram.programId,
      rent: SYSVAR_RENT_PUBKEY,
    })
    .rpc();

  let _global_state = await program.account.globalState.fetch(
    await Keys.getGlobalStateKey()
  );
  console.log("Global state : ", _global_state);
  console.log(
    "Jackpot balance : ",
    await provider.connection.getBalance(await Keys.getJackpotKey())
  );
  console.log("txHash =", txHash);
};

const getGlobalData = async () => {
  let _global_state = await program.account.globalState.fetch(
    await Keys.getGlobalStateKey()
  );
  console.log("Global state : ", _global_state);
  console.log("admin : ", _global_state.admin.toBase58());
};

const updateGlobalData = async () => {
  const txHash = await program.methods
    .setInfo(
      Constants.WIN_PERCENTAGE,
      Constants.REWARD_MUTIPLIER
    )
    .accounts({
      admin: provider.wallet.publicKey,
      globalState: await Keys.getGlobalStateKey(),
    })
    .rpc();

  let _global_state = await program.account.globalState.fetch(
    await Keys.getGlobalStateKey()
  );
  console.log("Global state : ", _global_state);
  console.log("txHash =", txHash);
};

const depositReward = async () => {
  const txHash = await program.methods
    .depositReward(new anchor.BN(Constants.DEPOSIT_AMOUNT))
    .accounts({
      user: provider.wallet.publicKey,
      globalState: await Keys.getGlobalStateKey(),
      vault: await Keys.getVaultKey(),
      systemProgram: SystemProgram.programId,
    })
    .rpc();

  console.log(
    "Vault balance : ",
    await provider.connection.getBalance(await Keys.getVaultKey())
  );
  console.log("txHash =", txHash);
};

const coinFlip = async () => {
  console.log(
    "User balance --------------- 1 : ",
    await provider.connection.getBalance(Constants.ADMIN_WALLET)
  );

  const txHash = await program.methods
    .coinflip(new anchor.BN(Constants.BET_AMOUNT))
    .accounts({
      user: provider.wallet.publicKey,
      pythAccount: Constants.PYTH_ACCOUNT,
      globalState: await Keys.getGlobalStateKey(),
      vault: await Keys.getVaultKey(),
      userState: await Keys.getUserStateKey(provider.wallet.publicKey),
      systemProgram: SystemProgram.programId,
      rent: SYSVAR_RENT_PUBKEY,
    })
    .rpc();

  let _user_state = await program.account.userState.fetch(
    await Keys.getUserStateKey(provider.wallet.publicKey)
  );
  console.log("user address : ", _user_state);
  console.log(
    "User balance --------------- 2 : ",
    await provider.connection.getBalance(provider.wallet.publicKey)
  );
  await checkBalance();

  console.log("txHash =", txHash);
};

const betSol = async () => {
  console.log(
    "User balance --------------- 1 : ",
    await provider.connection.getBalance(Constants.ADMIN_WALLET)
  );

  const txHash = await program.methods
    .betSol(new anchor.BN(Constants.BET_AMOUNT), new anchor.BN(93571))
    .accounts({
      user: provider.wallet.publicKey,
      pythAccount: Constants.PYTH_ACCOUNT,
      globalState: await Keys.getGlobalStateKey(),
      vault: await Keys.getVaultKey(),
      userState: await Keys.getUserStateKey(provider.wallet.publicKey),
      systemProgram: SystemProgram.programId,
      rent: SYSVAR_RENT_PUBKEY,
    })
    .rpc();

  let _user_state = await program.account.userState.fetch(
    await Keys.getUserStateKey(provider.wallet.publicKey)
  );
  console.log("user address : ", _user_state);
  console.log(
    "User balance --------------- 2 : ",
    await provider.connection.getBalance(provider.wallet.publicKey)
  );
  await checkBalance();

  console.log("txHash =", txHash);
};

const withdrawAll = async () => {
  const txHash = await program.methods
    .withdrawAll()
    .accounts({
      admin: provider.wallet.publicKey,
      globalState: await Keys.getGlobalStateKey(),
      vault: await Keys.getVaultKey(),
      systemProgram: SystemProgram.programId,
    })
    .rpc();

  await checkBalance();

  console.log("txHash =", txHash);
};

const main = () => {
  const command = process.argv[2];
  if (command == "Init") {
    init();
  } else if (command == "IsInitialized") {
    isInitialized();
  } else if (command == "CheckBalance") {
    checkBalance();
  } else if (command == "GetGlobalData") {
    getGlobalData();
  } else if (command == "UpdateGlobalData") {
    updateGlobalData();
  } else if (command == "DepositReward") {
    depositReward();
  } else if (command == "CoinFlip") {
    coinFlip();
  } else if (command == "BetSol") {
    betSol();
  } else if (command == "WithdrawAll") {
    withdrawAll();
  } else {
    console.log("Please enter command name...");
    // getSWRDAccount();
    checkBalance();
  }
};

main();
