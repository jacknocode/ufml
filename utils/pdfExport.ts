import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'

export async function exportToPDF(
  flowRef: React.RefObject<HTMLDivElement>,
  fitBounds: (bounds: any) => void,
  getNodes: () => any[],
  getViewport: () => any,
  fitView: (options: any) => void
) {
  if (!flowRef.current) {
    console.error('flowRef.current is null')
    return
  }

  try {
    console.log('Starting PDF export...')

    // Hide controls and other UI elements
    const controlsElement = flowRef.current.querySelector(
      '.react-flow__controls'
    )
    const minimapElement = flowRef.current.querySelector('.react-flow__minimap')
    const panelElement = flowRef.current.querySelector('.react-flow__panel')

    if (controlsElement) controlsElement.classList.add('hidden')
    if (minimapElement) minimapElement.classList.add('hidden')
    if (panelElement) panelElement.classList.add('hidden')

    // Get all nodes and calculate the bounding box
    const nodes = getNodes()
    const nodesBounds = nodes.reduce(
      (acc, node) => {
        if (node.position.x < acc.minX) acc.minX = node.position.x
        if (node.position.y < acc.minY) acc.minY = node.position.y
        if (node.position.x + (node.width || 0) > acc.maxX)
          acc.maxX = node.position.x + (node.width || 0)
        if (node.position.y + (node.height || 0) > acc.maxY)
          acc.maxY = node.position.y + (node.height || 0)
        return acc
      },
      { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity }
    )

    // Add padding to the bounding box
    const padding = 50
    const bounds = {
      x: nodesBounds.minX - padding,
      y: nodesBounds.minY - padding,
      width: nodesBounds.maxX - nodesBounds.minX + 2 * padding,
      height: nodesBounds.maxY - nodesBounds.minY + 2 * padding,
    }

    // Fit the view to the calculated bounds
    fitBounds(bounds)

    // Wait for the view to update
    await new Promise(resolve => setTimeout(resolve, 100))

    const { zoom } = getViewport()

    console.log('Generating canvas...')
    const canvas = await html2canvas(flowRef.current, {
      scale: 2 / zoom,
      logging: true, // ロギングを有効にする
      useCORS: true,
      ignoreElements: element => {
        return (
          element.classList.contains('react-flow__panel') ||
          element.classList.contains('react-flow__controls') ||
          element.classList.contains('react-flow__minimap')
        )
      },
    })
    console.log('Canvas generated successfully')

    // Show controls and other UI elements again
    if (controlsElement) controlsElement.classList.remove('hidden')
    if (minimapElement) minimapElement.classList.remove('hidden')
    if (panelElement) panelElement.classList.remove('hidden')

    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'px',
      format: [canvas.width, canvas.height],
    })

    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height)
    console.log('Saving PDF...')
    pdf.save('screen-flow-diagram.pdf')
    console.log('PDF saved successfully')

    // Reset the view
    fitView({ padding: 0.2 })
  } catch (error) {
    console.error('PDFの生成中にエラーが発生しました:', error)
    throw error // エラーを再スローして、呼び出し元で処理できるようにする
  }
}
