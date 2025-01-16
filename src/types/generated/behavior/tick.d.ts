/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * The path to the function.
 */
export type FunctionPath = string;
/**
 * The collection of function path to execute.
 */
export type Values = FunctionPath[];

/**
 * Mcfunction that are to be called per game tick (20 times per second).
 */
export interface Tick {
  values?: Values;
}
