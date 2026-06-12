import { describe, it, expect } from 'vitest'
import { parseInput } from '../utils/parser'

describe('parseInput', () => {
  it('parses a screen with a name in brackets', () => {
    const input = '[Home]\nT Title'
    const { nodes } = parseInput(input, false)
    expect(nodes).toHaveLength(1)
    expect(nodes[0].data.label).toBe('Home')
    expect(nodes[0].type).toBe('screenNode')
  })

  it('parses items with various icon types', () => {
    const input = '[Screen]\nT Title text\nE Input field\nB Click button\nA Action item\nO Table view'
    const { nodes } = parseInput(input, false)
    expect(nodes[0].data.items).toHaveLength(5)
    expect(nodes[0].data.items[0].type).toBe('T')
    expect(nodes[0].data.items[0].text).toBe('Title text')
    expect(nodes[0].data.items[1].type).toBe('E')
    expect(nodes[0].data.items[2].type).toBe('B')
    expect(nodes[0].data.items[3].type).toBe('A')
    expect(nodes[0].data.items[4].type).toBe('O')
  })

  it('parses simple => connections between screens', () => {
    const input = '[ScreenA]\nA Go to B => ScreenB\n\n[ScreenB]\nT Content'
    const { nodes, edges } = parseInput(input, false)
    expect(nodes).toHaveLength(2)
    expect(edges).toHaveLength(1)
    expect(edges[0].source).toBe(nodes[0].id)
    expect(edges[0].target).toBe(nodes[1].id)
    expect(edges[0].label).toBeUndefined()
  })

  it('parses ={label}=> labeled connections', () => {
    const input = '[ScreenA]\nA Submit ={success}=> ScreenB\n\n[ScreenB]\nT Done'
    const { nodes, edges } = parseInput(input, false)
    expect(edges).toHaveLength(1)
    expect(edges[0].label).toBe('success')
  })

  it('parses ellipse (text) nodes', () => {
    const input = '[Screen]\nT Item\n(Processing)'
    const { nodes } = parseInput(input, false)
    const ellipseNodes = nodes.filter(n => n.type === 'ellipseNode')
    expect(ellipseNodes).toHaveLength(1)
    expect(ellipseNodes[0].data.label).toBe('Processing')
  })

  it('parses ellipse external connections (text) => target', () => {
    const input = '[ScreenA]\nT Item\n(Middleware) => ScreenB\n\n[ScreenB]\nT Content'
    const { nodes, edges } = parseInput(input, false)
    const ellipseNodes = nodes.filter(n => n.type === 'ellipseNode')
    expect(ellipseNodes).toHaveLength(1)
    expect(ellipseNodes[0].data.label).toBe('Middleware')
    expect(edges).toHaveLength(1)
    expect(edges[0].source).toBe(ellipseNodes[0].id)
  })

  it('parses //P: requirements', () => {
    const input = '[Screen]\n//P: Performance requirement\nT Item'
    const { nodes } = parseInput(input, false)
    expect(nodes[0].data.requirements).toHaveLength(1)
    expect(nodes[0].data.requirements[0].category).toBe('P')
    expect(nodes[0].data.requirements[0].content).toBe('Performance requirement')
  })

  it('parses //S: //A: //U: requirement categories', () => {
    const input = '[Screen]\n//S: Security req\n//A: Accessibility req\n//U: Usability req\nT Item'
    const { nodes } = parseInput(input, false)
    const reqs = nodes[0].data.requirements
    expect(reqs).toHaveLength(3)
    expect(reqs.find((r: { category: string }) => r.category === 'S')?.content).toBe('Security req')
    expect(reqs.find((r: { category: string }) => r.category === 'A')?.content).toBe('Accessibility req')
    expect(reqs.find((r: { category: string }) => r.category === 'U')?.content).toBe('Usability req')
  })

  it('parses -- separator as isSeparator item', () => {
    const input = '[Screen]\nT Item one\n--\nT Item two'
    const { nodes } = parseInput(input, false)
    const separators = nodes[0].data.items.filter((i: { isSeparator?: boolean }) => i.isSeparator)
    expect(separators).toHaveLength(1)
  })

  it('resolves pending connections across screens (forward references)', () => {
    // ScreenA references ScreenB before ScreenB is defined
    const input = '[ScreenA]\nA Forward link => ScreenB\n\n[ScreenB]\nT Destination'
    const { nodes, edges } = parseInput(input, false)
    expect(edges).toHaveLength(1)
    expect(edges[0].target).toBe(nodes[1].id)
  })

  it('resolves multiple screens with multiple connections', () => {
    const input = '[A]\nA Go => B\nA Also => C\n\n[B]\nT B content\n\n[C]\nT C content'
    const { nodes, edges } = parseInput(input, false)
    expect(nodes).toHaveLength(3)
    expect(edges).toHaveLength(2)
  })

  it('handles empty input gracefully', () => {
    const { nodes, edges } = parseInput('', false)
    expect(nodes).toHaveLength(0)
    expect(edges).toHaveLength(0)
  })

  it('ignores unknown requirement categories', () => {
    const input = '[Screen]\n//X: Unknown category\nT Item'
    const { nodes } = parseInput(input, false)
    expect(nodes[0].data.requirements).toHaveLength(0)
  })

  it('passes showAllRequirements flag to nodes', () => {
    const input = '[Screen]\nT Item'
    const { nodes: nodes1 } = parseInput(input, true)
    const { nodes: nodes2 } = parseInput(input, false)
    expect(nodes1[0].data.showAllRequirements).toBe(true)
    expect(nodes2[0].data.showAllRequirements).toBe(false)
  })
})
