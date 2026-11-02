import sum from "./Sum";


describe('sum function', () => {  // Test suite
  it('adds 1 + 2 to equal 3', () => {   // Test case
    expect(sum(1, 2)).toBe(3)   // Assertion
  })

  test('add negative number', () => {
    expect(sum(-1, -2)).toBe(-3)
  })
})
