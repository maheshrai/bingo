// MDN - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
// Borrowed from MDN
export function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}

/**
 * Creates a Bingo Card array
 */
export function createBingoCard() {
  // for simplicity, we will use the 6 columns of 2 numbers and 3 columns of 1 numbers
  // Randomize what columns will have 2s
  const columns = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  const colsWithTwoNums = getNumbers(0, 8, 6);
  const colsWithOneNums = columns.filter((x) => colsWithTwoNums.indexOf(x) < 0);
  var numbers = [];

  colsWithTwoNums.forEach((n) => {
    var y = n === 0 ? 9 : n === 8 ? 90 : n * 10 + 9;
    var x = n === 0 ? 1 : n === 8 ? 81 : y - 9;
    var z = getNumbers(x, y, 2);
    numbers.push(z[0]);
    numbers.push(z[1]);
  });

  colsWithOneNums.forEach((n) => {
    var y = n === 0 ? 9 : n === 8 ? 90 : n * 10 + 9;
    var x = n === 0 ? 1 : n === 8 ? 81 : y - 9;
    var z = getNumbers(x, y, 1);
    numbers.push(z[0]);
  });

  numbers.sort(function (a, b) {
    return a - b;
  });

  // 0 - 8, 9 - 17, 18 - 26
  const card = new Array(27).fill(0);
  const firstRow = getFiveIndexes(numbers, []);
  firstRow.forEach((i) => {
    var y = i === 0 ? 9 : i === 8 ? 90 : i * 10 + 9;
    var x = i === 0 ? 1 : i === 8 ? 81 : y - 9;
    card[i] = numbers.find((n) => n >= x && n <= y);
  });
  numbers = numbers.filter((n) => !card.includes(n));

  // Identify the 2 ro columns that were not part of first row
  // These must be included in the second row
  var colsWithTwoNumsNotInFirstRow = colsWithTwoNums.filter(
    (n) => !firstRow.includes(n)
  );

  const secondRow = getFiveIndexes(numbers, colsWithTwoNumsNotInFirstRow);
  secondRow.forEach((i) => {
    var y = i === 0 ? 9 : i === 8 ? 90 : i * 10 + 9;
    var x = i === 0 ? 1 : i === 8 ? 81 : y - 9;
    card[i + 9] = numbers.find((n) => n >= x && n <= y);
  });
  numbers = numbers.filter((n) => !card.includes(n));

  // Should have 5 numbers remaining
  numbers.forEach((n) => {
    // fill out card indexes 18 - 26
    var x = Math.floor(n / 10);
    if (n === 90) x = 8;
    card[x + 18] = n;
  });
  numbers = numbers.filter((n) => !card.includes(n));

  return card;
}

function getNumbers(min, max, length) {
  var arr = [];
  do {
    const n = getRandomIntInclusive(min, max);

    if (arr.findIndex((element) => element === n) === -1) {
      arr.push(n);
    }
  } while (arr.length < length);
  return arr;
}

function getFiveIndexes(numbers, mustHaveIndexes) {
  var indexes = [...mustHaveIndexes];
  do {
    const idx = getRandomIntInclusive(0, 8);
    const y = (idx + 1) * 10;
    const x = y - 9;
    var z = numbers.find((n) => n >= x && n <= y);
    if (z && indexes.findIndex((element) => element === idx) === -1) {
      indexes.push(idx);
    }
  } while (indexes.length < 5);
  return indexes;
}
