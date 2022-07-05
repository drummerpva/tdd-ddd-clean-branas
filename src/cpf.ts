const FIRST_DIGIT_FACTOR = 10;
const SECOND_DIGIT_FACTOR = 11;
export function validate(rawCpf: string) {
  if (!isInvalidLength(rawCpf)) return false;
  const cpf = clearCPF(rawCpf);
  if (isAllIdenticalDigits(cpf)) return false;
  const calculatedCkeckDigit1 = calculateDigit(cpf, FIRST_DIGIT_FACTOR);
  const calculatedCheckDigit2 = calculateDigit(cpf, SECOND_DIGIT_FACTOR);
  let checkDigit = extractCheckdigits(cpf);
  const calculatedCheckDigit = `${calculatedCkeckDigit1}${calculatedCheckDigit2}`;
  return checkDigit === calculatedCheckDigit;
}

function isInvalidLength(string: string) {
  return string.length >= 11 && string.length <= 14;
}

function clearCPF(cpf: string) {
  return cpf.replace(/\D/g, "");
}

function isAllIdenticalDigits(text: string) {
  const [firstDigit] = text;
  const textInArray = [...text];
  return textInArray.every((digit) => digit === firstDigit);
}

function calculateDigit(cpf: string, factor: number) {
  let total = 0;
  for (const digit of cpf) {
    if (factor > 1) total += Number(digit) * factor--;
  }
  const rest = total % 11;
  return rest < 2 ? 0 : 11 - rest;
}

function extractCheckdigits(string: string) {
  return string.slice(-2);
}
