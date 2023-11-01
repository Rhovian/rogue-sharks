use crate::error::CustomError;
use crate::seeds::UPGRADE;
use crate::state::{Empty, UpgradeConfig};
use crate::validation::assert_metadata_derivation;
use anchor_lang::prelude::*;
use anchor_spl::token::Mint;
use mpl_token_metadata::{
    accounts::Metadata,
    instructions::{
        UpdateMetadataAccountV2Cpi, UpdateMetadataAccountV2CpiAccounts,
        UpdateMetadataAccountV2InstructionArgs,
    },
    types::DataV2,
    ID as METADATA_PROGRAM_ID,
};

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
    let token_metadata_program_info = &mut ctx.accounts.token_metadata_program.to_account_info();

    let mut new_data = DataV2 {
        name: "".to_string(),
        symbol: "".to_string(),
        uri: "".to_string(),
        seller_fee_basis_points: 0,
        creators: Some(Vec::new()),
        collection: None,
        uses: None,
    };
    let seeds_container: Vec<_>;
    {
        let metadata = &ctx.accounts.metadata;
        let upgrade_config = &ctx.accounts.upgrade_config;

        require!(
            assert_metadata_derivation(
                &METADATA_PROGRAM_ID,
                &metadata.key(),
                &ctx.accounts.mint.key(),
            ),
            CustomError::InvalidMetadataAccount,
        );

        let metadata_data = metadata.try_borrow_data()?;
        let metadata_state = Metadata::from_bytes(&metadata_data)?;

        let combined_string = &metadata_state
            .name
            .clone()
            .split_once('#')
            .map(|(_, numbers)| format!("{}/{}.json", upgrade_config.base_uri, numbers))
            .unwrap_or_else(|| panic!("{}", CustomError::InvalidMetadataNameField.to_string()));

        //populate new_data
        new_data.name = metadata_state.name.clone();
        new_data.symbol = metadata_state.symbol.clone();
        new_data.uri = combined_string.to_string();
        new_data.seller_fee_basis_points = metadata_state.seller_fee_basis_points;
        new_data.creators = metadata_state.creators.clone();
        new_data.collection = metadata_state.collection.clone();
        new_data.uses = metadata_state.uses.clone();

        seeds_container = upgrade_config.as_seeds().to_vec(); // Collecting seeds as Vec<&[u8]>
    }

    // log new_data as nothing changed...
    msg!("New Data: {:?}", new_data);
    // log seeds

    let args = UpdateMetadataAccountV2InstructionArgs {
        data: Some(new_data),
        new_update_authority: None,
        primary_sale_happened: None,
        is_mutable: None,
    };

    let accounts = UpdateMetadataAccountV2CpiAccounts {
        metadata: &ctx.accounts.metadata.to_account_info(),
        update_authority: &ctx.accounts.upgrade_config.to_account_info(),
    };

    let cpi = UpdateMetadataAccountV2Cpi::new(token_metadata_program_info, accounts, args);

    let seeds: &[&[u8]] = &seeds_container;
    msg!("Seeds: {:?}", seeds);
    cpi.invoke_signed(&[seeds])?;
    Ok(())
}
