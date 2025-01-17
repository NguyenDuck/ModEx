/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * A version that tells minecraft what type of data format can be expected when reading this file.
 */
export type FormatVersion = string;
/**
 * Sets the identifier for this rule's description.
 */
export type Identifier = string;
/**
 * List of all components used to identify geometry parts used in culling.
 *
 * @minItems 1
 */
export type Rules = [Rule, ...Rule[]];
/**
 * The bone within the geometry part
 */
export type Bone = string;
/**
 * The cube within the geometry part
 */
export type Cube = number;
/**
 * The face within the geometry part
 */
export type Face = "up" | "down" | "north" | "south" | "east" | "west";
/**
 * Specifies the direction of the neighbor block to check for culling. This direction rotates with a block's Transform component.
 */
export type Direction = "up" | "down" | "north" | "south" | "east" | "west";

/**
 * A resource pack file that helps the system determine how to change the appearance of this block.
 */
export interface BlockCulling {
  format_version?: FormatVersion;
  "minecraft:block_culling_rules"?: BlockCullingRules;
}
/**
 * JSON container used for descriptions, especially the identifier for the name of the culled version of the block.
 */
export interface BlockCullingRules {
  description?: Description;
  rules?: Rules;
}
/**
 * Contains the identifier used by minecraft:geometry block components to refer to this culling data
 */
export interface Description {
  identifier?: Identifier;
}
/**
 * The rules that specifies a "geometry_part" and "direction"
 */
export interface Rule {
  geometry_part?: GeometryPart;
  direction?: Direction;
}
/**
 * Specifies the bone, cube, and face that the block will be culled. The cube and face fields are optional to allow culling a specific face. Omitting these fields will cull the whole bone.
 */
export interface GeometryPart {
  bone?: Bone;
  cube?: Cube;
  face?: Face;
}