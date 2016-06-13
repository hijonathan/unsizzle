const WEAK_TAGS = [
  'DIV',
  'SPAN',
  'SECTION',
  'BODY',
  'HTML'
];

// NOTE: Use `parser` to allow for shifting features.
// NOTE: Use `toSelector` to control how features are joined.
export const strategies = [
  { name: 'verbose', parser: () => {}, toSelector: () => {} },
  { name: 'noAttributes', parser: () => {}, toSelector: () => {} },
  { name: 'noWeakTags', parser: () => {}, toSelector: () => {} },
  { name: 'noIds', parser: () => {}, toSelector: () => {} },
  { name: 'noChildSelectors', parser: () => {}, toSelector: () => {} }
]


export function noWeakTags(attrs) {
  if (WEAK_TAGS.includes(attrs.tagName)) {
    return Object.assign({}, attrs, { tagName: null });
  } else {
    return attrs;
  }
}


export function noIds(attrs) {
  if (attrs.id != null) {
    return Object.assign({}, attrs, { id: null });
  } else {
    return attrs;
  }
}


export function name(args) {

}
