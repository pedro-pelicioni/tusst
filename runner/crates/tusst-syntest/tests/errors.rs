//! Unparseable submissions, spec authoring bugs, and schema versioning.

use tusst_syntest::{evaluate, parse_spec};

#[test]
fn unparseable_source_fails_every_check() {
    let spec = parse_spec(
        r#"{"schema_version":2,"checks":[
            {"name":"has main","kind":"fn_defined","fn":"main"},
            {"name":"no todo","kind":"macro_invoked","macro":"todo","forbidden":true}
        ]}"#,
    )
    .unwrap();
    let result = evaluate("fn main( {", &spec.checks);
    assert!(!result.syntax_ok);
    assert_eq!(result.outcomes.len(), 2);
    // even the forbidden check reports failed — the verdict fails via "compiles"
    assert!(result.outcomes.iter().all(|o| !o.passed));
}

#[test]
fn bad_spec_snippet_is_a_spec_error_not_a_pass() {
    let spec = parse_spec(
        r#"{"schema_version":2,"checks":[
            {"name":"broken","kind":"expr_present","expr":"let let ("}
        ]}"#,
    )
    .unwrap();
    let result = evaluate("fn main() {}", &spec.checks);
    assert!(result.syntax_ok);
    assert!(!result.outcomes[0].passed);
    assert_eq!(result.spec_errors.len(), 1);
}

#[test]
fn wrong_schema_version_rejected() {
    assert!(parse_spec(r#"{"schema_version":1,"checks":[]}"#).is_err());
    assert!(parse_spec("not json").is_err());
    assert!(parse_spec(r#"{"schema_version":2,"checks":[]}"#).is_ok());
}

#[test]
fn unknown_kind_rejected() {
    assert!(parse_spec(
        r#"{"schema_version":2,"checks":[{"name":"x","kind":"regex","pattern":"fn"}]}"#
    )
    .is_err());
}
