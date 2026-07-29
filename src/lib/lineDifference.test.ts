import { describe, expect, it } from 'vitest'
import { describeLineDifference } from './learningValidation'

/**
 * Reported from the app: a learner produced
 *
 *   Average: 244.28571428571428
 *
 * where the task wanted
 *
 *   Average: 244.28571428571428 seconds
 *
 * and read the feedback's two quoted strings as identical — reasonably, since they
 * differ by one word at the very end. "Expected X, got Y" only helps when X and Y look
 * different at a glance.
 */
describe('the feedback points at the difference', () => {
  it('names what is missing from the end', () => {
    const message = describeLineDifference('Average: 244.29 seconds', 'Average: 244.29', 'en')
    expect(message).toContain('missing')
    expect(message).toContain(' seconds')
  })

  it('names what is extra at the end', () => {
    const message = describeLineDifference('Total: 1710', 'Total: 1710 seconds', 'en')
    expect(message).toContain('extra')
    expect(message).toContain(' seconds')
  })

  it('shows where two lines diverge in the middle', () => {
    const message = describeLineDifference('Total: 1710 seconds', 'Total: 1700 seconds', 'en')
    expect(message).toContain('Total: 17')
    expect(message).toMatch(/expects "10/)
  })

  it('does not pretend to find a shared prefix when there is none', () => {
    const message = describeLineDifference('Fee: 1600.0', 'Nothing here', 'en')
    expect(message).toContain('Expected a line like')
  })

  it('speaks Portuguese to a Portuguese learner', () => {
    const message = describeLineDifference('Média: 244.29 segundos', 'Média: 244.29', 'pt')
    expect(message).toContain('Falta')
    expect(message).toContain(' segundos')
  })
})

/**
 * Reported from the app, with a screenshot of a completely correct solution being failed.
 * The learner's loop, total, count and average were all right. They printed
 *
 *   Long songs (>4 min):  3        <- their order, and print() emitted two spaces
 *   Total time: 1710 seconds
 *   Average: ... seconds
 *
 * and the app said "one of the expected behaviors was not produced", about output that
 * was on screen and correct. Two separate defects: the contract required the authored
 * ORDER, and the explanation had no branch for "everything is present".
 */
describe('presentation is not logic', () => {
  const contract = (sample: string) => {
    const linePattern = (line: string) => line
      .replace(/[.*+?^${}()|[\]\\]/g, m => '\\' + m)
      .replace(/\s+/g, '\\s+')
    const lines = sample.trim().split('\n').map(l => l.trim()).filter(Boolean)
    return new RegExp(lines.map(l => `(?=[\\s\\S]*${linePattern(l)})`).join('') + '[\\s\\S]*')
  }

  const sample = 'Total time: 1710 seconds\nLong songs (>4 min): 3\nAverage: 244.29 seconds'

  it('accepts the right answer printed in a different order', () => {
    const learner = 'Long songs (>4 min): 3\nTotal time: 1710 seconds\nAverage: 244.29 seconds'
    expect(contract(sample).test(learner)).toBe(true)
  })

  it('accepts extra spacing from print("label: ", value)', () => {
    const learner = 'Total time: 1710 seconds\nLong songs (>4 min):  3\nAverage: 244.29 seconds'
    expect(contract(sample).test(learner)).toBe(true)
  })

  it('still rejects a wrong value', () => {
    const learner = 'Total time: 1700 seconds\nLong songs (>4 min): 3\nAverage: 244.29 seconds'
    expect(contract(sample).test(learner)).toBe(false)
  })

  it('still rejects a missing line', () => {
    expect(contract(sample).test('Total time: 1710 seconds\nAverage: 244.29 seconds')).toBe(false)
  })
})
