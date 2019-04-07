import * as ts from 'typescript';
import {safeAccessor} from "../src/plugin";

const source = `
console.log(a.test?.way?.dd.cc?.uu);
console.log(ac?.test?.test2);
console.log(ac?.test[3]?.test2);
console.log(a?.test);
console.log(a.test?a.c?4:32:3)
`;

const result = ts.transpileModule(source, {
  compilerOptions: {module: ts.ModuleKind.CommonJS},
  transformers: {before: [safeAccessor()]}
});


console.log(source);
console.log(result.outputText);
