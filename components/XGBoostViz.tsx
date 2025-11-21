'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { TrendingUp, Layers, Target } from 'lucide-react'
import { useTranslation } from '@/contexts/TranslationContext'

export default function XGBoostViz() {
  const { t } = useTranslation()
  const [step, setStep] = useState(0)
  const [numTrees, setNumTrees] = useState(5)
  const [learningRate, setLearningRate] = useState(0.1)

  // Simulate training loss over iterations
  const lossData = Array.from({ length: numTrees }, (_, i) => ({
    iteration: i + 1,
    loss: Math.max(0.1, 0.8 - i * (0.7 / numTrees) + Math.random() * 0.1),
  }))

  const steps = [
    {
      title: t('xgb.step1.title'),
      description: t('xgb.step1.desc'),
      icon: Layers,
    },
    {
      title: t('xgb.step2.title'),
      description: t('xgb.step2.desc'),
      icon: TrendingUp,
    },
    {
      title: t('xgb.step3.title'),
      description: t('xgb.step3.desc'),
      icon: Target,
    },
  ]

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{t('xgb.title')}</h2>
        <p className="text-sm sm:text-base text-gray-600 px-2">
          {t('xgb.subtitle')}
        </p>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 mb-3 sm:mb-4">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800">{t('xgb.numTrees')}</h3>
          <span className="text-2xl sm:text-3xl font-bold text-orange-600">{numTrees}</span>
        </div>
        <input
          type="range"
          min="3"
          max="20"
          value={numTrees}
          onChange={(e) => setNumTrees(parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
        />
      </div>
        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 mb-3 sm:mb-4">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800">{t('xgb.learningRate')}</h3>
            <span className="text-2xl sm:text-3xl font-bold text-orange-600">{learningRate.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min="0.01"
            max="0.3"
            step="0.01"
            value={learningRate}
            onChange={(e) => setLearningRate(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
          />
          <p className="text-sm text-gray-600 mt-2">
            {t('xgb.learningRate.desc')}
          </p>
        </div>
      </div>

      {/* Step Navigation */}
      <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
        {steps.map((s, i) => {
          const Icon = s.icon
          return (
            <button
              key={i}
              onClick={() => setStep(i)}
              className={`px-3 py-2 sm:px-4 sm:py-2 rounded-lg transition-all flex items-center gap-2 text-sm sm:text-base ${
                step === i
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
              {t('step')} {i + 1}
            </button>
          )
        })}
      </div>

      {/* Current Step Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 sm:p-6"
        >
          <div className="flex items-start gap-3 sm:gap-4">
            {(() => {
              const StepIcon = steps[step]?.icon
              return StepIcon ? <StepIcon className="w-10 h-10 sm:w-12 sm:h-12 text-orange-600 flex-shrink-0" /> : null
            })()}
            <div>
              <h3 className="text-xl sm:text-2xl font-semibold mb-2">{steps[step].title}</h3>
              <p className="text-sm sm:text-base text-gray-700">{steps[step].description}</p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Sequential Tree Building Animation */}
      <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg">
        <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-800">{t('xgb.sequential.title')}</h3>
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
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold text-sm sm:text-base">
                  {treeNum}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0 mb-2">
                    <span className="font-semibold text-gray-800 text-sm sm:text-base">{t('xgb.sequential.tree')} {treeNum}</span>
                    <span className="text-xs sm:text-sm text-gray-600">
                      {t('xgb.sequential.error')} {(error * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(1 - error) * 100}%` }}
                      transition={{ delay: idx * 0.2 + 0.3, duration: 0.5 }}
                      className="h-full bg-orange-500"
                    />
                  </div>
                </div>
                {idx < numTrees - 1 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.2 + 0.5 }}
                    className="text-orange-500"
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
        <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-800">{t('xgb.loss.title')}</h3>
        <div className="w-full h-[250px] sm:h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
          <LineChart data={lossData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="iteration" label={{ value: 'Tree Number', position: 'insideBottom', offset: -5 }} />
            <YAxis label={{ value: 'Loss', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="loss"
              stroke="#f97316"
              strokeWidth={3}
              dot={{ fill: '#f97316', r: 5 }}
              animationDuration={1000}
            />
          </LineChart>
        </ResponsiveContainer>
        </div>
        <p className="text-sm text-gray-600 mt-4 text-center">
          {t('xgb.loss.desc')}
        </p>
      </div>

      {/* Prediction Formula */}
      <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg">
        <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-800">{t('xgb.formula.title')}</h3>
        <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-4 sm:p-6">
          <div className="font-mono text-sm sm:text-base lg:text-lg mb-3 sm:mb-4 text-center text-gray-800 overflow-x-auto">
            {t('xgb.formula.eq')}
          </div>
          <div className="text-xs sm:text-sm text-gray-700 space-y-2">
            <p>
              {t('xgb.formula.point1')}
            </p>
            <p>
              {t('xgb.formula.point2')}
            </p>
            <p>
              {t('xgb.formula.point3', { rate: learningRate.toFixed(2) })}
            </p>
            <p>
              {t('xgb.formula.point4')}
            </p>
          </div>
        </div>
      </div>

      {/* Model Characteristics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-white rounded-lg p-4 shadow-md"
        >
          <h4 className="font-semibold text-orange-600 mb-2">{t('xgb.performance')}</h4>
          <p className="text-sm text-gray-600">{t('xgb.performance.desc')}</p>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-white rounded-lg p-4 shadow-md"
        >
          <h4 className="font-semibold text-orange-600 mb-2">{t('xgb.fast')}</h4>
          <p className="text-sm text-gray-600">{t('xgb.fast.desc')}</p>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-white rounded-lg p-4 shadow-md"
        >
          <h4 className="font-semibold text-orange-600 mb-2">{t('xgb.error')}</h4>
          <p className="text-sm text-gray-600">{t('xgb.error.desc')}</p>
        </motion.div>
      </div>
    </div>
  )
}

