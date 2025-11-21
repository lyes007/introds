'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from '@/contexts/TranslationContext'

export default function KNNViz() {
  const { t } = useTranslation()
  const [k, setK] = useState(5)
  const [step, setStep] = useState(0)
  const [showNeighbors, setShowNeighbors] = useState(false)

  // Sample data points (age, device_type, click)
  const dataPoints = [
    { x: 20, y: 30, label: 'No Click', color: '#ef4444' },
    { x: 25, y: 35, label: 'Click', color: '#10b981' },
    { x: 30, y: 40, label: 'Click', color: '#10b981' },
    { x: 35, y: 45, label: 'Click', color: '#10b981' },
    { x: 40, y: 50, label: 'No Click', color: '#ef4444' },
    { x: 45, y: 55, label: 'Click', color: '#10b981' },
    { x: 50, y: 60, label: 'Click', color: '#10b981' },
    { x: 55, y: 65, label: 'No Click', color: '#ef4444' },
    { x: 60, y: 70, label: 'No Click', color: '#ef4444' },
    { x: 25, y: 25, label: 'Click', color: '#10b981' },
    { x: 35, y: 30, label: 'Click', color: '#10b981' },
    { x: 45, y: 35, label: 'No Click', color: '#ef4444' },
  ]

  const [newPoint, setNewPoint] = useState({ x: 40, y: 45 })
  const [neighbors, setNeighbors] = useState<number[]>([])

  useEffect(() => {
    // Calculate distances and find k nearest neighbors
    const distances = dataPoints.map((point, index) => ({
      index,
      distance: Math.sqrt(
        Math.pow(point.x - newPoint.x, 2) + Math.pow(point.y - newPoint.y, 2)
      ),
    }))

    distances.sort((a, b) => a.distance - b.distance)
    const kNearest = distances.slice(0, k).map((d) => d.index)
    setNeighbors(kNearest)
  }, [k, newPoint])

  const prediction = neighbors.length > 0
    ? neighbors.filter((idx) => dataPoints[idx].label === 'Click').length >
      neighbors.filter((idx) => dataPoints[idx].label === 'No Click').length
      ? 'Click'
      : 'No Click'
    : 'Unknown'

  const steps = [
    {
      title: t('knn.step1.title'),
      description: t('knn.step1.desc', { k: String(k) }),
    },
    {
      title: t('knn.step2.title'),
      description: t('knn.step2.desc', { k: String(k) }),
    },
    {
      title: t('knn.step3.title'),
      description: t('knn.step3.desc', { k: String(k) }),
    },
  ]

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{t('knn.title')}</h2>
        <p className="text-sm sm:text-base text-gray-600 px-2">
          {t('knn.subtitle')}
        </p>
      </div>

      {/* K Value Slider */}
      <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 mb-3 sm:mb-4">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800">{t('knn.kValue')}</h3>
          <span className="text-2xl sm:text-3xl font-bold text-primary-600">{k}</span>
        </div>
        <input
          type="range"
          min="1"
          max="12"
          value={k}
          onChange={(e) => setK(parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-500"
        />
        <p className="text-sm text-gray-600 mt-2">
          {t('knn.kValue.desc')}
        </p>
      </div>

      {/* Step Navigation */}
      <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
        {steps.map((s, i) => (
          <button
            key={i}
            onClick={() => {
              setStep(i)
              setShowNeighbors(i >= 0)
            }}
            className={`px-3 py-2 sm:px-4 sm:py-2 rounded-lg transition-all text-sm sm:text-base ${
              step === i
                ? 'bg-green-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {t('step')} {i + 1}
          </button>
        ))}
      </div>

      {/* Current Step Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 sm:p-6"
        >
          <h3 className="text-xl sm:text-2xl font-semibold mb-2">{steps[step].title}</h3>
          <p className="text-sm sm:text-base text-gray-700">{steps[step].description}</p>
        </motion.div>
      </AnimatePresence>

      {/* Interactive Visualization */}
      <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg">
        <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-800">{t('knn.viz.title')}</h3>
        <div className="relative bg-gray-50 rounded-lg p-2 sm:p-4 h-[300px] sm:h-[400px]">
          <svg width="100%" height="100%" viewBox="0 0 100 100" className="absolute inset-0">
            {/* Draw lines to neighbors */}
            {showNeighbors &&
              neighbors.map((idx) => {
                const point = dataPoints[idx]
                return (
                  <motion.line
                    key={idx}
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.5 }}
                    x1={newPoint.x}
                    y1={newPoint.y}
                    x2={point.x}
                    y2={point.y}
                    stroke="#3b82f6"
                    strokeWidth="0.5"
                    strokeDasharray="2 2"
                  />
                )
              })}

            {/* Draw data points */}
            {dataPoints.map((point, idx) => {
              const isNeighbor = neighbors.includes(idx)
              return (
                <motion.circle
                  key={idx}
                  cx={point.x}
                  cy={point.y}
                  r={isNeighbor ? 2.5 : 1.5}
                  fill={isNeighbor ? '#3b82f6' : point.color}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                />
              )
            })}

            {/* New point to classify */}
            <motion.circle
              cx={newPoint.x}
              cy={newPoint.y}
              r={3}
              fill="#f59e0b"
              stroke="#fff"
              strokeWidth="1"
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{
                repeat: Infinity,
                duration: 2,
              }}
            />
          </svg>

          {/* Legend */}
          <div className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4 bg-white rounded-lg p-2 sm:p-3 shadow-md">
            <div className="flex items-center gap-2 mb-1 sm:mb-2">
              <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-green-500"></div>
              <span className="text-xs sm:text-sm text-gray-800">{t('knn.legend.click')}</span>
            </div>
            <div className="flex items-center gap-2 mb-1 sm:mb-2">
              <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-red-500"></div>
              <span className="text-xs sm:text-sm text-gray-800">{t('knn.legend.noClick')}</span>
            </div>
            <div className="flex items-center gap-2 mb-1 sm:mb-2">
              <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-blue-500"></div>
              <span className="text-xs sm:text-sm text-gray-800">{t('knn.legend.neighbor')}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-orange-500 border-2 border-white"></div>
              <span className="text-xs sm:text-sm text-gray-800">{t('knn.legend.newPoint')}</span>
            </div>
          </div>
        </div>

        {/* Prediction Result */}
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className={`mt-4 sm:mt-6 p-3 sm:p-4 rounded-lg text-center border-2 ${
            prediction === 'Click'
              ? 'bg-gradient-to-r from-green-100 to-green-200 text-green-900 border-green-300'
              : 'bg-gradient-to-r from-red-100 to-red-200 text-red-900 border-red-300'
          }`}
        >
          <div className="text-xs sm:text-sm mb-1 font-semibold">{t('knn.prediction')}</div>
          <div className="text-3xl sm:text-4xl font-bold">{prediction}</div>
          <div className="text-sm mt-2">
            {t('knn.prediction.based', { 
              count: String(neighbors.filter((idx) => dataPoints[idx].label === prediction).length),
              k: String(k)
            })}
          </div>
        </motion.div>
      </div>

      {/* Model Characteristics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-white rounded-lg p-4 shadow-md"
        >
          <h4 className="font-semibold text-green-600 mb-2">{t('knn.simple')}</h4>
          <p className="text-sm text-gray-600">{t('knn.simple.desc')}</p>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-white rounded-lg p-4 shadow-md"
        >
          <h4 className="font-semibold text-green-600 mb-2">{t('knn.nonParametric')}</h4>
          <p className="text-sm text-gray-600">{t('knn.nonParametric.desc')}</p>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-white rounded-lg p-4 shadow-md"
        >
          <h4 className="font-semibold text-green-600 mb-2">{t('knn.kSelection')}</h4>
          <p className="text-sm text-gray-600">{t('knn.kSelection.desc')}</p>
        </motion.div>
      </div>
    </div>
  )
}

