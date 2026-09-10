import ts from 'typescript';
import { readdirSync, readFileSync } from 'node:fs';
import { resolve, dirname, relative } from 'node:path';
function files(path) { return readdirSync(path, { withFileTypes: true }).flatMap(e => e.isDirectory() ? files(`${path}/${e.name}`) : /\.[cm]?tsx?$/.test(e.name) ? [`${path}/${e.name}`] : []); }
const errors = [];
for (const file of files('apps/api/src')) {
  if (!/\/(domain|application)\//.test(file)) continue;
  const ast = ts.createSourceFile(file, readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true);
  function visit(node) {
    let spec;
    if ((ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) && node.moduleSpecifier && ts.isStringLiteral(node.moduleSpecifier)) spec = node.moduleSpecifier.text;
    if (ts.isCallExpression(node) && (node.expression.kind === ts.SyntaxKind.ImportKeyword || node.expression.getText(ast) === 'require') && node.arguments[0] && ts.isStringLiteral(node.arguments[0])) spec = node.arguments[0].text;
    if (spec) {
      const target = spec.startsWith('.') ? relative(process.cwd(), resolve(dirname(file), spec)) : spec;
      if (!spec.startsWith('.') || /\/(adapters|infrastructure)\//.test(target) || /generated/.test(target)) errors.push(`${file}: forbidden inner-layer dependency ${spec}`);
      const owner = file.match(/modules\/([^/]+)/)?.[1];
      const targetOwner = target.match(/modules\/([^/]+)/)?.[1];
      if (owner && targetOwner && owner !== targetOwner) errors.push(`${file}: cross-module inner import ${spec}; use an application port`);
    }
    ts.forEachChild(node, visit);
  }
  visit(ast);
}
if (errors.length) { console.error(errors.join('\n')); process.exitCode = 1; }
else console.info('Inner-layer dependency boundaries passed');
