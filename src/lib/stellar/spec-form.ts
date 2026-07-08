"use client";

import { Buffer } from "buffer";
import { contract, xdr } from "@stellar/stellar-sdk";

// Contract spec → point-and-click forms. Each spec function becomes a list
// of typed field descriptors; raw input strings are parsed per-kind and the
// SDK's spec.funcArgsToScVals does the final (nested-aware) ScVal conversion.

export type FieldKind =
  | "bool"
  | "number" // u32 / i32
  | "bigint" // u64…i256, timepoint, duration
  | "bytes" // hex input
  | "text" // string / symbol
  | "address"
  | "json"; // vec / map / tuple / option / udt / anything nested

export interface SpecField {
  name: string;
  typeLabel: string;
  kind: FieldKind;
  placeholder: string;
}

export interface SpecFunctionDescriptor {
  name: string;
  fields: SpecField[];
}

function kindOf(type: xdr.ScSpecTypeDef): { kind: FieldKind; label: string } {
  const name = type.switch().name;
  switch (name) {
    case "scSpecTypeBool":
      return { kind: "bool", label: "bool" };
    case "scSpecTypeU32":
      return { kind: "number", label: "u32" };
    case "scSpecTypeI32":
      return { kind: "number", label: "i32" };
    case "scSpecTypeU64":
      return { kind: "bigint", label: "u64" };
    case "scSpecTypeI64":
      return { kind: "bigint", label: "i64" };
    case "scSpecTypeU128":
      return { kind: "bigint", label: "u128" };
    case "scSpecTypeI128":
      return { kind: "bigint", label: "i128" };
    case "scSpecTypeU256":
      return { kind: "bigint", label: "u256" };
    case "scSpecTypeI256":
      return { kind: "bigint", label: "i256" };
    case "scSpecTypeTimepoint":
      return { kind: "bigint", label: "timepoint" };
    case "scSpecTypeDuration":
      return { kind: "bigint", label: "duration" };
    case "scSpecTypeBytes":
      return { kind: "bytes", label: "bytes" };
    case "scSpecTypeBytesN":
      return { kind: "bytes", label: "bytesN" };
    case "scSpecTypeString":
      return { kind: "text", label: "string" };
    case "scSpecTypeSymbol":
      return { kind: "text", label: "symbol" };
    case "scSpecTypeAddress":
      return { kind: "address", label: "address" };
    case "scSpecTypeMuxedAddress":
      return { kind: "address", label: "muxed address" };
    default:
      return { kind: "json", label: name.replace("scSpecType", "").toLowerCase() };
  }
}

const PLACEHOLDER: Record<FieldKind, string> = {
  bool: "true | false",
  number: "0",
  bigint: "0",
  bytes: "hex, e.g. deadbeef",
  text: "…",
  address: "G… or C…",
  json: 'JSON, e.g. ["a","b"] or {"k":1}',
};

export function describeFunction(fn: xdr.ScSpecFunctionV0): SpecFunctionDescriptor {
  return {
    name: fn.name().toString(),
    fields: fn.inputs().map((input) => {
      const { kind, label } = kindOf(input.type());
      return {
        name: input.name().toString(),
        typeLabel: label,
        kind,
        placeholder: PLACEHOLDER[kind],
      };
    }),
  };
}

/** All invocable functions of a spec (constructor and internals excluded). */
export function describeFunctions(spec: contract.Spec): SpecFunctionDescriptor[] {
  return spec
    .funcs()
    .map(describeFunction)
    .filter((f) => !f.name.startsWith("__"));
}

/** Parse one raw input string into the JS value funcArgsToScVals expects. */
function parseField(field: SpecField, raw: string): unknown {
  const value = raw.trim();
  switch (field.kind) {
    case "bool":
      return value === "true";
    case "number": {
      const n = Number(value);
      if (!Number.isInteger(n)) throw new Error(`${field.name}: expected an integer`);
      return n;
    }
    case "bigint":
      try {
        return BigInt(value);
      } catch {
        throw new Error(`${field.name}: expected an integer`);
      }
    case "bytes": {
      const hex = value.replace(/^0x/, "");
      if (!/^([0-9a-fA-F]{2})*$/.test(hex)) {
        throw new Error(`${field.name}: expected hex bytes`);
      }
      return Buffer.from(hex, "hex");
    }
    case "text":
    case "address":
      return value;
    case "json":
      try {
        return JSON.parse(value);
      } catch {
        throw new Error(`${field.name}: invalid JSON`);
      }
  }
}

/**
 * Convert a form's raw values into ScVals in declaration order.
 * Throws with a per-field message on bad input.
 */
export function formValuesToScVals(
  spec: contract.Spec,
  fn: SpecFunctionDescriptor,
  rawValues: Record<string, string>,
): xdr.ScVal[] {
  const parsed: Record<string, unknown> = {};
  for (const field of fn.fields) {
    const raw = rawValues[field.name] ?? "";
    if (raw.trim() === "") throw new Error(`${field.name}: required`);
    parsed[field.name] = parseField(field, raw);
  }
  return spec.funcArgsToScVals(fn.name, parsed);
}
