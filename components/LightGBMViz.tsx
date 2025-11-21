'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, Leaf, TrendingDown } from 'lucide-react'
import { useTranslation } from '@/contexts/TranslationContext'

export default function LightGBMViz() {
  const { t } = useTranslation()
  const [step, setStep] = useState(0)
  const [numLeaves, setNumLeaves] = useState(31)

  const steps = [
    {
      title: t('lgbm.step1.title'),
      description: t('lgbm.step1.desc'),
      icon: Leaf,
    },
    {
      title: t('lgbm.step2.title'),
      description: t('lgbm.step2.desc'),
      icon: TrendingDown,
    },
    {
      title: t('lgbm.step3.title'),
      description: t('lgbm.step3.desc'),
      icon: Zap,
    },
  ]

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{t('lgbm.title')}</h2>
        <p className="text-sm sm:text-base text-gray-600 px-2">
          {t('lgbm.subtitle')}
        </p>
      </div>

      {/* Number of Leaves Slider */}
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
                  ? 'bg-pink-500 text-white'
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
          className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl p-4 sm:p-6"
        >
          <div className="flex items-start gap-3 sm:gap-4">
            {(() => {
              const StepIcon = steps[step]?.icon
              return StepIcon ? <StepIcon className="w-10 h-10 sm:w-12 sm:h-12 text-pink-600 flex-shrink-0" /> : null
            })()}
            <div>
              <h3 className="text-xl sm:text-2xl font-semibold mb-2">{steps[step].title}</h3>
              <p className="text-sm sm:text-base text-gray-700">{steps[step].description}</p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Leaf-wise vs Level-wise Comparison */}
      {step === 0 && (
        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg">
          <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-800">{t('lgbm.comparison.title')}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <h4 className="font-semibold text-gray-700 mb-3">{t('lgbm.comparison.level')}</h4>
              <div className="space-y-2">
                {[1, 2, 4, 8].map((nodes, level) => (
                  <div key={level} className="flex justify-center gap-2">
                    {Array.from({ length: nodes }).map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: level * 0.2 + i * 0.1 }}
                        className="w-12 h-12 bg-gray-300 rounded-lg flex items-center justify-center text-xs"
                      >
                        L{level}
                      </motion.div>
                    ))}
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-600 mt-3">
                {t('lgbm.comparison.level.desc')}
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-pink-600 mb-3">{t('lgbm.comparison.leaf')}</h4>
              <div className="space-y-2">
                {[1, 1, 2, 3, 4].map((nodes, level) => (
                  <div key={level} className="flex justify-center gap-2">
                    {Array.from({ length: nodes }).map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: level * 0.2 + i * 0.1 }}
                        className={`w-12 h-12 rounded-lg flex items-center justify-center text-xs ${
                          i === nodes - 1 && level > 0
                            ? 'bg-pink-500 text-white'
                            : 'bg-pink-200'
                        }`}
                      >
                        L{level}
                      </motion.div>
                    ))}
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-600 mt-3">
                {t('lgbm.comparison.leaf.desc')}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* GOSS Visualization */}
      {step === 1 && (
        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg">
          <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-800">{t('lgbm.goss.title')}</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">{t('lgbm.goss.points')}</h4>
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 20 }).map((_, i) => {
                  const gradient = Math.random()
                  const isLarge = gradient > 0.7
                  const isSmall = gradient < 0.3
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs ${
                        isLarge
                          ? 'bg-pink-600 text-white'
                          : isSmall
                          ? 'bg-gray-200 text-gray-600'
                          : 'bg-pink-300 text-pink-800'
                      }`}
                    >
                      {i + 1}
                    </motion.div>
                  )
                })}
              </div>
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-pink-600"></div>
                  <span>{t('lgbm.goss.large')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-pink-300"></div>
                  <span>{t('lgbm.goss.medium')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-gray-200"></div>
                  <span>{t('lgbm.goss.small')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EFB Visualization */}
      {step === 2 && (
        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg">
          <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-800">{t('lgbm.efb.title')}</h3>
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold mb-3 text-gray-700">{t('lgbm.efb.before')}</h4>
              <div className="flex flex-wrap gap-2">
                {['Age', 'Gender', 'Device', 'Time', 'Position', 'History'].map((feature, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="px-4 py-2 bg-gray-200 rounded-lg font-medium"
                  >
                    {feature}
                  </motion.div>
                ))}
              </div>
            </div>
            <div className="text-center">
              <motion.div
                animate={{ rotate: 180 }}
                transition={{ duration: 1, repeat: Infinity, repeatType: 'reverse' }}
                className="text-4xl"
              >
                ⬇️
              </motion.div>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-pink-600">{t('lgbm.efb.after')}</h4>
              <div className="flex flex-wrap gap-2">
                {[
                  ['Age', 'Gender'],
                  ['Device', 'Time'],
                  ['Position', 'History'],
                ].map((bundle, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.2 + 0.5 }}
                    className="px-4 py-2 bg-pink-500 text-white rounded-lg font-medium"
                  >
                    {bundle.join(' + ')}
                  </motion.div>
                ))}
              </div>
              <p className="text-sm text-gray-600 mt-3">
                {t('lgbm.efb.desc')}
              </p>
            </div>
          </div>
        </div>
      )}

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

