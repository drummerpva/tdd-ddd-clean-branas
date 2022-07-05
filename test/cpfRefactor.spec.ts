import { validate } from "../src/cpf";

describe("CPF", () => {
  test("Should validity a CPF", () => {
    const cpf = "077.135.309-08";
    const isValid = validate(cpf);
    expect(isValid).toBeTruthy();
  });

  test("Should return false if an invalid CPF has provided", () => {
    const cpf = "077.135.309-07";
    const isValid = validate(cpf);
    expect(isValid).toBeFalsy();
  });
  test("Should return false if an invalid CPF has provided with many digits", () => {
    const cpf = "077.135.309-0723871928379";
    const isValid = validate(cpf);
    expect(isValid).toBeFalsy();
  });

  const wrongSameDigitCpf = [
    "111.111.111-11",
    "222.222.222-22",
    "333.333.333-33",
    "555.555.555-55",
    "777.777.777-77",
    "888.888.888-88",
    "999.999.999-99",
  ];
  test.each(wrongSameDigitCpf)(
    "Should return false if an invalid CPF with all numbers equals has provided",
    (cpf) => {
      const isValid = validate(cpf);
      expect(isValid).toBeFalsy();
    }
  );
});
