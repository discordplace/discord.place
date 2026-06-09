export default function sortColumns(key, order, [a, b]) {
  if (key === '') return 0;

  const columnA = a[key];
  const columnB = b[key];

  let first = null;
  let second = null;

  if (order === 'asc') {
    first = columnA;
    second = columnB;
  }

  if (order === 'desc') {
    first = columnB;
    second = columnA;
  }

  function checkType(value) {
    return first.type === value && second.type === value;
  }

  if (checkType('user') || checkType('server') || checkType('bot')) return first.id - second.id;

  if (checkType('userSubscription')) {
    const firstHasSubscription = first.value !== null;
    const secondHasSubscription = second.value !== null;

    if (firstHasSubscription && !secondHasSubscription) return -1;
    if (!firstHasSubscription && secondHasSubscription) return 1;
    if (!firstHasSubscription && !secondHasSubscription) return 0;

    return first.value.createdAt - second.value.createdAt;
  }

  if (checkType('email')) return first.value.localeCompare(second.value);
  if (checkType('date')) return new Date(first.value) - new Date(second.value);
  if (checkType('number') || checkType('rating') || checkType('countdown')) return first.value - second.value;
  if (checkType('category')) return first.value.length - second.value.length;
  if (checkType('template') || checkType('sound') || checkType('link')) return first.name.localeCompare(second.name);

  return 0;
}