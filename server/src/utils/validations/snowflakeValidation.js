function snowflakeValidation(value) {
  const snowflake = BigInt(value);
  const min = BigInt('419430400000');
  const max = BigInt('9223372036854775807');

  if (snowflake < min || snowflake > max) throw new Error('Invalid user ID range');

  return true;
}

module.exports = snowflakeValidation;