export const parse = (data) => {
  let parsed;

  // Check data is valid JSON
  try {
    parsed = JSON.parse(data);
  } catch (error) {
    console.error(error);
    return {};
  }

  // Format JSON consistently
  const formatted = JSON.stringify(parsed, null, 2);

  // Return parsed and formatted JSON
  return {
    formatted,
    parsed: JSON.parse(formatted),
  };
};
