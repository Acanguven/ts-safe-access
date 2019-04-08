# ts-safe-access

Hacky way to implement elvis operator (aka safe navigation) with typescript plugin.

## Module Transpiler
If you want to just get the corresponding JavaScript output given TypeScript sources. 
For this you can use ts.transpileModule to get a string => string transformation like below.

## Custom Compiler
If you want get custom compiler only in addition to native tsc that's run custom transformer before compilation.
Custom compiler that will take a list of TypeScript files and compile 
down to their corresponding JavaScript files.

### Source

```js
console.log(a.test?.way?.dd.cc?.uu);
console.log(ac?.test?.test2);
console.log(ac?.test[3]?.test2);
console.log(a?.test);
console.log(a.test?a.c?4:32:3)
```


### Compiled

```js
console.log((((a.test || {}).way || {}).dd.cc || {}).uu);
console.log(((ac || {}).test || {}).test2);
console.log(((ac || {}).test[3] || {}).test2);
console.log((a || {}).test);
console.log(a.test ? a.c ? 4 : 32 : 3);
```

### Install

```bash
yarn add ts-safe-access
```

```bash
npm i ts-safe-access --save --dev
```

### Usage

```bash
ttsc <input_file_name>.ts
```

Module transpiler example can be found [here](test/module-transpiler.ts)

Custom compiler example can be found [here](src/custom-compiler.ts)

