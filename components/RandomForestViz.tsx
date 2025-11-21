'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TreePine, Users, TrendingUp } from 'lucide-react'
import { useTranslation } from '@/contexts/TranslationContext'

export default function RandomForestViz() {
  const { t } = useTranslation()
  const [step, setStep] = useState(0)
  const [numTrees, setNumTrees] = useState(5)
  const [selectedTree, setSelectedTree] = useState<number | null>(null)

  const steps = [
    {
      title: t('rf.step1.title'),
      description: t('rf.step1.desc'),
      icon: Users,
    },
    {
      title: t('rf.step2.title'),
      description: t('rf.step2.desc'),
      icon: TreePine,
    },
    {
      title: t('rf.step3.title'),
      description: t('rf.step3.desc'),
      icon: TrendingUp,
    },
  ]

  // Simulate tree predictions
  const treePredictions = Array.from({ length: numTrees }, () => ({
    prediction: Math.random() > 0.4 ? 'Click' : 'No Click',
    confidence: Math.random() * 0.3 + 0.6,
  }))

  const finalPrediction =
    treePredictions.filter((t) => t.prediction === 'Click').length >
    treePredictions.filter((t) => t.prediction === 'No Click').length
      ? 'Click'
      : 'No Click'

  const confidence =
    treePredictions.filter((t) => t.prediction === finalPrediction).length / numTrees

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{t('rf.title')}</h2>
        <p className="text-sm sm:text-base text-gray-600 px-2">
          {t('rf.subtitle')}
        </p>
      </div>

      {/* Number of Trees Slider */}
      <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 mb-3 sm:mb-4">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800">{t('rf.numTrees')}</h3>
          <span className="text-2xl sm:text-3xl font-bold text-purple-600">{numTrees}</span>
        </div>
        <input
          type="range"
          min="3"
          max="20"
          value={numTrees}
          onChange={(e) => setNumTrees(parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-500"
        />
        <p className="text-sm text-gray-600 mt-2">
          {t('rf.numTrees.desc')}
        </p>
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
                  ? 'bg-purple-500 text-white'
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
          className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 sm:p-6"
        >
          <div className="flex items-start gap-3 sm:gap-4">
            {(() => {
              const StepIcon = steps[step]?.icon
              return StepIcon ? <StepIcon className="w-10 h-10 sm:w-12 sm:h-12 text-purple-600 flex-shrink-0" /> : null
            })()}
            <div>
              <h3 className="text-xl sm:text-2xl font-semibold mb-2">{steps[step].title}</h3>
              <p className="text-sm sm:text-base text-gray-700">{steps[step].description}</p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Tree Visualization */}
      <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg">
        <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-800">{t('rf.trees.title')}</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-4">
          {treePredictions.map((tree, idx) => (
            <motion.button
              key={idx}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedTree(selectedTree === idx ? null : idx)}
              className={`p-2 sm:p-4 rounded-lg border-2 transition-all ${
                selectedTree === idx
                  ? 'border-purple-500 bg-purple-50'
                  : tree.prediction === 'Click'
                  ? 'border-green-500 bg-green-50'
                  : 'border-red-500 bg-red-50'
              }`}
            >
              <TreePine
                className={`w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-1 sm:mb-2 ${
                  tree.prediction === 'Click' ? 'text-green-600' : 'text-red-600'
                }`}
              />
              <div className="text-xs sm:text-sm font-semibold text-gray-800">{tree.prediction}</div>
              <div className="text-xs text-gray-600 mt-1">
                {(tree.confidence * 100).toFixed(0)}{t('rf.trees.confident')}
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Voting Visualization */}
      <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg">
        <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-800">{t('rf.voting.title')}</h3>
        <div className="space-y-3 sm:space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
            <span className="text-base sm:text-lg font-medium">{t('rf.voting.click')}</span>
            <div className="flex-1 mx-4">
              <div className="h-8 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${
                      (treePredictions.filter((t) => t.prediction === 'Click').length /
                        numTrees) *
                      100
                    }%`,
                  }}
                  className="h-full bg-green-500 flex items-center justify-end pr-2 min-w-[40px]"
                >
                  {treePredictions.filter((t) => t.prediction === 'Click').length > 0 && (
                    <span className="text-white font-semibold text-sm whitespace-nowrap">
                      {treePredictions.filter((t) => t.prediction === 'Click').length}
                    </span>
                  )}
                </motion.div>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
            <span className="text-base sm:text-lg font-medium">{t('rf.voting.noClick')}</span>
            <div className="flex-1 mx-4">
              <div className="h-8 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${
                      (treePredictions.filter((t) => t.prediction === 'No Click').length /
                        numTrees) *
                      100
                    }%`,
                  }}
                  className="h-full bg-red-500 flex items-center justify-end pr-2 min-w-[40px]"
                >
                  {treePredictions.filter((t) => t.prediction === 'No Click').length > 0 && (
                    <span className="text-white font-semibold text-sm whitespace-nowrap">
                      {treePredictions.filter((t) => t.prediction === 'No Click').length}
                    </span>
                  )}
                </motion.div>
              </div>
            </div>
          </div>
        </div>

        {/* Final Prediction */}
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className={`mt-4 sm:mt-6 p-4 sm:p-6 rounded-lg text-center border-2 ${
            finalPrediction === 'Click'
              ? 'bg-gradient-to-r from-green-100 to-green-200 text-green-900 border-green-300'
              : 'bg-gradient-to-r from-red-100 to-red-200 text-red-900 border-red-300'
          }`}
        >
          <div className="text-xs sm:text-sm mb-1 font-semibold">{t('rf.final.title')}</div>
          <div className="text-3xl sm:text-4xl font-bold mb-2">{finalPrediction}</div>
          <div className="text-base sm:text-lg">
            {t('rf.final.confidence')} {(confidence * 100).toFixed(1)}%
          </div>
        </motion.div>
      </div>

      {/* Model Characteristics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-white rounded-lg p-4 shadow-md"
        >
          <h4 className="font-semibold text-purple-600 mb-2">{t('rf.overfitting')}</h4>
          <p className="text-sm text-gray-600">{t('rf.overfitting.desc')}</p>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-white rounded-lg p-4 shadow-md"
        >
          <h4 className="font-semibold text-purple-600 mb-2">{t('rf.importance')}</h4>
          <p className="text-sm text-gray-600">{t('rf.importance.desc')}</p>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-white rounded-lg p-4 shadow-md"
        >
          <h4 className="font-semibold text-purple-600 mb-2">{t('rf.nonlinearity')}</h4>
          <p className="text-sm text-gray-600">{t('rf.nonlinearity.desc')}</p>
        </motion.div>
      </div>
    </div>
  )
}

