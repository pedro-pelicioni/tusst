//! Deserialization types for the check spec sent by tusst-web.
//!
//! This enum is mirrored 1:1 by `AstCheckSpec` in
//! `src/content/lesson-checks.ts` — any change here must land there too and
//! bump `SCHEMA_VERSION`. The `fixture_matches_ts` test pins the wire shape.

use serde::Deserialize;

pub const SCHEMA_VERSION: u32 = 1;

#[derive(Debug, Deserialize)]
pub struct CheckSpecFile {
    pub schema_version: u32,
    pub checks: Vec<Check>,
}

#[derive(Debug, Deserialize)]
pub struct Check {
    /// User-facing test name, authored per lesson (safe to return to the client).
    pub name: String,
    /// When true the pattern must NOT be present.
    #[serde(default)]
    pub forbidden: bool,
    #[serde(flatten)]
    pub kind: CheckKind,
}

#[derive(Debug, Deserialize)]
pub struct ParamSpec {
    pub name: Option<String>,
    pub ty: String,
}

/// All code-shape params (`expr`, `ty`, `pat`, `args`, ...) are Rust source
/// snippets, parsed with syn and compared by normalized token stream — never
/// by raw text.
#[derive(Debug, Deserialize)]
#[serde(tag = "kind", rename_all = "snake_case")]
pub enum CheckKind {
    FnDefined {
        r#fn: String,
        params: Option<Vec<ParamSpec>>,
        returns: Option<String>,
    },
    LetBinding {
        var: String,
        mutable: Option<bool>,
        ty: Option<String>,
        init: Option<String>,
    },
    MacroInvoked {
        r#macro: String,
        args: Option<String>,
    },
    MethodCalled {
        method: String,
        receiver: Option<String>,
        args: Option<String>,
    },
    ExprPresent {
        expr: String,
    },
    UsesConstruct {
        construct: Construct,
    },
    ForLoop {
        pat: Option<String>,
        iter: Option<String>,
    },
    WhileLoop {
        cond: Option<String>,
    },
    IfLet {
        pat: String,
        scrutinee: Option<String>,
    },
    MatchOn {
        scrutinee: String,
    },
    MatchArm {
        pat: String,
        body: Option<String>,
    },
    TailExpr {
        r#fn: Option<String>,
        expr: String,
    },
    AnyOf {
        of: Vec<CheckKind>,
    },
}

#[derive(Debug, Deserialize, PartialEq, Eq, Clone, Copy)]
#[serde(rename_all = "snake_case")]
pub enum Construct {
    Loop,
    If,
    Else,
    Match,
    For,
    While,
}

/// Parse and version-check a spec file. `Err` here is an authoring/infra bug,
/// not a wrong submission.
pub fn parse_spec(json: &str) -> Result<CheckSpecFile, String> {
    let spec: CheckSpecFile =
        serde_json::from_str(json).map_err(|e| format!("invalid checks spec: {e}"))?;
    if spec.schema_version != SCHEMA_VERSION {
        return Err(format!(
            "checks spec schema_version {} (runner supports {})",
            spec.schema_version, SCHEMA_VERSION
        ));
    }
    Ok(spec)
}
