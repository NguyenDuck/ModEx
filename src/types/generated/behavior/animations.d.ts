/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * The time in seconds this animation will last.
 */
export type AnimationLength = number;
/**
 * Whenever this animation should loop once it reaches the end, will only happen if the animation is still active.
 */
export type Loop = boolean;
/**
 * The event or commands to execute.
 */
export type Commands = (Variable | MinecraftCommand | Molang | Event) & string;
/**
 * The event or commands to execute.
 */
export type Commands1 = Commands2 & Commands3;
export type Commands2 = Variable | MinecraftCommand | Molang | Event;
export type Commands3 = string;
export type CollectionTimelimeItems = Commands1[];
/**
 * How does time pass when playing the animation. Defaults to `query.anim_time + query.delta_time` which means advance in seconds.
 */
export type AnimationTimeUpdate = string | number;

/**
 * Animation for behavior for.
 */
export interface Animation {
  format_version: "1.8.0" | "1.10.0";
  animations: AnimationsSchema;
}
/**
 * The animation specification.
 */
export interface AnimationsSchema {
  [k: string]: Animation1;
}
/**
 * A single animation definition for.
 */
export interface Animation1 {
  animation_length?: AnimationLength;
  loop?: Loop;
  timeline?: Timeline;
  anim_time_update?: AnimationTimeUpdate;
}
/**
 * A timeline specification, property names are timestamps.
 */
export interface Timeline {
  [k: string]: Commands | CollectionTimelimeItems;
}
/**
 * Sets the value to a molang variable.
 */
export interface Variable {
  [k: string]: unknown;
}
/**
 * Executes a minecraft command.
 */
export interface MinecraftCommand {
  [k: string]: unknown;
}
export interface Molang {
  [k: string]: unknown;
}
/**
 * An event to be called upon within the executing entity.
 */
export interface Event {
  [k: string]: unknown;
}
