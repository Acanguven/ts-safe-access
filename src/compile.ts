import * as ts from "typescript";

export function compile(sourceFiles: string[], customTransformer:ts.TransformerFactory<ts.SourceFile>, options: ts.CompilerOptions): void {
    let program = ts.createProgram(sourceFiles, options);
    let emitResult = program.emit(undefined, undefined,
        undefined, undefined, {before:[customTransformer]});

    let allDiagnostics = ts
        .getPreEmitDiagnostics(program)
        .concat(emitResult.diagnostics);

    let deduplicatedDiagnostics = ts.sortAndDeduplicateDiagnostics(allDiagnostics);

    deduplicatedDiagnostics.forEach(diagnostic => {
        if (diagnostic.file) {
            let { line, character } = diagnostic.file.getLineAndCharacterOfPosition(
                diagnostic.start!
            );
            let message = ts.flattenDiagnosticMessageText(
                diagnostic.messageText,
                "\n"
            );
            console.log(
                `${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`
            );
        } else {
            console.log(
                `${ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n")}`
            );
        }
    });

    let exitCode = emitResult.emitSkipped ? 1 : 0;
    console.log(`Process exiting with code '${exitCode}'.`);
    process.exit(exitCode);
}