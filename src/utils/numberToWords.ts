const ones = [
  "",
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
  "ten",
  "eleven",
  "twelve",
  "thirteen",
  "fourteen",
  "fifteen",
  "sixteen",
  "seventeen",
  "eighteen",
  "nineteen",
];

const tens = [
  "",
  "",
  "twenty",
  "thirty",
  "forty",
  "fifty",
  "sixty",
  "seventy",
  "eighty",
  "ninety",
];

const scales = ["", "thousand", "million", "billion", "trillion"];

export function numberToWords(num: number): string {
  if (num === 0) return "zero";

  let word = "";
  let scaleIndex = 0;

  while (num > 0) {
    const chunk = num % 1000;

    if (chunk > 0) {
      const chunkWord = chunkToWords(chunk);
      word = `${chunkWord} ${scales[scaleIndex]} ${word}`.trim();
    }

    num = Math.floor(num / 1000);
    scaleIndex++;
  }

  return word.replace(/\s+/g, " ").trim();
}

function chunkToWords(num: number): string {
  let word = "";

  if (num >= 100) {
    word += ones[Math.floor(num / 100)] + " hundred ";
    num %= 100;
  }

  if (num >= 20) {
    word += tens[Math.floor(num / 10)] + " ";
    num %= 10;
  }

  if (num > 0) {
    word += ones[num] + " ";
  }

  return word.trim();
}
