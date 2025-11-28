'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Zap, Leaf, TrendingDown, Target } from 'lucide-react'
import { useTranslation } from '@/contexts/TranslationContext'

// Tree node structure for visualization
interface TreeNode {
  id: string
  level: number
  x: number
  y: number
  label: string
  isVisible: boolean
  isLeaf: boolean
  lossReduction: number
  children?: TreeNode[]
}

// Leaf-wise tree growth component for LightGBM
function LeafWiseTreeGrowth() {
  const { t } = useTranslation()
  const [currentPath, setCurrentPath] = useState<string[]>([])
  const [isAnimating, setIsAnimating] = useState(false)
  const [completedPaths, setCompletedPaths] = useState<Set<string>>(new Set())

  // Create a tree structure that grows leaf-wise
  const buildTree = (): { nodes: TreeNode[], connections: Array<{ from: string, to: string }> } => {
    const nodes: TreeNode[] = []
    const connections: Array<{ from: string, to: string }> = []
    const levelHeight = 80
    const startX = 200

    // Level 0 (root)
    const root: TreeNode = {
      id: '0',
      level: 0,
      x: startX,
      y: 50,
      label: 'Root',
      isVisible: true,
      isLeaf: false,
      lossReduction: 0,
    }
    nodes.push(root)

    // Level 1 (2 nodes)
    for (let i = 0; i < 2; i++) {
      const node: TreeNode = {
        id: `1-${i}`,
        level: 1,
        x: startX - 100 + i * 200,
        y: 50 + levelHeight,
        label: `N${i + 1}`,
        isVisible: false,
        isLeaf: false,
        lossReduction: 0.3 + i * 0.1,
      }
      nodes.push(node)
      connections.push({ from: '0', to: `1-${i}` })
    }

    // Level 2 (4 nodes - some are leaves)
    const level2Nodes = [
      { id: '2-0', parent: '1-0', x: startX - 150, y: 50 + levelHeight * 2, isLeaf: false, loss: 0.25 },
      { id: '2-1', parent: '1-0', x: startX - 50, y: 50 + levelHeight * 2, isLeaf: true, loss: 0.35 },
      { id: '2-2', parent: '1-1', x: startX + 50, y: 50 + levelHeight * 2, isLeaf: false, loss: 0.30 },
      { id: '2-3', parent: '1-1', x: startX + 150, y: 50 + levelHeight * 2, isLeaf: true, loss: 0.20 },
    ]

    level2Nodes.forEach((n, i) => {
      const node: TreeNode = {
        id: n.id,
        level: 2,
        x: n.x,
        y: n.y,
        label: n.isLeaf ? `L${i + 1}` : `N${i + 1}`,
        isVisible: false,
        isLeaf: n.isLeaf,
        lossReduction: n.loss,
      }
      nodes.push(node)
      connections.push({ from: n.parent, to: n.id })
    })

    // Level 3 (leaves from level 2 non-leaves)
    const level3Nodes = [
      { id: '3-0', parent: '2-0', x: startX - 180, y: 50 + levelHeight * 3, isLeaf: true, loss: 0.28 },
      { id: '3-1', parent: '2-0', x: startX - 120, y: 50 + levelHeight * 3, isLeaf: true, loss: 0.22 },
      { id: '3-2', parent: '2-2', x: startX + 20, y: 50 + levelHeight * 3, isLeaf: true, loss: 0.26 },
      { id: '3-3', parent: '2-2', x: startX + 80, y: 50 + levelHeight * 3, isLeaf: true, loss: 0.32 },
    ]

    level3Nodes.forEach((n, i) => {
      const node: TreeNode = {
        id: n.id,
        level: 3,
        x: n.x,
        y: n.y,
        label: `L${i + 5}`,
        isVisible: false,
        isLeaf: true,
        lossReduction: n.loss,
      }
      nodes.push(node)
      connections.push({ from: n.parent, to: n.id })
    })

    return { nodes, connections }
  }

  const { nodes, connections } = buildTree()
  // Get all leaf nodes (excluding root which is always visible)
  const allLeaves = useMemo(() => nodes.filter(n => n.isLeaf && n.id !== '0'), [nodes])
  // Sort leaves by loss reduction (descending) to show best leaf first
  const sortedLeaves = useMemo(() => [...allLeaves].sort((a, b) => b.lossReduction - a.lossReduction), [allLeaves])
  const [nextLeafIndex, setNextLeafIndex] = useState(0)

  // Find path from root to a specific leaf
  const findPathToLeaf = (leafId: string): string[] => {
    const path: string[] = [leafId]
    let currentId = leafId
    
    while (currentId !== '0') {
      const conn = connections.find(c => c.to === currentId)
      if (conn) {
        path.unshift(conn.from)
        currentId = conn.from
      } else {
        break
      }
    }
    
    return path
  }

  useEffect(() => {
    if (isAnimating && nextLeafIndex < sortedLeaves.length) {
      const leaf = sortedLeaves[nextLeafIndex]
      const path = findPathToLeaf(leaf.id)
      
      // Animate path node by node
      let pathIndex = 0
      const pathTimer = setInterval(() => {
        if (pathIndex < path.length) {
          setCurrentPath(prev => {
            if (!prev.includes(path[pathIndex])) {
              return [...prev, path[pathIndex]]
            }
            return prev
          })
          pathIndex++
        } else {
          clearInterval(pathTimer)
          // Mark this path as completed
          setCompletedPaths(prev => {
            const newSet = new Set(prev)
            newSet.add(leaf.id)
            return newSet
          })
          // Clear current path and move to next
          setTimeout(() => {
            setCurrentPath([])
            setNextLeafIndex(prev => {
              const next = prev + 1
              if (next >= sortedLeaves.length) {
                setIsAnimating(false)
              }
              return next
            })
          }, 500)
        }
      }, 500)
      
      return () => clearInterval(pathTimer)
    }
  }, [isAnimating, nextLeafIndex, sortedLeaves, connections])

  const startAnimation = () => {
    setCurrentPath([])
    setCompletedPaths(new Set())
    setNextLeafIndex(0)
    setIsAnimating(true)
    // Reset all nodes except root
    nodes.forEach(n => {
      if (n.id !== '0') n.isVisible = false
    })
  }

  const getNodeVisibility = (nodeId: string): boolean => {
    if (nodeId === '0') return true
    
    // Check if this node is in the current path being animated
    if (currentPath.includes(nodeId)) return true
    
    // Check if this node is in any completed path
    for (const leafId of Array.from(completedPaths)) {
      const path = findPathToLeaf(leafId)
      if (path.includes(nodeId)) return true
    }
    
    return false
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center flex-wrap gap-2">
        <button
          onClick={startAnimation}
          className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors text-sm sm:text-base"
        >
          {isAnimating ? t('lgbm.treeGrowth.animating') : 'Start Animation'}
        </button>
        {nextLeafIndex > 0 && (
          <span className="text-sm text-gray-600">
            {t('lgbm.treeGrowth.split')} ({nextLeafIndex} / {sortedLeaves.length})
          </span>
        )}
      </div>
      <div className="relative w-full h-[400px] border-2 border-gray-200 rounded-lg bg-gray-50 overflow-x-auto">
        <svg width="100%" height="100%" viewBox="0 0 500 400" preserveAspectRatio="xMidYMid meet" className="absolute inset-0">
          {/* Draw connections - only show if both nodes are visible */}
          {connections.map((conn) => {
            const fromVisible = getNodeVisibility(conn.from)
            const toVisible = getNodeVisibility(conn.to)
            
            if (!fromVisible || !toVisible) return null
            
            const fromNode = nodes.find(n => n.id === conn.from)
            const toNode = nodes.find(n => n.id === conn.to)
            if (!fromNode || !toNode) return null
            
            return (
              <motion.line
                key={`line-${conn.from}-${conn.to}`}
                x1={fromNode.x}
                y1={fromNode.y + 25}
                x2={toNode.x}
                y2={toNode.y - 25}
                stroke="#ec4899"
                strokeWidth="2"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5 }}
              />
            )
          })}

          {/* Draw nodes */}
          {nodes.map((node) => {
            const visible = getNodeVisibility(node.id)
            const isInCurrentPath = currentPath.includes(node.id)
            const isCompleted = Array.from(completedPaths).some(leafId => {
              const path = findPathToLeaf(leafId)
              return path.includes(node.id)
            })
            
            return (
              <g key={node.id}>
                <motion.circle
                  cx={node.x}
                  cy={node.y}
                  r={node.isLeaf ? 22 : 25}
                  fill={visible 
                    ? (isInCurrentPath ? '#ec4899' : isCompleted ? '#f472b6' : '#f97316')
                    : '#e5e7eb'}
                  stroke={visible 
                    ? (isInCurrentPath ? '#be185d' : isCompleted ? '#db2777' : '#ea580c')
                    : '#d1d5db'}
                  strokeWidth="2"
                  strokeDasharray={node.isLeaf ? "4 2" : "0"}
                  initial={{ scale: 0 }}
                  animate={{ scale: visible ? 1 : 0 }}
                  transition={{ duration: 0.4 }}
                />
                <text
                  x={node.x}
                  y={node.y + 5}
                  textAnchor="middle"
                  fill="white"
                  fontSize="10"
                  fontWeight="bold"
                  opacity={visible ? 1 : 0}
                >
                  {node.label}
                </text>
                {node.isLeaf && visible && (
                  <text
                    x={node.x}
                    y={node.y + 35}
                    textAnchor="middle"
                    fill="#6b7280"
                    fontSize="9"
                    opacity={0.8}
                  >
                    {node.lossReduction.toFixed(2)}
                  </text>
                )}
              </g>
            )
          })}
        </svg>
      </div>
      <p className="text-xs sm:text-sm text-gray-500 text-center">
        One complete path grows at a time, choosing the leaf with maximum loss reduction
      </p>
    </div>
  )
}

export default function LightGBMViz() {
  const { t } = useTranslation()
  const [numLeaves, setNumLeaves] = useState(31)
  const [numTrees, setNumTrees] = useState(5)

  // Simulate training loss over iterations
  const lossData = Array.from({ length: numTrees }, (_, i) => ({
    iteration: i + 1,
    loss: Math.max(0.1, 0.8 - i * (0.7 / numTrees) + Math.random() * 0.1),
  }))

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{t('lgbm.title')}</h2>
        <p className="text-sm sm:text-base text-gray-600 px-2">
          {t('lgbm.subtitle')}
        </p>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 mb-3 sm:mb-4">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800">{t('lgbm.numLeaves')}</h3>
            <span className="text-2xl sm:text-3xl font-bold text-pink-600">{numLeaves}</span>
          </div>
          <input
            type="range"
            min="10"
            max="100"
            value={numLeaves}
            onChange={(e) => setNumLeaves(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-pink-500"
          />
          <p className="text-sm text-gray-600 mt-2">
            {t('lgbm.numLeaves.desc')}
          </p>
        </div>
        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 mb-3 sm:mb-4">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800">{t('lgbm.sequential.tree')}s</h3>
            <span className="text-2xl sm:text-3xl font-bold text-pink-600">{numTrees}</span>
          </div>
          <input
            type="range"
            min="3"
            max="20"
            value={numTrees}
            onChange={(e) => setNumTrees(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-pink-500"
          />
          <p className="text-sm text-gray-600 mt-2">
            {t('lgbm.sequential.desc')}
          </p>
        </div>
      </div>

      {/* Leaf-wise Tree Growth Visualization */}
      <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg">
        <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-800">{t('lgbm.treeGrowth.title')}</h3>
        <p className="text-sm text-gray-600 mb-4">{t('lgbm.treeGrowth.desc')}</p>
        <LeafWiseTreeGrowth />
      </div>

      {/* Sequential Tree Building Animation */}
      <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg">
        <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-800">{t('lgbm.sequential.title')}</h3>
        <p className="text-sm text-gray-600 mb-4">{t('lgbm.sequential.desc')}</p>
        <div className="space-y-4">
          {Array.from({ length: Math.min(numTrees, 5) }).map((_, idx) => {
            const treeNum = idx + 1
            const error = lossData[idx]?.loss || 0.5
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.2 }}
                className="flex items-center gap-2 sm:gap-4 p-3 sm:p-4 bg-gray-50 rounded-lg"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-pink-500 text-white flex items-center justify-center font-bold text-sm sm:text-base">
                  {treeNum}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0 mb-2">
                    <span className="font-semibold text-gray-800 text-sm sm:text-base">{t('lgbm.sequential.tree')} {treeNum}</span>
                    <span className="text-xs sm:text-sm text-gray-600">
                      {t('lgbm.sequential.error')} {(error * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(1 - error) * 100}%` }}
                      transition={{ delay: idx * 0.2 + 0.3, duration: 0.5 }}
                      className="h-full bg-pink-500"
                    />
                  </div>
                </div>
                  {idx < numTrees - 1 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.2 + 0.5 }}
                    className="text-pink-500"
                  >
                    →
                  </motion.div>
                )}
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Loss Reduction Chart */}
      <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg">
        <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-800">{t('lgbm.loss.title')}</h3>
        <div className="w-full h-[250px] sm:h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={lossData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#000000" />
              <XAxis 
                dataKey="iteration" 
                label={{ value: 'Tree Number', position: 'insideBottom', offset: -5, fill: '#111827' }} 
                tick={{ fill: '#111827' }}
                axisLine={{ stroke: '#000000' }}
                tickLine={{ stroke: '#000000' }}
              />
              <YAxis 
                label={{ value: 'Loss', angle: -90, position: 'insideLeft', fill: '#111827' }} 
                tick={{ fill: '#111827' }}
                axisLine={{ stroke: '#000000' }}
                tickLine={{ stroke: '#000000' }}
              />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="loss"
                stroke="#ec4899"
                strokeWidth={3}
                dot={{ fill: '#ec4899', r: 5 }}
                animationDuration={1000}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <p className="text-sm text-gray-600 mt-4 text-center">
          {t('lgbm.loss.desc')}
        </p>
      </div>

      {/* Prediction Combination Visualization */}
      <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg">
        <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-800">{t('lgbm.prediction.title')}</h3>
        <p className="text-sm text-gray-600 mb-4">{t('lgbm.prediction.desc')}</p>
        <div className="bg-gradient-to-r from-pink-50 to-pink-100 rounded-lg p-4 sm:p-6">
          <div className="font-mono text-sm sm:text-base lg:text-lg mb-3 sm:mb-4 text-center text-gray-800 overflow-x-auto">
            {t('lgbm.prediction.formula')}
          </div>
          <div className="space-y-3">
            {(() => {
              const treeValues = Array.from({ length: Math.min(numTrees, 4) }, (_, i) => 
                0.15 + (i * 0.08) + (Math.sin(i) * 0.05)
              )
              const total = treeValues.reduce((sum, val) => sum + val, 0)
              
              return (
                <>
                  {treeValues.map((treeValue, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.2 }}
                      className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm"
                    >
                      <div className="w-10 h-10 rounded-full bg-pink-500 text-white flex items-center justify-center font-bold text-sm">
                        {i + 1}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-gray-700">{t('lgbm.sequential.tree')} {i + 1}</div>
                        <div className="text-xs text-gray-500">Correction: {treeValue.toFixed(2)}</div>
                      </div>
                      <div className="text-lg font-bold text-pink-600">+{treeValue.toFixed(2)}</div>
                    </motion.div>
                  ))}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: treeValues.length * 0.2 + 0.3 }}
                    className="mt-4 pt-4 border-t-2 border-pink-300 flex items-center justify-between"
                  >
                    <span className="text-lg font-bold text-gray-800">{t('lgbm.prediction.title')}</span>
                    <span className="text-2xl font-bold text-pink-600">
                      {total.toFixed(2)}
                    </span>
                  </motion.div>
                </>
              )
            })()}
          </div>
        </div>
      </div>

      {/* Advantages */}
      <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg">
        <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-800">{t('lgbm.advantages.title')}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg p-4"
          >
            <Zap className="w-8 h-8 text-pink-600 mb-2" />
            <h4 className="font-semibold text-pink-600 mb-2">{t('lgbm.faster')}</h4>
            <p className="text-sm text-gray-700">
              {t('lgbm.faster.desc')}
            </p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg p-4"
          >
            <Leaf className="w-8 h-8 text-pink-600 mb-2" />
            <h4 className="font-semibold text-pink-600 mb-2">{t('lgbm.memory')}</h4>
            <p className="text-sm text-gray-700">
              {t('lgbm.memory.desc')}
            </p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg p-4"
          >
            <TrendingDown className="w-8 h-8 text-pink-600 mb-2" />
            <h4 className="font-semibold text-pink-600 mb-2">{t('lgbm.accuracy')}</h4>
            <p className="text-sm text-gray-700">
              {t('lgbm.accuracy.desc')}
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

