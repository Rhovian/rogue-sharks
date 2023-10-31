use anchor_lang::prelude::*;
use anchor_lang::solana_program::program::invoke_signed;
use crate::state::UpgradeConfig;
use anchor_spl::token::Mint;
use crate::error::CustomError;
use crate::validation::assert_metadata_derivation;
use mpl_token_metadata::ID as METADATA_PROGRAM_ID;
use mpl_token_metadata::instruction::update_metadata_accounts_v2;


#[derive(Accounts)]
pub struct RelinquishUpdateAuthority<'info> {
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
    /// CHECK: Checked in program
    #[account(mut)]
    pub metadata: AccountInfo<'info>,
    /// CHECK: Verified program
    #[account(address = METADATA_PROGRAM_ID)]
    pub token_metadata_program: AccountInfo<'info>,
}

pub fn relinquish_update_authority_handler(ctx: Context<RelinquishUpdateAuthority>, new_update_authority: Pubkey) -> Result<()> {
    let upgrade_config = &mut ctx.accounts.upgrade_config;
    let metadata = &mut ctx.accounts.metadata;

    // only the update authority can relinquish the metadata update authority
    require!(
        upgrade_config.update_authority == *ctx.accounts.payer.key,
        CustomError::PayerMustBeUpdateAuthority,
    );
    // assert correct metadata account
    require!(
        assert_metadata_derivation(
            &METADATA_PROGRAM_ID,
            &metadata.key(),
            &ctx.accounts.mint.key(),
        ),
        CustomError::InvalidMetadataAccount,
    );


    invoke_signed(
        &update_metadata_accounts_v2(
            METADATA_PROGRAM_ID,
            metadata.key(),
            upgrade_config.key(),
            Some(new_update_authority),
            None,
            None,
            None,
        ),
        &[
            ctx.accounts.token_metadata_program.to_account_info(),
            ctx.accounts.metadata.to_account_info(),
            upgrade_config.to_account_info(),
        ],
        &[&upgrade_config.as_seeds()]
    )?;

    Ok(())
}
