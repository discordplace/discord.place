export default function sortColumns(key, order, [a, b]) {
  if (key === '') return 0;

  const columnA = a[key];
  const columnB = b[key];

  let first;
  let second;

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

  // Check if the column is a user subscription
  // If it is, sort by the date the subscription was created
  if (checkType('userSubscription')) {
    const firstHasSubscription = first.value !== null;
    const secondHasSubscription = second.value !== null;

    if (firstHasSubscription && !secondHasSubscription) return -1;
    if (!firstHasSubscription && secondHasSubscription) return 1;
    if (!firstHasSubscription && !secondHasSubscription) return 0;

    return first.value.createdAt - second.value.createdAt;
  }

  if (checkType('email')) return first.value.localeCompare(second.value);

  // Sort by the number of the value
  if (checkType('date') || checkType('number') || checkType('rating') || checkType('countdown')) return first.value - second.value;

  // Sort by the size of the array
  if (checkType('category')) return first.value.length - second.value.length;

  // Sort by the name
  if (checkType('template') || checkType('sound') || checkType('link')) return first.name.localeCompare(second.name);

  return 0;
}