//! Token-stream normalization — the single comparison currency of this crate.
//!
//! Both sides of every comparison (the student's AST node and the spec's code
//! snippet) go through `to_token_stream().to_string()`, so whitespace,
//! comments and formatting never matter.

use proc_macro2::TokenStream;
use quote::ToTokens;
use std::str::FromStr;
use syn::parse::Parser;

pub fn norm<T: ToTokens>(t: &T) -> String {
    t.to_token_stream().to_string()
}

pub fn norm_expr(s: &str) -> Result<String, String> {
    syn::parse_str::<syn::Expr>(s)
        .map(|e| norm(&e))
        .map_err(|e| format!("spec expr `{s}`: {e}"))
}

pub fn norm_type(s: &str) -> Result<String, String> {
    syn::parse_str::<syn::Type>(s)
        .map(|t| norm(&t))
        .map_err(|e| format!("spec type `{s}`: {e}"))
}

pub fn norm_pat(s: &str) -> Result<String, String> {
    syn::Pat::parse_multi_with_leading_vert
        .parse_str(s)
        .map(|p| norm(&p))
        .map_err(|e| format!("spec pat `{s}`: {e}"))
}

/// Free-form token sequence (macro args, method arg lists).
pub fn norm_tokens(s: &str) -> Result<String, String> {
    TokenStream::from_str(s)
        .map(|t| t.to_string())
        .map_err(|e| format!("spec tokens `{s}`: {e}"))
}
