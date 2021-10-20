export function assertOnlyNumbers(ids) {
  if (ids instanceof Array) {
    ids.forEach(id => {
      if (!(id + '').match(/^[0-9]+$/)) throw Error('SQL Injection attempt');
    });
    return ids;
  } else {
    if (!(ids + '').match(/^[0-9]+$/)) throw Error('SQL Injection attempt');
    return ids;
  }
}

export function sqlEscape(str: string) {
  return str.replace(/'/g, "''");
}
