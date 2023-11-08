#![allow(clippy::result_large_err)]
use anchor_lang::prelude::*;

mod state;
use state::*;

mod error;
mod validation;

mod instructions;
use instructions::*;

mod seeds;

declare_id!("JCp7WqJMX5qQucBkChrem5JZFjJxN12dmxvJGqNp724C ");

#[program]
pub mod atomic_art_upgrades {
    use super::*;

    pub fn register_upgrade_config(
        ctx: Context<CreateUpgradeConfig>,
        config: CreateUpgradeConfigParams,
    ) -> Result<()> {
        create_upgrade_config_handler(ctx, config)
    }

    pub fn update_upgrade_config(
        ctx: Context<UpdateUpgradeConfig>,
        config: UpdateUpgradeConfigParams,
    ) -> Result<()> {
        update_upgrade_config_handler(ctx, config)
    }

    pub fn relinquish_update_authority(
        ctx: Context<RelinquishUpdateAuthority>,
        new_update_authority: Pubkey,
    ) -> Result<()> {
        relinquish_update_authority_handler(ctx, new_update_authority)
    }

    pub fn upgrade_metadata(ctx: Context<UpgradeMetadata>) -> Result<()> {
        upgrade_metadata_handler(ctx)
    }
}
