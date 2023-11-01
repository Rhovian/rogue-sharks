use crate::error::CustomError;
use crate::state::{CreateUpgradeConfigParams, UpgradeConfig, MAX_BASE_URI_LEN};
use anchor_lang::prelude::*;
use anchor_spl::token::Mint;

#[derive(Accounts)]
pub struct CreateUpgradeConfig<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account(
        init,
        seeds = ["upgrade_config".as_bytes(), collection_mint.key().as_ref()],
        payer = payer,
        space = UpgradeConfig::LEN,
        bump
    )]
    pub upgrade_config: Account<'info, UpgradeConfig>,
    #[account(
        constraint = collection_mint.decimals == 0,
        constraint = collection_mint.supply == 1,
    )]
    pub collection_mint: Account<'info, Mint>,
    pub system_program: Program<'info, System>,
}

pub fn create_upgrade_config_handler(
    ctx: Context<CreateUpgradeConfig>,
    config: CreateUpgradeConfigParams,
) -> Result<()> {
    // Check the length of the metadata uri provided.
    require!(
        config.base_uri.len() <= MAX_BASE_URI_LEN,
        CustomError::UriExceedsMaxLength,
    );

    let upgrade_config = &mut ctx.accounts.upgrade_config;

    **upgrade_config = UpgradeConfig::try_new(
        config.base_uri,
        config.update_authority,
        config.collection_mint,
        ctx.bumps.upgrade_config,
    )?;

    Ok(())
}
