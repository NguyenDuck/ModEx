/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * The key definition of an animation to play, defined in the entity.
 */
export type Animations1 = AnimationSpecification | AnimationSpecification1;
/**
 * A single string that specifies which animation there are.
 */
export type AnimationSpecification = string;
/**
 * Molang definition.
 */
export type Molang = string;
/**
 * The animations definition for.
 */
export type Animations = Animations1[];
/**
 * The event or commands to execute.
 */
export type Commands = Commands1 & Commands2;
export type Commands1 = Event | Command | Molang1;
export type Commands2 = string;
/**
 * Events, commands or transitions to preform on entry of this state.
 */
export type OnEntry = Commands[];
/**
 * Events, commands or transitions to preform on exit of this state.
 */
export type OnExit = Commands[];
/**
 * The transition definition for.
 */
export type Transition = Transition1[];
/**
 * The state to start with, if not specified state at position 0 in the array is used.
 */
export type InitialState = string;

/**
 * Animation controller for behaviors.
 */
export interface AnimationController {
  format_version: "1.10.0";
  animation_controllers: AnimationControllers;
}
/**
 * The animation controllers schema for.
 */
export interface AnimationControllers {
  [k: string]: AnimationController1;
}
/**
 * A single animation controller.
 */
export interface AnimationController1 {
  states: States;
  initial_state?: InitialState;
}
/**
 * The states of this animation controller.
 */
export interface States {
  [k: string]: AnimationState;
}
/**
 * Animation state.
 */
export interface AnimationState {
  animations?: Animations;
  on_entry?: OnEntry;
  on_exit?: OnExit;
  transitions?: Transition;
}
/**
 * A object specification on when to animate.
 */
export interface AnimationSpecification1 {
  [k: string]: Molang;
}
export interface Event {
  [k: string]: unknown;
}
export interface Command {
  [k: string]: unknown;
}
export interface Molang1 {
  [k: string]: unknown;
}
/**
 * A transition to another state.
 */
export interface Transition1 {
  [k: string]: Molang;
}
