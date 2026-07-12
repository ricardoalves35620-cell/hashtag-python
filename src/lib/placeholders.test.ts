import { describe, expect, it } from 'vitest'
import { findPythonPlaceholders } from './placeholders'

describe('findPythonPlaceholders', () => {
  it('finds real placeholders', () => {
    expect(findPythonPlaceholders('age = ___\nprint(age)')).toEqual([{ line: 1, column: 7, token: '___' }])
  })

  it('ignores placeholders in comments', () => {
    expect(findPythonPlaceholders('name = input("Name: ") # remove ___ and parens')).toEqual([])
  })

  it('ignores placeholders in strings and docstrings', () => {
    const code = 'print("___")\ntext = "TODO"\n"""YOUR CODE HERE"""\nx = 1'
    expect(findPythonPlaceholders(code)).toEqual([])
  })
})
