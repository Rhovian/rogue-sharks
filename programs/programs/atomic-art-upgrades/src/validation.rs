use anchor_lang::prelude::*;

pub fn assert_metadata_derivation(
    program_id: &Pubkey,
    account: &Pubkey,
    mint: &Pubkey,
) -> bool {
    let path = [
        "metadata".as_bytes(),
        program_id.as_ref(),
        mint.as_ref(),
    ];
    let (key, _) = Pubkey::find_program_address(&path, program_id);
    key == *account
}
