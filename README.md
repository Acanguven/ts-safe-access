# ts-safe-access

Hacky way to implement elvis operator (aka safe navigation) with typescript plugin.


## Source

```ts
console.log(a.test?.way?.dd.cc?.uu);
console.log(ac?.test?.test2);
console.log(ac?.test[3]?.test2);
console.log(a?.test);
console.log(a.test?a.c?4:32:3)
```


## Compiled

```js
console.log((((a.test || {}).way || {}).dd.cc || {}).uu);
console.log(((ac || {}).test || {}).test2);
console.log(((ac || {}).test[3] || {}).test2);
console.log((a || {}).test);
console.log(a.test ? a.c ? 4 : 32 : 3);
```
