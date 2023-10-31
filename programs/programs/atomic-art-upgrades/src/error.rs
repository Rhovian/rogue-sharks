use anchor_lang::prelude::*;

#[error_code]
pub enum CustomError {
    #[msg("URI exceeds max length")]
    UriExceedsMaxLength,
    #[msg("Payer must be update authority")]
    PayerMustBeUpdateAuthority,
    #[msg("Invalid Metadata Account")]
    InvalidMetadataAccount,
    #[msg("Invalid Metadata Name Field")]
    InvalidMetadataNameField,
}
