//! Per-kind coverage. Specs go through JSON to exercise the exact wire shape
//! the server sends.

use tusst_syntest::{evaluate, parse_spec};

fn run(source: &str, checks_json: &str) -> Vec<bool> {
    let spec = parse_spec(&format!(r#"{{"schema_version":2,"checks":{checks_json}}}"#))
        .expect("spec parses");
    let result = evaluate(source, &spec.checks);
    assert!(result.syntax_ok, "fixture source must parse");
    assert!(
        result.spec_errors.is_empty(),
        "unexpected spec errors: {:?}",
        result.spec_errors
    );
    result.outcomes.iter().map(|o| o.passed).collect()
}

fn run_one(source: &str, check_json: &str) -> bool {
    run(source, &format!("[{check_json}]"))[0]
}

#[test]
fn fn_defined() {
    let src = "fn add(a: i32, b: i32) -> i32 { a + b }\nfn main() {}";
    assert!(run_one(
        src,
        r#"{"name":"t","kind":"fn_defined","fn":"main"}"#
    ));
    assert!(run_one(
        src,
        r#"{"name":"t","kind":"fn_defined","fn":"add","params":[{"name":"a","ty":"i32"},{"name":"b","ty":"i32"}],"returns":"i32"}"#
    ));
    // param types anonymous by name
    assert!(run_one(
        src,
        r#"{"name":"t","kind":"fn_defined","fn":"add","params":[{"ty":"i32"},{"ty":"i32"}]}"#
    ));
    // wrong return type / wrong arity / missing fn
    assert!(!run_one(
        src,
        r#"{"name":"t","kind":"fn_defined","fn":"add","returns":"u32"}"#
    ));
    assert!(!run_one(
        src,
        r#"{"name":"t","kind":"fn_defined","fn":"add","params":[{"ty":"i32"}]}"#
    ));
    assert!(!run_one(
        src,
        r#"{"name":"t","kind":"fn_defined","fn":"sub"}"#
    ));
    // reference type in param
    let src2 = "fn greet(who: &String) {}";
    assert!(run_one(
        src2,
        r#"{"name":"t","kind":"fn_defined","fn":"greet","params":[{"name":"who","ty":"&String"}]}"#
    ));
}

#[test]
fn let_binding() {
    let src = "fn main() { let mut score = 50; let age: i32 = 12; }";
    assert!(run_one(
        src,
        r#"{"name":"t","kind":"let_binding","var":"score","mutable":true}"#
    ));
    assert!(run_one(
        src,
        r#"{"name":"t","kind":"let_binding","var":"age","ty":"i32"}"#
    ));
    assert!(run_one(
        src,
        r#"{"name":"t","kind":"let_binding","var":"score","init":"50"}"#
    ));
    assert!(!run_one(
        src,
        r#"{"name":"t","kind":"let_binding","var":"age","mutable":true}"#
    ));
    assert!(!run_one(
        src,
        r#"{"name":"t","kind":"let_binding","var":"age","ty":"f64"}"#
    ));
    assert!(!run_one(
        src,
        r#"{"name":"t","kind":"let_binding","var":"gold"}"#
    ));
}

#[test]
fn macro_invoked() {
    let src = r#"fn main() { let v = vec![1, 2, 3]; println!("score: {}", v.len()); }"#;
    assert!(run_one(
        src,
        r#"{"name":"t","kind":"macro_invoked","macro":"println"}"#
    ));
    assert!(run_one(
        src,
        r#"{"name":"t","kind":"macro_invoked","macro":"vec","args":"1, 2, 3"}"#
    ));
    // whitespace in spec args is irrelevant
    assert!(run_one(
        src,
        r#"{"name":"t","kind":"macro_invoked","macro":"vec","args":"1,2,3"}"#
    ));
    assert!(run_one(
        src,
        r#"{"name":"t","kind":"macro_invoked","macro":"println","args":"\"score: {}\", v.len()"}"#
    ));
    assert!(!run_one(
        src,
        r#"{"name":"t","kind":"macro_invoked","macro":"eprintln"}"#
    ));
    assert!(!run_one(
        src,
        r#"{"name":"t","kind":"macro_invoked","macro":"println","args":"\"score: {}\""}"#
    ));
}

#[test]
fn method_called() {
    let src = r#"fn main() {
        let mut satchel = vec!["rope"];
        satchel.push("map");
        let total: i32 = satchel.iter().count() as i32;
        let x: Option<&str> = None;
        x.unwrap_or(&"nothing");
    }"#;
    assert!(run_one(
        src,
        r#"{"name":"t","kind":"method_called","method":"push","receiver":"satchel","args":"\"map\""}"#
    ));
    // chained receiver
    assert!(run_one(
        src,
        r#"{"name":"t","kind":"method_called","method":"count","receiver":"satchel.iter()"}"#
    ));
    // receiver omitted = any
    assert!(run_one(
        src,
        r#"{"name":"t","kind":"method_called","method":"unwrap_or","args":"&\"nothing\""}"#
    ));
    assert!(!run_one(
        src,
        r#"{"name":"t","kind":"method_called","method":"pop"}"#
    ));
    assert!(!run_one(
        src,
        r#"{"name":"t","kind":"method_called","method":"push","receiver":"backpack"}"#
    ));
}

#[test]
fn expr_present() {
    let src = "fn main() { let mut score = 50; score = 100; let v = vec![9]; let _ = v[0]; }";
    assert!(run_one(
        src,
        r#"{"name":"t","kind":"expr_present","expr":"score = 100"}"#
    ));
    assert!(run_one(
        src,
        r#"{"name":"t","kind":"expr_present","expr":"v[0]"}"#
    ));
    assert!(!run_one(
        src,
        r#"{"name":"t","kind":"expr_present","expr":"score = 99"}"#
    ));
}

#[test]
fn uses_construct_and_loops() {
    let src = r#"fn main() {
        loop { break; }
        for n in 1..=10 { let _ = n; }
        let mut floors = 3;
        while floors > 0 { floors -= 1; }
        let door = 2;
        let what = match door { 1 => "left", _ => "no door" };
        if what.is_empty() {} else {}
    }"#;
    for c in ["loop", "for", "while", "match", "if", "else"] {
        assert!(
            run_one(
                src,
                &format!(r#"{{"name":"t","kind":"uses_construct","construct":"{c}"}}"#)
            ),
            "construct {c}"
        );
    }
    assert!(run_one(
        src,
        r#"{"name":"t","kind":"for_loop","iter":"1..=10"}"#
    ));
    assert!(run_one(
        src,
        r#"{"name":"t","kind":"for_loop","pat":"n","iter":"1..=10"}"#
    ));
    assert!(!run_one(
        src,
        r#"{"name":"t","kind":"for_loop","iter":"1..10"}"#
    ));
    assert!(run_one(
        src,
        r#"{"name":"t","kind":"while_loop","cond":"floors > 0"}"#
    ));
    assert!(!run_one(
        src,
        r#"{"name":"t","kind":"while_loop","cond":"floors > 1"}"#
    ));
    // no else without else
    assert!(!run_one(
        "fn main() { if true {} }",
        r#"{"name":"t","kind":"uses_construct","construct":"else"}"#
    ));
}

#[test]
fn if_let_match_on_match_arm() {
    let src = r#"fn main() {
        let lantern = Some(3);
        if let Some(light) = lantern { let _ = light; }
        let door = 1;
        let path = match door { 1 => "left", 2 => "center", _ => "no door" };
        let _ = path;
    }"#;
    assert!(run_one(
        src,
        r#"{"name":"t","kind":"if_let","pat":"Some(light)"}"#
    ));
    assert!(run_one(
        src,
        r#"{"name":"t","kind":"if_let","pat":"Some(light)","scrutinee":"lantern"}"#
    ));
    assert!(!run_one(
        src,
        r#"{"name":"t","kind":"if_let","pat":"Some(flame)"}"#
    ));
    assert!(run_one(
        src,
        r#"{"name":"t","kind":"match_on","scrutinee":"door"}"#
    ));
    assert!(!run_one(
        src,
        r#"{"name":"t","kind":"match_on","scrutinee":"window"}"#
    ));
    assert!(run_one(
        src,
        r#"{"name":"t","kind":"match_arm","pat":"1","body":"\"left\""}"#
    ));
    assert!(run_one(
        src,
        r#"{"name":"t","kind":"match_arm","pat":"_","body":"\"no door\""}"#
    ));
    assert!(run_one(src, r#"{"name":"t","kind":"match_arm","pat":"2"}"#));
    assert!(!run_one(
        src,
        r#"{"name":"t","kind":"match_arm","pat":"3"}"#
    ));
    assert!(!run_one(
        src,
        r#"{"name":"t","kind":"match_arm","pat":"1","body":"\"right\""}"#
    ));
}

#[test]
fn tail_expr() {
    let with_tail = "fn add(a: i32, b: i32) -> i32 { a + b }";
    let with_semi = "fn add(a: i32, b: i32) -> i32 { a + b; }";
    assert!(run_one(
        with_tail,
        r#"{"name":"t","kind":"tail_expr","fn":"add","expr":"a + b"}"#
    ));
    assert!(!run_one(
        with_semi,
        r#"{"name":"t","kind":"tail_expr","fn":"add","expr":"a + b"}"#
    ));
    // fn omitted = any fn
    assert!(run_one(
        with_tail,
        r#"{"name":"t","kind":"tail_expr","expr":"a + b"}"#
    ));
    // wrong fn name
    assert!(!run_one(
        with_tail,
        r#"{"name":"t","kind":"tail_expr","fn":"sub","expr":"a + b"}"#
    ));
}

#[test]
fn any_of() {
    let plus_eq = "fn main() { let mut echoes = 0; echoes += 1; }";
    let long_form = "fn main() { let mut echoes = 0; echoes = echoes + 1; }";
    let neither = "fn main() { let echoes = 0; }";
    let check = r#"{"name":"t","kind":"any_of","of":[
        {"kind":"expr_present","expr":"echoes += 1"},
        {"kind":"expr_present","expr":"echoes = echoes + 1"}
    ]}"#;
    assert!(run_one(plus_eq, check));
    assert!(run_one(long_form, check));
    assert!(!run_one(neither, check));
}

#[test]
fn forbidden() {
    let with_unwrap = "fn main() { let x = Some(1).unwrap(); }";
    let without = "fn main() { let x = Some(1).unwrap_or(0); }";
    let check = r#"{"name":"t","kind":"method_called","method":"unwrap","forbidden":true}"#;
    assert!(!run_one(with_unwrap, check));
    assert!(run_one(without, check));
    // forbidden todo!()
    let with_todo = "fn main() { todo!(); }";
    let todo_check = r#"{"name":"t","kind":"macro_invoked","macro":"todo","forbidden":true}"#;
    assert!(!run_one(with_todo, todo_check));
    assert!(run_one(without, todo_check));
}

#[test]
fn exprs_inside_macro_args_are_indexed() {
    // syn treats macro bodies as opaque tokens; the Index re-parses them so
    // expressions students write inside println!/vec! still count.
    let src = r#"fn main() {
        let ledger = std::collections::HashMap::from([("gold", 100)]);
        println!("gold: {}", ledger["gold"]);
        let v = vec![1, 2];
        println!("items: {}", v.len());
    }"#;
    assert!(run_one(
        src,
        r#"{"name":"t","kind":"expr_present","expr":"ledger[\"gold\"]"}"#
    ));
    assert!(run_one(
        src,
        r#"{"name":"t","kind":"method_called","method":"len","receiver":"v"}"#
    ));
}

#[test]
fn comments_and_strings_do_not_count() {
    // The old regex grader needed stripComments; the AST gives this for free.
    let src = r#"fn main() {
        // todo!()
        /* satchel.push("map") */
        let s = "todo!() score = 100";
        let _ = s;
    }"#;
    assert!(!run_one(
        src,
        r#"{"name":"t","kind":"macro_invoked","macro":"todo"}"#
    ));
    assert!(!run_one(
        src,
        r#"{"name":"t","kind":"method_called","method":"push"}"#
    ));
    assert!(!run_one(
        src,
        r#"{"name":"t","kind":"expr_present","expr":"score = 100"}"#
    ));
    // forbidden checks therefore PASS when the pattern only appears in comments
    assert!(run_one(
        src,
        r#"{"name":"t","kind":"macro_invoked","macro":"todo","forbidden":true}"#
    ));
}

#[test]
fn struct_defined() {
    let src = r#"
        struct Player { name: String, hp: i32 }
        struct Point(i32, i32);
        struct Unit;
    "#;
    assert!(run_one(
        src,
        r#"{"name":"t","kind":"struct_defined","struct":"Player"}"#
    ));
    assert!(run_one(
        src,
        r#"{"name":"t","kind":"struct_defined","struct":"Player","fields":[{"name":"name","ty":"String"},{"name":"hp","ty":"i32"}]}"#
    ));
    // field type mismatch / arity mismatch / unknown struct
    assert!(!run_one(
        src,
        r#"{"name":"t","kind":"struct_defined","struct":"Player","fields":[{"name":"name","ty":"String"}]}"#
    ));
    assert!(!run_one(
        src,
        r#"{"name":"t","kind":"struct_defined","struct":"Player","fields":[{"name":"hp","ty":"String"}]}"#
    ));
    assert!(!run_one(
        src,
        r#"{"name":"t","kind":"struct_defined","struct":"Ghost"}"#
    ));
    // tuple struct fields by positional index
    assert!(run_one(
        src,
        r#"{"name":"t","kind":"struct_defined","struct":"Point","fields":[{"ty":"i32"},{"ty":"i32"}]}"#
    ));
    assert!(run_one(
        src,
        r#"{"name":"t","kind":"struct_defined","struct":"Unit"}"#
    ));
}

#[test]
fn impl_defined() {
    let src = r#"
        struct Player { hp: i32 }
        impl Player {
            fn heal(&self) {}
        }
        impl std::fmt::Debug for Player {
            fn fmt(&self) {}
        }
    "#;
    assert!(run_one(
        src,
        r#"{"name":"t","kind":"impl_defined","type":"Player"}"#
    ));
    assert!(run_one(
        src,
        r#"{"name":"t","kind":"impl_defined","type":"Player","trait":"std::fmt::Debug"}"#
    ));
    // wrong trait / wrong type
    assert!(!run_one(
        src,
        r#"{"name":"t","kind":"impl_defined","type":"Player","trait":"Clone"}"#
    ));
    assert!(!run_one(
        src,
        r#"{"name":"t","kind":"impl_defined","type":"Ghost"}"#
    ));
}

#[test]
fn derive_present() {
    let src = r#"
        #[derive(Debug, Clone)]
        struct Player { hp: i32 }
        struct Ghost { hp: i32 }
    "#;
    assert!(run_one(
        src,
        r#"{"name":"t","kind":"derive_present","type":"Player","derives":["Debug"]}"#
    ));
    assert!(run_one(
        src,
        r#"{"name":"t","kind":"derive_present","type":"Player","derives":["Debug","Clone"]}"#
    ));
    // missing derive / wrong struct
    assert!(!run_one(
        src,
        r#"{"name":"t","kind":"derive_present","type":"Player","derives":["PartialEq"]}"#
    ));
    assert!(!run_one(
        src,
        r#"{"name":"t","kind":"derive_present","type":"Ghost","derives":["Debug"]}"#
    ));
}

#[test]
fn whitespace_and_formatting_irrelevant() {
    let ugly = "fn main(){let mut score=50;score=100;println!(\"score: {}\",score);}";
    assert!(run(
        ugly,
        r#"[
            {"name":"a","kind":"let_binding","var":"score","mutable":true},
            {"name":"b","kind":"expr_present","expr":"score = 100"},
            {"name":"c","kind":"macro_invoked","macro":"println","args":"\"score: {}\", score"}
        ]"#
    )
    .iter()
    .all(|p| *p));
}
