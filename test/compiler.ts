import * as ts from 'typescript';
import {safeAccessor} from "../src/plugin";
import {compile} from '../src/compile';

compile(['sample/sample'], safeAccessor(),{
    noEmitOnError: false,
    noImplicitAny: true,
    target: ts.ScriptTarget.ES5,
    module: ts.ModuleKind.CommonJS
});