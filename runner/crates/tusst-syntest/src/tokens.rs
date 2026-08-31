//! Token-stream normalization — the single comparison currency of this crate.
//!
//! Both sides of every comparison (the student's AST node and the spec's code
//! snippet) go through `to_token_stream().to_string()`, so whitespace,
//! comments and formatting never matter.

use proc_macro2::{Group, TokenStream, TokenTree};
use quote::ToTokens;
use std::str::FromStr;
use syn::parse::Parser;

/// Drop a trailing `,` from a token stream and from every group inside it.
///
/// `syn` models a struct literal's fields, a call's arguments and a tuple's
/// elements as `Punctuated`, which *keeps* the trailing comma the author
/// wrote, and `to_token_stream()` re-emits it. rustfmt always emits that
/// comma when it breaks a literal across lines, so without this the exact
/// same expression normalizes two different ways depending only on how the
/// student's editor wrapped it — and a check naming a struct or call literal
/// would mark correctly formatted code wrong.
///
/// The one thing this deliberately gives up is telling a one-element tuple
/// `(T,)` apart from a parenthesized `(T)`. That only ever makes a check more
/// permissive; the alternative failed correct code.
fn strip_trailing_commas(ts: TokenStream) -> TokenStream {
    let mut out: Vec<TokenTree> = ts
        .into_iter()
        .map(|tt| match tt {
            TokenTree::Group(g) => {
                let mut regrouped = Group::new(g.delimiter(), strip_trailing_commas(g.stream()));
                regrouped.set_span(g.span());
                TokenTree::Group(regrouped)
            }
            other => other,
        })
        .collect();

    while matches!(out.last(), Some(TokenTree::Punct(p)) if p.as_char() == ',') {
        out.pop();
    }

    out.into_iter().collect()
}

fn canonical(ts: TokenStream) -> String {
    strip_trailing_commas(ts).to_string()
}

pub fn norm<T: ToTokens>(t: &T) -> String {
    canonical(t.to_token_stream())
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
        .map(canonical)
        .map_err(|e| format!("spec tokens `{s}`: {e}"))
}

#[cfg(test)]
mod tests {
    use super::*;

    /// rustfmt writes a trailing comma whenever it breaks a literal across
    /// lines. The spec snippet is a one-liner and never has one, so the two
    /// must normalize identically or every multi-line struct literal fails.
    #[test]
    fn trailing_comma_does_not_change_normalization() {
        let one_line = norm_expr("TxError::TooLarge { limit: 100, got: size }").unwrap();
        let wrapped = norm_expr("TxError::TooLarge {\n limit: 100,\n got: size,\n}").unwrap();
        assert_eq!(one_line, wrapped);

        let call = norm_expr("f(a, b)").unwrap();
        assert_eq!(call, norm_expr("f(\n a,\n b,\n)").unwrap());
    }

    #[test]
    fn nested_groups_are_stripped_too() {
        assert_eq!(
            norm_expr("Outer { inner: Inner { a: 1, b: 2 } }").unwrap(),
            norm_expr("Outer {\n inner: Inner {\n a: 1,\n b: 2,\n },\n}").unwrap()
        );
    }

    #[test]
    fn macro_args_are_canonicalized_the_same_way() {
        assert_eq!(
            norm_tokens("\"a\", 1").unwrap(),
            norm_tokens("\"a\", 1,").unwrap()
        );
    }
}
