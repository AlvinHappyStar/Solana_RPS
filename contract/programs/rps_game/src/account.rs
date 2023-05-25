use anchor_lang::prelude::*;
use crate::constants::*;


#[account]
#[derive(Default)]
pub struct GlobalState {
    pub admin: Pubkey,
    pub win_percentage: [u16; CLASS_TYPES],
    pub reward_policy_by_class: [u16; CLASS_TYPES],
}


#[account]
#[derive(Default)]
pub struct UserState {
    pub user: Pubkey,
    pub reward_amount: u64,
    pub last_spinresult: u8,
}
