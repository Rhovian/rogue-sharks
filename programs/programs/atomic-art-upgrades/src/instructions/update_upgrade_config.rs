use anchor_lang::prelude::*;
use anchor_spl::token::Mint;
use crate::error::CustomError;
use crate::state::{UpgradeConfig, UpdateUpgradeConfigParams, MAX_BASE_URI_LEN};


#[derive(Accounts)]
pub struct UpdateUpgradeConfig<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account(
        mut,
        seeds = ["upgrade_config".as_bytes(), collection_mint.key().as_ref()],
        bump = upgrade_config.bump[0],
    )]
    pub upgrade_config: Account<'info, UpgradeConfig>,
    #[account(
        constraint = collection_mint.decimals == 0,
        constraint = collection_mint.supply == 1,
    )]
    pub collection_mint: Account<'info, Mint>,
}

pub fn update_upgrade_config_handler(ctx: Context<UpdateUpgradeConfig>, config: UpdateUpgradeConfigParams) -> Result<()> {
    // Check the length of the metadata uri provided.
    require!(
        config.base_uri.len() <= MAX_BASE_URI_LEN,
        CustomError::UriExceedsMaxLength,
    );

    let upgrade_config = &mut ctx.accounts.upgrade_config;
    // require payer to be upgrade authority
    require!(
        ctx.accounts.payer.key() == upgrade_config.update_authority,
        CustomError::PayerMustBeUpdateAuthority,
    );


    upgrade_config.base_uri = config.base_uri;
    upgrade_config.update_authority = config.update_authority;

    Ok(())
}
