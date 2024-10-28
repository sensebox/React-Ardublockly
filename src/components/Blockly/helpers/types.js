/**
 * @license Licensed under the Apache License, Version 2.0 (the "License"):
 *          http://www.apache.org/licenses/LICENSE-2.0
 */

/**
 * @fileoverview Blockly Types declarations and helper functions to identify
 *     types.
 */

/** Single character. */
export const CHARACTER = {
  typeId: "Character",
  typeName: "char",
  typeMsgName: "ARD_TYPE_CHAR",
};

export const BOOLEAN = {
  typeId: "Boolean",
  typeName: "boolean",
  typeMsgName: "ARD_TYPE_BOOL",
};

/** Text string. */
export const TEXT = {
  typeId: "Text",
  typeName: "String",
  typeMsgName: "ARD_TYPE_TEXT",
};

/** Short integer number. */
export const SHORT_NUMBER = {
  typeId: "Short_Number",
  typeName: "int",
  typeMsgName: "ARD_TYPE_SHORT",
};

/** Integer number. */
export const NUMBER = {
  typeId: "Number",
  typeName: "int",
  typeMsgName: "ARD_TYPE_NUMBER",
};

/** Large integer number. */
export const LARGE_NUMBER = {
  typeId: "Large Number",
  typeName: "long",
  typeMsgName: "ARD_TYPE_LONG",
};

/** Decimal/floating point number. */
export const DECIMAL = {
  typeId: "Decimal",
  typeName: "float",
  typeMsgName: "ARD_TYPE_DECIMAL",
};

/** Array/List of items. */
export const ARRAY = {
  typeId: "Array",
  typeName: "Array",
  typeMsgName: "ARD_TYPE_ARRAY",
  compatibleTypes: [],
};

/** Null indicate there is no type. */
export const NULL = {
  typeId: "Null",
  typeName: "void",
  typeMsgName: "ARD_TYPE_NULL",
};

/** Type not defined, or not yet defined. */
export const UNDEF = {
  typeId: "Undefined",
  typeName: "undef",
  typeMsgName: "ARD_TYPE_UNDEF",
};

/** Set when no child block (meant to define the variable type) is connected. */
export const CHILD_BLOCK_MISSING = {
  typeId: "ChildBlockMissing",
  typeMsgName: "ARD_TYPE_CHILDBLOCKMISSING",
  compatibleTypes: [],
};

const compatibleTypes = {
  Array: ["Array"],
  boolean: ["boolean"],
  int: ["int", "long", "double", "float"],
  char: ["char"],
  String: ["String"],
  void: ["void"],
  long: ["int", "long"],
  double: ["int", "long", "double"],
  float: ["int", "long", "double", "float"],
  null: ["null"],
};

export const getCompatibleTypes = (type) => {
  return compatibleTypes[type];
};

export const VARIABLE_TYPES = [
  ["SHORT_NUMBER", "char"],
  ["NUMBER", "int"],
  ["DECIMAL", "long"],
  ["TEXT", "String"],
  ["CHARACTER", "char"],
  ["BOOLEAN", "boolean"],
  ["NULL", "void"],
  ["UNDEF", "undefined"],
];
