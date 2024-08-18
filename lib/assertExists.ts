/**
 * Asserts that the specified environment variable exists.
 * Throws an error if the environment variable is not defined.
 *
 * @param name - The name of the environment variable.
 * @returns - The value of the environment variable.
 */
function assertExists(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Environment variable ${name} is not defined`);
  }
  return value;
}

export default assertExists;
