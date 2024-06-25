import { writable } from "svelte/store";

export const selectedNumber = writable(0);
export const currentInput = writable(0);
export const activeCell = writable({r: 0, c: 0, v: 0});
export const settings = writable({
  showErrors: false,
  showHighlight: true
});