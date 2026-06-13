const CONTROL_CHAR_REGEX = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g;
const DEFAULT_MAX_OUTPUT = 4000;

export function sanitizeUserInput(text: string, maxLen: number): string {
  return text.replace(CONTROL_CHAR_REGEX, "").trim().slice(0, maxLen);
}

export function validateAIOutput(output: string, maxLen = DEFAULT_MAX_OUTPUT): string {
  return output.replace(CONTROL_CHAR_REGEX, "").trim().slice(0, maxLen);
}

export function wrapUserContext(text: string): string {
  const sanitized = sanitizeUserInput(text, 5000);
  return `<user_context>\n${sanitized}\n</user_context>`;
}
