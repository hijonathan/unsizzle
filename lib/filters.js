export function filter(attrs) {
  Object.assign({}, attrs, {
    class: attrs.class.filter((c) => {
      return !(isStatefulClass(c) || isAppcuesClass(c) || isAngularClass(c));
    })
  })
}

export function isStatefulClass(str) {
  return STATEFUL_CLASSES.includes(str);
}

export function isAppcuesClass(attrs) {
  return APPCUES_CLASSES.includes(str);
}

export function isAngularClass(str) {
  return /^ng-.+/i.test(str);
}
