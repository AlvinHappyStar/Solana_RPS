import { PublicKey } from "@solana/web3.js";
import {
  GLOBAL_STATE_SEED,
  USER_STATE_SEED,
  VAULT_SEED,
  JACKPOT_SEED,
  ADMIN_WALLET,
  PROGRAM_ID,
} from "./constants";

export const getGlobalStateKey = async () => {
  const [globalStateKey] = await asyncGetPda(
    [Buffer.from(GLOBAL_STATE_SEED), ADMIN_WALLET.toBuffer()],
    PROGRAM_ID
  );
  console.log("GlobalStateKey+++++++++++++++++++++", globalStateKey.toBase58());
  return globalStateKey;
};

export const getUserStateKey = async (userPk: PublicKey) => {
  const [userStateKey] = await asyncGetPda(
    [Buffer.from(USER_STATE_SEED), userPk.toBuffer()],
    PROGRAM_ID
  );
  return userStateKey;
};

export const getVaultKey = async () => {
  const [vaultKey] = await asyncGetPda([Buffer.from(VAULT_SEED)], PROGRAM_ID);
  console.log("vaultKey+++++++++++++++++++++", vaultKey.toBase58());
  return vaultKey;
};

export const getJackpotKey = async () => {
  const [jackpotKey] = await asyncGetPda(
    [Buffer.from(JACKPOT_SEED)],
    PROGRAM_ID
  );
  return jackpotKey;
};

const asyncGetPda = async (
  seeds: Buffer[],
  programId: PublicKey
): Promise<[PublicKey, number]> => {
  const [pubKey, bump] = await PublicKey.findProgramAddress(seeds, programId);
  return [pubKey, bump];
};
