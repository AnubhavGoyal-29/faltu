/**
 * Wordle Service Tests
 */

const { getDailyWord, checkWordGuess } = require('../../src/services/games/wordleService');

describe('Wordle Service', () => {
  test('getDailyWord should return a 5-letter word', async () => {
    const word = await getDailyWord();
    expect(word).toBeDefined();
    expect(word.length).toBe(5);
    expect(word).toBe(word.toUpperCase());
  });

  test('checkWordGuess should return correct structure', () => {
    const result = checkWordGuess('HELLO', 'WORLD');
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(5);
    result.forEach(r => {
      expect(r).toHaveProperty('letter');
      expect(r).toHaveProperty('status');
      expect(['correct', 'present', 'absent']).toContain(r.status);
    });
  });

  test('checkWordGuess should mark correct letters', () => {
    const result = checkWordGuess('HELLO', 'HELLO');
    expect(result.every(r => r.status === 'correct')).toBe(true);
  });

  test('checkWordGuess should handle partial matches', () => {
    const result = checkWordGuess('HELLO', 'HAPPY');
    // First letter should be correct
    expect(result[0].status).toBe('correct');
  });
});

