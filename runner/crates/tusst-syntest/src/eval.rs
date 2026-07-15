//! One-pass AST index + per-kind evaluation.

use std::collections::HashSet;

use syn::visit::{self, Visit};

use crate::spec::{CheckKind, Construct, ParamSpec};
use crate::tokens::{norm, norm_expr, norm_pat, norm_tokens, norm_type};

#[derive(Debug)]
pub struct FnInfo {
    pub name: String,
    /// (ident name if the pattern is a plain ident, normalized type)
    pub params: Vec<(String, String)>,
    pub returns: Option<String>,
    /// Normalized final expression of the body when it has no `;`.
    pub tail: Option<String>,
}

#[derive(Debug)]
pub struct LocalInfo {
    pub name: String,
    pub mutable: bool,
    pub ty: Option<String>,
    pub init: Option<String>,
}

#[derive(Debug)]
pub struct MethodInfo {
    pub method: String,
    pub receiver: String,
    pub args: String,
}

#[derive(Debug)]
pub struct MatchInfo {
    pub scrutinee: String,
    /// (normalized pattern, normalized arm body)
    pub arms: Vec<(String, String)>,
}

#[derive(Default)]
pub struct Index {
    pub fns: Vec<FnInfo>,
    pub locals: Vec<LocalInfo>,
    /// (macro name without `!`, normalized args tokens)
    pub macros: Vec<(String, String)>,
    pub methods: Vec<MethodInfo>,
    /// Every expression in the file, normalized.
    pub exprs: HashSet<String>,
    /// (normalized pat, normalized iterator expr)
    pub for_loops: Vec<(String, String)>,
    /// Normalized while conditions (plain `while`, not `while let`).
    pub whiles: Vec<String>,
    /// (normalized pat, normalized scrutinee) from `if let`.
    pub if_lets: Vec<(String, String)>,
    pub matches: Vec<MatchInfo>,
    pub has_loop: bool,
    pub has_if: bool,
    pub has_else: bool,
    pub has_for: bool,
    pub has_while: bool,
}

impl Index {
    pub fn build(file: &syn::File) -> Self {
        let mut idx = Index::default();
        idx.visit_file(file);
        idx
    }

    /// syn treats macro bodies as opaque tokens, but students write real
    /// expressions inside `println!`/`vec!`/... (`ledger["gold"]`,
    /// `satchel.len()`). Parse the tokens as a comma-separated expression
    /// list and index whatever parses; skip silently otherwise.
    fn absorb_macro_args(&mut self, tokens: &proc_macro2::TokenStream) {
        use syn::parse::Parser;
        use syn::punctuated::Punctuated;
        let parsed =
            Punctuated::<syn::Expr, syn::Token![,]>::parse_terminated.parse2(tokens.clone());
        if let Ok(exprs) = parsed {
            for expr in &exprs {
                let mut sub = Index::default();
                sub.visit_expr(expr);
                self.merge(sub);
            }
        }
    }

    fn merge(&mut self, other: Index) {
        self.fns.extend(other.fns);
        self.locals.extend(other.locals);
        self.macros.extend(other.macros);
        self.methods.extend(other.methods);
        self.exprs.extend(other.exprs);
        self.for_loops.extend(other.for_loops);
        self.whiles.extend(other.whiles);
        self.if_lets.extend(other.if_lets);
        self.matches.extend(other.matches);
        self.has_loop |= other.has_loop;
        self.has_if |= other.has_if;
        self.has_else |= other.has_else;
        self.has_for |= other.has_for;
        self.has_while |= other.has_while;
    }

    fn record_fn(&mut self, name: String, sig: &syn::Signature, block: &syn::Block) {
        let params = sig
            .inputs
            .iter()
            .filter_map(|arg| match arg {
                syn::FnArg::Typed(pt) => {
                    let name = match &*pt.pat {
                        syn::Pat::Ident(pi) => pi.ident.to_string(),
                        other => norm(other),
                    };
                    Some((name, norm(&*pt.ty)))
                }
                syn::FnArg::Receiver(_) => None,
            })
            .collect();
        let returns = match &sig.output {
            syn::ReturnType::Default => None,
            syn::ReturnType::Type(_, ty) => Some(norm(&**ty)),
        };
        let tail = match block.stmts.last() {
            Some(syn::Stmt::Expr(e, None)) => Some(norm(e)),
            _ => None,
        };
        self.fns.push(FnInfo {
            name,
            params,
            returns,
            tail,
        });
    }
}

impl<'ast> Visit<'ast> for Index {
    fn visit_item_fn(&mut self, node: &'ast syn::ItemFn) {
        self.record_fn(node.sig.ident.to_string(), &node.sig, &node.block);
        visit::visit_item_fn(self, node);
    }

    fn visit_impl_item_fn(&mut self, node: &'ast syn::ImplItemFn) {
        self.record_fn(node.sig.ident.to_string(), &node.sig, &node.block);
        visit::visit_impl_item_fn(self, node);
    }

    fn visit_local(&mut self, node: &'ast syn::Local) {
        // Unwrap `let name: ty = init` — the type annotation nests the ident
        // pattern inside Pat::Type.
        let (pat, ty) = match &node.pat {
            syn::Pat::Type(pt) => (&*pt.pat, Some(norm(&*pt.ty))),
            other => (other, None),
        };
        if let syn::Pat::Ident(pi) = pat {
            self.locals.push(LocalInfo {
                name: pi.ident.to_string(),
                mutable: pi.mutability.is_some(),
                ty,
                init: node.init.as_ref().map(|init| norm(&*init.expr)),
            });
        }
        visit::visit_local(self, node);
    }

    fn visit_macro(&mut self, node: &'ast syn::Macro) {
        if let Some(seg) = node.path.segments.last() {
            self.macros
                .push((seg.ident.to_string(), node.tokens.to_string()));
        }
        self.absorb_macro_args(&node.tokens);
        visit::visit_macro(self, node);
    }

    fn visit_expr(&mut self, node: &'ast syn::Expr) {
        self.exprs.insert(norm(node));
        match node {
            syn::Expr::Loop(_) => self.has_loop = true,
            syn::Expr::ForLoop(f) => {
                self.has_for = true;
                self.for_loops.push((norm(&*f.pat), norm(&*f.expr)));
            }
            syn::Expr::While(w) => {
                self.has_while = true;
                if !matches!(&*w.cond, syn::Expr::Let(_)) {
                    self.whiles.push(norm(&*w.cond));
                }
            }
            syn::Expr::If(i) => {
                self.has_if = true;
                if i.else_branch.is_some() {
                    self.has_else = true;
                }
                if let syn::Expr::Let(el) = &*i.cond {
                    self.if_lets.push((norm(&*el.pat), norm(&*el.expr)));
                }
            }
            syn::Expr::Match(m) => {
                self.matches.push(MatchInfo {
                    scrutinee: norm(&*m.expr),
                    arms: m
                        .arms
                        .iter()
                        .map(|a| (norm(&a.pat), norm(&*a.body)))
                        .collect(),
                });
            }
            syn::Expr::MethodCall(mc) => {
                self.methods.push(MethodInfo {
                    method: mc.method.to_string(),
                    receiver: norm(&*mc.receiver),
                    args: norm(&mc.args),
                });
            }
            _ => {}
        }
        visit::visit_expr(self, node);
    }
}

fn opt_matches(spec: &Option<String>, actual: Option<&str>) -> bool {
    match spec {
        None => true,
        Some(s) => actual == Some(s.as_str()),
    }
}

/// `Ok(found)` — whether the shape exists in the code. `Err` means the spec
/// itself failed to parse (authoring bug), never a wrong submission.
pub fn eval_kind(kind: &CheckKind, idx: &Index) -> Result<bool, String> {
    match kind {
        CheckKind::FnDefined {
            r#fn,
            params,
            returns,
        } => {
            let returns = returns.as_deref().map(norm_type).transpose()?;
            let params = params
                .as_ref()
                .map(|ps| {
                    ps.iter()
                        .map(|ParamSpec { name, ty }| Ok((name.clone(), norm_type(ty)?)))
                        .collect::<Result<Vec<_>, String>>()
                })
                .transpose()?;
            Ok(idx.fns.iter().any(|f| {
                f.name == *r#fn
                    && opt_matches(&returns, f.returns.as_deref())
                    && params.as_ref().is_none_or(|ps| {
                        f.params.len() == ps.len()
                            && ps.iter().zip(&f.params).all(|((name, ty), (fname, fty))| {
                                name.as_ref().is_none_or(|n| n == fname) && ty == fty
                            })
                    })
            }))
        }
        CheckKind::LetBinding {
            var,
            mutable,
            ty,
            init,
        } => {
            let ty = ty.as_deref().map(norm_type).transpose()?;
            let init = init.as_deref().map(norm_expr).transpose()?;
            Ok(idx.locals.iter().any(|l| {
                l.name == *var
                    && mutable.is_none_or(|m| m == l.mutable)
                    && opt_matches(&ty, l.ty.as_deref())
                    && opt_matches(&init, l.init.as_deref())
            }))
        }
        CheckKind::MacroInvoked { r#macro, args } => {
            let args = args.as_deref().map(norm_tokens).transpose()?;
            Ok(idx
                .macros
                .iter()
                .any(|(name, actual)| name == r#macro && args.as_ref().is_none_or(|a| a == actual)))
        }
        CheckKind::MethodCalled {
            method,
            receiver,
            args,
        } => {
            let receiver = receiver.as_deref().map(norm_expr).transpose()?;
            let args = args.as_deref().map(norm_tokens).transpose()?;
            Ok(idx.methods.iter().any(|m| {
                m.method == *method
                    && receiver.as_ref().is_none_or(|r| *r == m.receiver)
                    && args.as_ref().is_none_or(|a| *a == m.args)
            }))
        }
        CheckKind::ExprPresent { expr } => Ok(idx.exprs.contains(&norm_expr(expr)?)),
        CheckKind::UsesConstruct { construct } => Ok(match construct {
            Construct::Loop => idx.has_loop,
            Construct::If => idx.has_if,
            Construct::Else => idx.has_else,
            Construct::Match => !idx.matches.is_empty(),
            Construct::For => idx.has_for,
            Construct::While => idx.has_while,
        }),
        CheckKind::ForLoop { pat, iter } => {
            let pat = pat.as_deref().map(norm_pat).transpose()?;
            let iter = iter.as_deref().map(norm_expr).transpose()?;
            Ok(idx.for_loops.iter().any(|(p, i)| {
                pat.as_ref().is_none_or(|s| s == p) && iter.as_ref().is_none_or(|s| s == i)
            }))
        }
        CheckKind::WhileLoop { cond } => {
            let cond = cond.as_deref().map(norm_expr).transpose()?;
            Ok(match &cond {
                None => idx.has_while,
                Some(c) => idx.whiles.iter().any(|w| w == c),
            })
        }
        CheckKind::IfLet { pat, scrutinee } => {
            let pat = norm_pat(pat)?;
            let scrutinee = scrutinee.as_deref().map(norm_expr).transpose()?;
            Ok(idx
                .if_lets
                .iter()
                .any(|(p, s)| *p == pat && scrutinee.as_ref().is_none_or(|sc| sc == s)))
        }
        CheckKind::MatchOn { scrutinee } => {
            let scrutinee = norm_expr(scrutinee)?;
            Ok(idx.matches.iter().any(|m| m.scrutinee == scrutinee))
        }
        CheckKind::MatchArm { pat, body } => {
            let pat = norm_pat(pat)?;
            let body = body.as_deref().map(norm_expr).transpose()?;
            Ok(idx.matches.iter().any(|m| {
                m.arms
                    .iter()
                    .any(|(p, b)| *p == pat && body.as_ref().is_none_or(|s| s == b))
            }))
        }
        CheckKind::TailExpr { r#fn, expr } => {
            let expr = norm_expr(expr)?;
            Ok(idx
                .fns
                .iter()
                .filter(|f| r#fn.as_ref().is_none_or(|n| *n == f.name))
                .any(|f| f.tail.as_deref() == Some(expr.as_str())))
        }
        CheckKind::AnyOf { of } => {
            let mut first_err = None;
            for sub in of {
                match eval_kind(sub, idx) {
                    Ok(true) => return Ok(true),
                    Ok(false) => {}
                    Err(e) => first_err = first_err.or(Some(e)),
                }
            }
            match first_err {
                Some(e) => Err(e),
                None => Ok(false),
            }
        }
    }
}
