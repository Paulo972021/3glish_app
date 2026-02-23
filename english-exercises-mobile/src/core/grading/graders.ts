import { normalizeBasic } from "./normalize";

export function gradeMatchAny(userAnswer: string, accepted: string[]): boolean {
  const u = normalizeBasic(userAnswer);
  return accepted.some((a) => normalizeBasic(a) === u);
}

export function gradeIndexEquals(selected: number, correctIndex: number): boolean {
  return selected === correctIndex;
}

export function gradeBooleanEqualsLabel(
  selected: boolean,
  label: string,
  trueValues: string[] = ["verdadeiro", "true", "v"],
  falseValues: string[] = ["falso", "false", "f"]
): boolean {
  const normalized = normalizeBasic(label);
  const expected = trueValues.includes(normalized) ? true : falseValues.includes(normalized) ? false : null;
  return expected === null ? false : selected === expected;
}
