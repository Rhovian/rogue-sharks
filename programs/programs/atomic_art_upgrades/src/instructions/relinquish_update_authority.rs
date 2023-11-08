use crate::error::CustomError;
use crate::state::UpgradeConfig;
use crate::validation::assert_metadata_derivation;
use anchor_lang::prelude::*;
use anchor_spl::token::Mint;
use mpl_token_metadata::{
    instructions::{
        UpdateMetadataAccountV2Cpi, UpdateMetadataAccountV2CpiAccounts,
        UpdateMetadataAccountV2InstructionArgs,
    },
    ID as TOKEN_METADATA_PROGRAM_ID,
};

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
    #[account(address = TOKEN_METADATA_PROGRAM_ID)]
    pub token_metadata_program: AccountInfo<'info>,
}

pub fn relinquish_update_authority_handler(
    ctx: Context<RelinquishUpdateAuthority>,
    new_update_authority: Pubkey,
) -> Result<()> {
    let upgrade_config = &mut ctx.accounts.upgrade_config;
    let metadata = &mut ctx.accounts.metadata;
    let token_metadata_program_info = ctx.accounts.token_metadata_program.to_account_info();

    // only the update authority can relinquish the metadata update authority
    require!(
        upgrade_config.update_authority == *ctx.accounts.payer.key,
        CustomError::PayerMustBeUpdateAuthority,
    );
    // assert correct metadata account
    require!(
        assert_metadata_derivation(
            &TOKEN_METADATA_PROGRAM_ID,
            &metadata.key(),
            &ctx.accounts.mint.key(),
        ),
        CustomError::InvalidMetadataAccount,
    );

    let args = UpdateMetadataAccountV2InstructionArgs {
        data: None,
        new_update_authority: Some(new_update_authority),
        primary_sale_happened: None,
        is_mutable: None,
    };

    let accounts = UpdateMetadataAccountV2CpiAccounts {
        metadata: &ctx.accounts.metadata.to_account_info(),
        update_authority: &upgrade_config.to_account_info(),
    };

    let cpi = UpdateMetadataAccountV2Cpi::new(&token_metadata_program_info, accounts, args);

    cpi.invoke_signed(&[&upgrade_config.as_seeds()[..]])?;

    Ok(())
}
