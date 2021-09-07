export function assertOnlyNumbers(ids) {
  if (ids instanceof Array) {
    ids.forEach(id => {
      if (!(id + '').match(/^[0-9]+$/)) throw Error('SQL Injection attempt');
    });
  } else {
    if (!(ids + '').match(/^[0-9]+$/)) throw Error('SQL Injection attempt');
  }
}

export function sqlEscape(str: string) {
  return str.replace(/'/g, "''");
}
