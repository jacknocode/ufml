'use client'

import React from 'react'
import { ReactFlowProvider } from 'reactflow'
import { FlowContainer } from '@/components/FlowContainer'

export function FixedReactFlow() {
  return (
    <div className="w-full h-screen" style={{ height: '100vh' }}>
      <ReactFlowProvider>
        <FlowContainer />
      </ReactFlowProvider>
    </div>
  )
}
