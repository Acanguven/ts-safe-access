import * as ts from 'typescript';
import {safeAccessor} from "./plugin";
import {compile} from './compile';

compile(process.argv.slice(2), safeAccessor(),{
    noEmitOnError: false,
    noImplicitAny: true,
    target: ts.ScriptTarget.ES5,
    module: ts.ModuleKind.CommonJS
});