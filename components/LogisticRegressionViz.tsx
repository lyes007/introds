'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useTranslation } from '@/contexts/TranslationContext'

export default function LogisticRegressionViz() {
  const { t } = useTranslation()
  const [step, setStep] = useState(0)
  const [weights, setWeights] = useState({ age: 0.5, device: 0.3, time: 0.2 })
  const [prediction, setPrediction] = useState(0)

  // Generate sigmoid curve data
  const sigmoidData = Array.from({ length: 100 }, (_, i) => {
    const x = (i - 50) / 10
    return {
      x: x.toFixed(1),
      y: 1 / (1 + Math.exp(-x)),
    }
  })

  // Calculate prediction based on weights
  useEffect(() => {
    const z = weights.age * 0.6 + weights.device * 0.4 + weights.time * 0.3
    const prob = 1 / (1 + Math.exp(-z))
    setPrediction(prob)
  }, [weights])

  const steps = [
    {
      title: t('lr.step1.title'),
      description: t('lr.step1.desc'),
      formula: t('lr.step1.formula'),
    },
    {
      title: t('lr.step2.title'),
      description: t('lr.step2.desc'),
      formula: t('lr.step2.formula'),
    },
    {
      title: t('lr.step3.title'),
      description: t('lr.step3.desc'),
      formula: t('lr.step3.formula'),
    },
  ]

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{t('lr.title')}</h2>
        <p className="text-sm sm:text-base text-gray-600 px-2">{t('lr.subtitle')}</p>
      </div>

      {/* Step Navigation */}
      <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
        {steps.map((s, i) => (
          <button
            key={i}
            onClick={() => setStep(i)}
            className={`px-3 py-2 sm:px-4 sm:py-2 rounded-lg transition-all text-sm sm:text-base ${
              step === i
                ? 'bg-primary-500 text-white'
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
          className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 sm:p-6"
        >
          <h3 className="text-xl sm:text-2xl font-semibold mb-2">{steps[step].title}</h3>
          <p className="text-sm sm:text-base text-gray-700 mb-3 sm:mb-4">{steps[step].description}</p>
          <div className="bg-white rounded-lg p-3 sm:p-4 font-mono text-sm sm:text-base lg:text-lg text-center text-gray-800 overflow-x-auto">
            {steps[step].formula}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Interactive Sigmoid Curve */}
      <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg">
        <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-800">{t('lr.sigmoid.title')}</h3>
        <div className="w-full h-[250px] sm:h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
          <LineChart data={sigmoidData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="x" label={{ value: 'Linear Score (z)', position: 'insideBottom', offset: -5 }} />
            <YAxis label={{ value: 'Probability', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="y"
              stroke="#0ea5e9"
              strokeWidth={3}
              dot={false}
              animationDuration={1000}
            />
            <Line
              type="monotone"
              dataKey="x"
              stroke="transparent"
              strokeWidth={0}
            />
          </LineChart>
        </ResponsiveContainer>
        </div>
        <p className="text-sm text-gray-600 mt-4 text-center">
          {t('lr.sigmoid.desc')}
        </p>
      </div>

      {/* Interactive Weight Adjustment */}
      <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg">
        <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-800">{t('lr.weights.title')}</h3>
        <div className="space-y-3 sm:space-y-4">
          {Object.entries(weights).map(([feature, weight]) => (
            <div key={feature}>
              <div className="flex justify-between mb-2">
                <span className="font-medium capitalize text-gray-800">{feature}</span>
                <span className="text-gray-800 font-mono font-semibold">{weight.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={weight}
                onChange={(e) =>
                  setWeights({ ...weights, [feature]: parseFloat(e.target.value) })
                }
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-500"
              />
            </div>
          ))}
        </div>
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="mt-4 sm:mt-6 p-3 sm:p-4 bg-gradient-to-r from-primary-100 to-primary-200 rounded-lg text-primary-900 text-center border-2 border-primary-300"
        >
          <div className="text-xs sm:text-sm mb-1 font-semibold">{t('lr.prediction')}</div>
          <div className="text-3xl sm:text-4xl font-bold">{(prediction * 100).toFixed(1)}%</div>
        </motion.div>
      </div>

      {/* Model Characteristics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-white rounded-lg p-4 shadow-md"
        >
          <h4 className="font-semibold text-primary-600 mb-2">{t('lr.interpretable')}</h4>
          <p className="text-sm text-gray-600">{t('lr.interpretable.desc')}</p>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-white rounded-lg p-4 shadow-md"
        >
          <h4 className="font-semibold text-primary-600 mb-2">{t('lr.fast')}</h4>
          <p className="text-sm text-gray-600">{t('lr.fast.desc')}</p>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-white rounded-lg p-4 shadow-md"
        >
          <h4 className="font-semibold text-primary-600 mb-2">{t('lr.probabilistic')}</h4>
          <p className="text-sm text-gray-600">{t('lr.probabilistic.desc')}</p>
        </motion.div>
      </div>
    </div>
  )
}

