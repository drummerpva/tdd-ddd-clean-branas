export default class Cpf {
  private FIRST_DIGIT_FACTOR = 10;
  private SECOND_DIGIT_FACTOR = 11;
  readonly value: string;

  constructor(value: string) {
    if (!this.validate(value)) throw new Error("CPF Inválido");
    this.value = value;
  }

  private validate(rawCpf: string) {
    if (!this.isInvalidLength(rawCpf)) return false;
    const cpf = this.clearCPF(rawCpf);
    if (this.isAllIdenticalDigits(cpf)) return false;
    const calculatedCkeckDigit1 = this.calculateDigit(
      cpf,
      this.FIRST_DIGIT_FACTOR
    );
    const calculatedCheckDigit2 = this.calculateDigit(
      cpf,
      this.SECOND_DIGIT_FACTOR
    );
    let checkDigit = this.extractCheckdigits(cpf);
    const calculatedCheckDigit = `${calculatedCkeckDigit1}${calculatedCheckDigit2}`;
    return checkDigit === calculatedCheckDigit;
  }

  private isInvalidLength(string: string) {
    return string.length >= 11 && string.length <= 14;
  }

  private clearCPF(cpf: string) {
    return cpf.replace(/\D/g, "");
  }

  private isAllIdenticalDigits(text: string) {
    const [firstDigit] = text;
    const textInArray = [...text];
    return textInArray.every((digit) => digit === firstDigit);
  }

  private calculateDigit(cpf: string, factor: number) {
    let total = 0;
    for (const digit of cpf) {
      if (factor > 1) total += Number(digit) * factor--;
    }
    const rest = total % 11;
    return rest < 2 ? 0 : 11 - rest;
  }

  private extractCheckdigits(string: string) {
    return string.slice(-2);
  }
}
