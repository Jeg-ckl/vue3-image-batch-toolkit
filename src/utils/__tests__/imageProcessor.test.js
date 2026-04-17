import { describe, it, expect } from 'vitest'
import { formatFileSize } from '../imageProcessor'

describe('formatFileSize', () => {
  it('should return 0 Bytes for 0', () => {
    expect(formatFileSize(0)).toBe('0 Bytes')
  })

  it('should format bytes correctly', () => {
    expect(formatFileSize(500)).toBe('500 Bytes')
  })

  it('should format KB correctly', () => {
    expect(formatFileSize(1024)).toBe('1 KB')
    expect(formatFileSize(2048)).toBe('2 KB')
  })

  it('should format MB correctly', () => {
    expect(formatFileSize(1048576)).toBe('1 MB')
  })

  it('should format GB correctly', () => {
    expect(formatFileSize(1073741824)).toBe('1 GB')
  })
})
