'use client'

import { useState, useMemo, useCallback } from 'react'
import { motion } from 'framer-motion'
import { TreePine } from 'lucide-react'
import { useTranslation } from '@/contexts/TranslationContext'

interface TreeNode {
  id: string
  feature?: string
  threshold?: number | string
  left?: TreeNode
  right?: TreeNode
  prediction?: 'click' | 'noClick'
  samples?: number
  value?: [number, number] // [noClick, click]
}

// Simplified decision tree based on the notebook features
const buildTree = (): TreeNode => {
  return {
    id: 'root',
    feature: 'age',
    threshold: 35,
    samples: 10000,
    value: [3500, 6500],
    left: {
      id: 'node1',
      feature: 'ad_position',
      threshold: 'Bottom',
      samples: 4000,
      value: [1200, 2800],
      left: {
        id: 'leaf1',
        prediction: 'click',
        samples: 2800,
        value: [0, 2800],
      },
      right: {
        id: 'node2',
        feature: 'device_type',
        threshold: 'Mobile',
        samples: 1200,
        value: [800, 400],
        left: {
          id: 'leaf2',
          prediction: 'noClick',
          samples: 800,
          value: [800, 0],
        },
        right: {
          id: 'leaf3',
          prediction: 'click',
          samples: 400,
          value: [0, 400],
        },
      },
    },
    right: {
      id: 'node3',
      feature: 'gender',
      threshold: 'Female',
      samples: 6000,
      value: [2300, 3700],
      left: {
        id: 'node4',
        feature: 'time_of_day',
        threshold: 'Afternoon',
        samples: 3000,
        value: [1000, 2000],
        left: {
          id: 'leaf4',
          prediction: 'click',
          samples: 2000,
          value: [0, 2000],
        },
        right: {
          id: 'leaf5',
          prediction: 'noClick',
          samples: 1000,
          value: [1000, 0],
        },
      },
      right: {
        id: 'leaf6',
        prediction: 'click',
        samples: 3000,
        value: [1300, 1700],
      },
    },
  }
}

export default function DecisionTreeViz() {
  const { t } = useTranslation()
  const [visibleNodes, setVisibleNodes] = useState<Set<string>>(new Set())
  const [isAnimating, setIsAnimating] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  
  // Memoize tree to prevent recreation on every render
  const tree = useMemo(() => buildTree(), [])

  // Get all nodes in level-order (breadth-first) for building animation
  const getNodesInOrder = useCallback((root: TreeNode): string[] => {
    const result: string[] = []
    const queue: TreeNode[] = [root]
    
    while (queue.length > 0) {
      const node = queue.shift()!
      result.push(node.id)
      
      if (node.left) queue.push(node.left)
      if (node.right) queue.push(node.right)
    }
    
    return result
  }, [])

  const allNodes = useMemo(() => getNodesInOrder(tree), [tree, getNodesInOrder])

  const startAnimation = () => {
    setVisibleNodes(new Set())
    setCurrentStep(0)
    setIsAnimating(true)
    
    let index = 0
    const timer = setInterval(() => {
      if (index < allNodes.length) {
        setVisibleNodes(prev => new Set([...prev, allNodes[index]]))
        setCurrentStep(index + 1)
        index++
      } else {
        clearInterval(timer)
        setIsAnimating(false)
      }
    }, 800)
  }

  const renderNode = (node: TreeNode | undefined, x: number, y: number, level: number) => {
    if (!node) return null

    const isVisible = visibleNodes.has(node.id)
    const isLeaf = !!node.prediction
    const nodeWidth = 100
    const nodeHeight = 60
    const levelHeight = 90
    const spacing = Math.pow(2, 4 - level) * 40

    // Only render if node is visible or if we need to show connections
    const shouldShowConnection = node.left && visibleNodes.has(node.id) && visibleNodes.has(node.left.id)
    const shouldShowRightConnection = node.right && visibleNodes.has(node.id) && visibleNodes.has(node.right.id)

    return (
      <g key={node.id}>
        {/* Node rectangle - only show if visible */}
        {isVisible && (
          <motion.rect
            x={x - nodeWidth / 2}
            y={y - nodeHeight / 2}
            width={nodeWidth}
            height={nodeHeight}
            rx={8}
            fill={isLeaf ? (node.prediction === 'click' ? '#10b981' : '#ef4444') : '#3b82f6'}
            stroke="#1e40af"
            strokeWidth={2}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, type: 'spring' }}
          />
        )}
        
        {/* Node content - only show if visible */}
        {isVisible && (
          <>
            {isLeaf ? (
              <>
                <text
                  x={x}
                  y={y - 5}
                  textAnchor="middle"
                  fill="white"
                  fontSize="10"
                  fontWeight="bold"
                >
                  {node.prediction === 'click' ? t('click') : t('noClick')}
                </text>
                <text
                  x={x}
                  y={y + 10}
                  textAnchor="middle"
                  fill="white"
                  fontSize="8"
                >
                  {node.samples}
                </text>
              </>
            ) : (
              <>
                <text
                  x={x}
                  y={y - 10}
                  textAnchor="middle"
                  fill="white"
                  fontSize="9"
                  fontWeight="bold"
                >
                  {node.feature}
                </text>
                <text
                  x={x}
                  y={y + 3}
                  textAnchor="middle"
                  fill="white"
                  fontSize="8"
                >
                  {typeof node.threshold === 'number' 
                    ? `≤ ${node.threshold}` 
                    : `= ${node.threshold}`}
                </text>
                <text
                  x={x}
                  y={y + 15}
                  textAnchor="middle"
                  fill="white"
                  fontSize="7"
                >
                  {node.samples}
                </text>
              </>
            )}
          </>
        )}

        {/* Connections - only show if both nodes are visible */}
        {shouldShowConnection && node.left && (
          <>
            <motion.line
              x1={x}
              y1={y + nodeHeight / 2}
              x2={x - spacing / 2}
              y2={y + levelHeight - nodeHeight / 2}
              stroke="#3b82f6"
              strokeWidth={2}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5 }}
            />
            <text
              x={x - spacing / 4}
              y={y + levelHeight / 2 + 3}
              textAnchor="middle"
              fill="#111827"
              fontSize="8"
              fontWeight="500"
            >
              Yes
            </text>
          </>
        )}
        {shouldShowRightConnection && node.right && (
          <>
            <motion.line
              x1={x}
              y1={y + nodeHeight / 2}
              x2={x + spacing / 2}
              y2={y + levelHeight - nodeHeight / 2}
              stroke="#3b82f6"
              strokeWidth={2}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5 }}
            />
            <text
              x={x + spacing / 4}
              y={y + levelHeight / 2 + 3}
              textAnchor="middle"
              fill="#111827"
              fontSize="8"
              fontWeight="500"
            >
              No
            </text>
          </>
        )}

        {/* Children */}
        {node.left && renderNode(node.left, x - spacing / 2, y + levelHeight, level + 1)}
        {node.right && renderNode(node.right, x + spacing / 2, y + levelHeight, level + 1)}
      </g>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{t('dt.title')}</h2>
        <p className="text-sm sm:text-base text-gray-600 px-2">
          {t('dt.subtitle')}
        </p>
      </div>

      {/* Animation Controls */}
      <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg">
        <h3 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800">Tree Construction Animation</h3>
        <p className="text-sm text-gray-600 mb-4">
          Watch how a decision tree is built step by step. The algorithm starts with all data at the root, then splits based on features that best separate the classes.
        </p>
        <div className="flex items-center gap-4">
          <button
            onClick={startAnimation}
            disabled={isAnimating}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <TreePine className="w-5 h-5" />
            {isAnimating ? `Building... (${currentStep}/${allNodes.length})` : 'Build Tree'}
          </button>
          {isAnimating && (
            <div className="flex-1">
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-blue-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${(currentStep / allNodes.length) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tree Visualization */}
      <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg">
        <h3 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800">Decision Tree Construction</h3>
        <p className="text-sm text-gray-600 mb-4">
          The tree is built from top to bottom. Each split chooses the feature that best separates the data into "Click" and "No Click" groups.
        </p>
        <div className="w-full overflow-x-auto">
          <svg width="100%" height="450" viewBox="0 0 600 450" className="border-2 border-gray-200 rounded-lg bg-gray-50">
            {renderNode(tree, 300, 40, 0)}
          </svg>
        </div>
      </div>

      {/* Explanation */}
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 sm:p-6">
        <h3 className="text-lg sm:text-xl font-semibold mb-3 text-gray-800">How Decision Trees Work</h3>
        <div className="space-y-2 text-sm text-gray-700">
          <p><strong>1. Start with all data:</strong> Begin with all training examples at the root node.</p>
          <p><strong>2. Find best split:</strong> Test each feature to find which one best separates "Click" from "No Click".</p>
          <p><strong>3. Create branches:</strong> Split the data into left and right child nodes based on the chosen feature.</p>
          <p><strong>4. Repeat:</strong> Continue splitting each node until a stopping condition is met (e.g., max depth, pure nodes).</p>
          <p><strong>5. Make predictions:</strong> New data follows the tree path to reach a leaf node with the final prediction.</p>
        </div>
      </div>
    </div>
  )
}

