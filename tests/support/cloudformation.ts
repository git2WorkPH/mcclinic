import { parseDocument, isCollection, type Tags } from 'yaml';
// CloudFormation's short intrinsic syntax is normalized without executing expressions.
const tags: Tags = [];
for (const name of [
  'Ref',
  'GetAtt',
  'Sub',
  'Select',
  'GetAZs',
  'Equals',
  'Not',
  'If',
  'And',
  'Or',
  'Join',
  'Condition',
]) {
  for (const collection of [undefined, 'seq'] as const) {
    tags.push({
      tag: '!' + name,
      ...(collection ? { collection } : {}),
      resolve(value: unknown) {
        let normalized = isCollection(value) ? value.toJSON() : value;
        if (name === 'GetAtt' && typeof normalized === 'string') {
          const [resource, ...attribute] = normalized.split('.');
          normalized = [resource, attribute.join('.')];
        }
        return {
          [name === 'Ref' || name === 'Condition' ? name : 'Fn::' + name]:
            normalized,
        };
      },
    });
  }
}
export function decodeCloudFormation(source: string) {
  const doc = parseDocument(source, { customTags: tags, uniqueKeys: true });
  if (doc.errors.length || doc.warnings.length)
    throw new Error('Invalid CloudFormation YAML.');
  const data = doc.toJS({ maxAliasCount: 100 });
  if (!data || typeof data !== 'object' || !data.Resources)
    throw new Error('Missing CloudFormation resources.');
  return data;
}
