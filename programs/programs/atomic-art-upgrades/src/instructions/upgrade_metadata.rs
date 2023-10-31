use anchor_lang::prelude::*;
use anchor_lang::solana_program::program::invoke_signed;
use anchor_spl::token::Mint;
use mpl_token_metadata::ID as METADATA_PROGRAM_ID;
use mpl_token_metadata::instruction::update_metadata_accounts_v2;
use mpl_token_metadata::state::{DataV2, Metadata, TokenMetadataAccount};
use crate::state::{UpgradeConfig, Empty};
use crate::seeds::UPGRADE;
use crate::error::CustomError;
use crate::validation::assert_metadata_derivation;

#[derive(Accounts)]
pub struct UpgradeMetadata<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account(
        mut,
        seeds = ["upgrade_config".as_bytes(), upgrade_config.collection_mint.key().as_ref()],
        bump = upgrade_config.bump[0],
    )]
    pub upgrade_config: Account<'info, UpgradeConfig>,
    #[account(mut)]
    pub mint: Account<'info, Mint>,
    #[account(
        init,
        seeds = [UPGRADE.as_ref(), mint.key().as_ref()],
        bump,
        payer = payer,
        space = 8
    )]
    pub upgrade_account: Account<'info, Empty>,
    /// CHECK: Checked in program
    #[account(mut)]
    pub metadata: AccountInfo<'info>,
    /// CHECK: Verified program
    #[account(address = METADATA_PROGRAM_ID)]
    pub token_metadata_program: AccountInfo<'info>,
    pub system_program: Program<'info, System>,
}

pub fn upgrade_metadata_handler(ctx: Context<UpgradeMetadata>) -> Result<()> {
    let upgrade_config = &mut ctx.accounts.upgrade_config;
    let metadata = &mut ctx.accounts.metadata;

    // assert correct metadata account
    require!(
        assert_metadata_derivation(
            &METADATA_PROGRAM_ID,
            &metadata.key(),
            &ctx.accounts.mint.key(),
        ),
        CustomError::InvalidMetadataAccount,
    );

    // parse metadata account
    let metadata_state: Metadata =
        TokenMetadataAccount::from_account_info(&metadata.to_account_info())?;

    let initial = metadata_state.data;

    let combined_string = initial.name
        .split_once('#')
        .map(|(_, numbers)| format!("{}/{}.json", upgrade_config.base_uri, numbers))
        .unwrap_or_else(|| panic!("{}", CustomError::InvalidMetadataNameField.to_string()));

    let new_data = DataV2 {
        name: initial.name,
        symbol: initial.symbol,
        uri: combined_string,
        seller_fee_basis_points: initial.seller_fee_basis_points,
        creators: initial.creators,
        collection: metadata_state.collection,
        uses: metadata_state.uses,
    };

    // update metadata account
    invoke_signed(
        &update_metadata_accounts_v2(
            METADATA_PROGRAM_ID,
            metadata.key(),
            upgrade_config.key(),
            None,
            Some(new_data),
            None,
            None,
        ),
        &[
            ctx.accounts.token_metadata_program.to_account_info(),
            ctx.accounts.metadata.to_account_info(),
            upgrade_config.to_account_info(),
        ],
        &[&upgrade_config.as_seeds()],
    )?;

    Ok(())
}
