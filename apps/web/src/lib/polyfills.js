// Polyfill for 'self is not defined' error during build
if (typeof globalThis !== 'undefined' && typeof globalThis.self === 'undefined') {
  globalThis.self = globalThis;
}
if (typeof global !== 'undefined' && typeof global.self === 'undefined') {
  global.self = global;
}
if (typeof window !== 'undefined' && typeof window.self === 'undefined') {
  window.self = window;
}
