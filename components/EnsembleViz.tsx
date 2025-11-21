'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, TrendingUp, Shield } from 'lucide-react'
import { useTranslation } from '@/contexts/TranslationContext'

export default function EnsembleViz() {
  const { t } = useTranslation()
  const [votingType, setVotingType] = useState<'hard' | 'soft'>('soft')
  const [selectedModels, setSelectedModels] = useState({
    randomForest: true,
    xgboost: true,
    knn: true,
    lightgbm: true,
  })

  const models = [
    { id: 'randomForest', name: 'Random Forest', prediction: 'Click', confidence: 0.78, color: 'purple' },
    { id: 'xgboost', name: 'XGBoost', prediction: 'Click', confidence: 0.82, color: 'orange' },
    { id: 'knn', name: 'KNN', prediction: 'No Click', confidence: 0.72, color: 'green' },
    { id: 'lightgbm', name: 'LightGBM', prediction: 'Click', confidence: 0.79, color: 'pink' },
  ]

  const activeModels = models.filter((m) => selectedModels[m.id as keyof typeof selectedModels])

  // Calculate ensemble prediction
  const getEnsemblePrediction = () => {
    if (votingType === 'hard') {
      const clickVotes = activeModels.filter((m) => m.prediction === 'Click').length
      const noClickVotes = activeModels.filter((m) => m.prediction === 'No Click').length
      return clickVotes > noClickVotes ? 'Click' : 'No Click'
    } else {
      // Soft voting: average probabilities
      const clickAvg =
        activeModels
          .filter((m) => m.prediction === 'Click')
          .reduce((sum, m) => sum + m.confidence, 0) / activeModels.length
      const noClickAvg =
        activeModels
          .filter((m) => m.prediction === 'No Click')
          .reduce((sum, m) => sum + m.confidence, 0) / activeModels.length
      return clickAvg > noClickAvg ? 'Click' : 'No Click'
    }
  }

  const ensemblePrediction = getEnsemblePrediction()
  const ensembleConfidence =
    activeModels.reduce((sum, m) => sum + m.confidence, 0) / activeModels.length

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{t('ensemble.title')}</h2>
        <p className="text-sm sm:text-base text-gray-600 px-2">
          {t('ensemble.subtitle')}
        </p>
      </div>

      {/* Voting Type Selection */}
      <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg">
        <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-800">{t('ensemble.voting.title')}</h3>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <button
            onClick={() => setVotingType('hard')}
            className={`flex-1 p-4 rounded-lg border-2 transition-all ${
              votingType === 'hard'
                ? 'border-indigo-500 bg-indigo-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="font-semibold mb-1">{t('ensemble.voting.hard')}</div>
            <div className="text-sm text-gray-600">
              {t('ensemble.voting.hard.desc')}
            </div>
          </button>
          <button
            onClick={() => setVotingType('soft')}
            className={`flex-1 p-4 rounded-lg border-2 transition-all ${
              votingType === 'soft'
                ? 'border-indigo-500 bg-indigo-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="font-semibold mb-1">{t('ensemble.voting.soft')}</div>
            <div className="text-sm text-gray-600">
              {t('ensemble.voting.soft.desc')}
            </div>
          </button>
        </div>
      </div>

      {/* Model Selection */}
      <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg">
        <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-800">{t('ensemble.select.title')}</h3>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {models.map((model) => (
            <motion.button
              key={model.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() =>
                setSelectedModels({
                  ...selectedModels,
                  [model.id]: !selectedModels[model.id as keyof typeof selectedModels],
                })
              }
              className={`p-3 sm:p-4 rounded-lg border-2 transition-all ${
                selectedModels[model.id as keyof typeof selectedModels]
                  ? model.color === 'purple'
                    ? 'border-purple-500 bg-purple-50'
                    : model.color === 'orange'
                    ? 'border-orange-500 bg-orange-50'
                    : model.color === 'green'
                    ? 'border-green-500 bg-green-50'
                    : 'border-pink-500 bg-pink-50'
                  : 'border-gray-200 bg-gray-50 opacity-50'
              }`}
            >
              <div className="font-semibold mb-1 sm:mb-2 text-sm sm:text-base">{model.name}</div>
              <div className="text-xs sm:text-sm text-gray-600">
                {selectedModels[model.id as keyof typeof selectedModels] ? t('ensemble.select.active') : t('ensemble.select.inactive')}
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Individual Model Predictions */}
      <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg">
        <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-800">{t('ensemble.predictions.title')}</h3>
        <div className="space-y-3 sm:space-y-4">
          {models.map((model, idx) => {
            const isActive = selectedModels[model.id as keyof typeof selectedModels]
            return (
              <motion.div
                key={model.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: isActive ? 1 : 0.5, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`p-4 rounded-lg border-2 ${
                  isActive
                    ? model.color === 'purple'
                      ? 'border-purple-500 bg-purple-50'
                      : model.color === 'orange'
                      ? 'border-orange-500 bg-orange-50'
                      : model.color === 'green'
                      ? 'border-green-500 bg-green-50'
                      : 'border-pink-500 bg-pink-50'
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div
                      className={`w-3 h-3 rounded-full flex-shrink-0 ${
                        isActive
                          ? model.color === 'purple'
                            ? 'bg-purple-500'
                            : model.color === 'orange'
                            ? 'bg-orange-500'
                            : model.color === 'green'
                            ? 'bg-green-500'
                            : 'bg-pink-500'
                          : 'bg-gray-300'
                      }`}
                    />
                    <span className="font-semibold text-sm sm:text-base">{model.name}</span>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-4">
                    <span
                      className={`px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-medium ${
                        model.prediction === 'Click'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {model.prediction}
                    </span>
                    <span className="text-xs sm:text-sm text-gray-600">
                      {(model.confidence * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Voting Visualization */}
      <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg">
        <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-800">
          {votingType === 'hard' ? t('ensemble.votingProcess.hard') : t('ensemble.votingProcess.soft')}
        </h3>
        <div className="space-y-4 sm:space-y-6">
          {votingType === 'hard' ? (
            <>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                <span className="text-base sm:text-lg font-medium">{t('ensemble.votingProcess.click')}</span>
                <div className="flex-1 mx-0 sm:mx-4">
                  <div className="h-8 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: `${
                          (activeModels.filter((m) => m.prediction === 'Click').length /
                            activeModels.length) *
                          100
                        }%`,
                      }}
                      className="h-full bg-green-500 flex items-center justify-end pr-2 min-w-[40px]"
                    >
                      {activeModels.filter((m) => m.prediction === 'Click').length > 0 && (
                        <span className="text-white font-semibold text-sm whitespace-nowrap">
                          {activeModels.filter((m) => m.prediction === 'Click').length}
                        </span>
                      )}
                    </motion.div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                <span className="text-base sm:text-lg font-medium">{t('ensemble.votingProcess.noClick')}</span>
                <div className="flex-1 mx-0 sm:mx-4">
                  <div className="h-8 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: `${
                          (activeModels.filter((m) => m.prediction === 'No Click').length /
                            activeModels.length) *
                          100
                        }%`,
                      }}
                      className="h-full bg-red-500 flex items-center justify-end pr-2 min-w-[40px]"
                    >
                      {activeModels.filter((m) => m.prediction === 'No Click').length > 0 && (
                        <span className="text-white font-semibold text-sm whitespace-nowrap">
                          {activeModels.filter((m) => m.prediction === 'No Click').length}
                        </span>
                      )}
                    </motion.div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {activeModels.map((model, idx) => (
                <div key={model.id}>
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0 mb-2">
                    <span className="font-medium text-gray-800 text-sm sm:text-base">{model.name}</span>
                    <span className="text-xs sm:text-sm text-gray-600">
                      {(model.confidence * 100).toFixed(0)}% →{' '}
                      {model.prediction === 'Click' ? 'Click' : 'No Click'}
                    </span>
                  </div>
                  <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${model.confidence * 100}%` }}
                      transition={{ delay: idx * 0.1 }}
                      className={`h-full ${
                        model.prediction === 'Click' ? 'bg-green-500' : 'bg-red-500'
                      }`}
                    />
                  </div>
                </div>
              ))}
              <div className="pt-3 sm:pt-4 border-t">
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0 mb-2">
                  <span className="font-semibold text-sm sm:text-base">{t('ensemble.votingProcess.avg')}</span>
                  <span className="text-xs sm:text-sm text-gray-600">
                    {(ensembleConfidence * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Final Ensemble Prediction */}
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        className={`p-4 sm:p-6 lg:p-8 rounded-xl text-center border-2 ${
          ensemblePrediction === 'Click'
            ? 'bg-gradient-to-r from-green-100 to-green-200 text-green-900 border-green-300'
            : 'bg-gradient-to-r from-red-100 to-red-200 text-red-900 border-red-300'
        }`}
      >
        <div className="text-xs sm:text-sm mb-2 font-semibold">{t('ensemble.final.title', { type: votingType === 'hard' ? t('ensemble.voting.hard') : t('ensemble.voting.soft') })}</div>
          <div className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4">{ensemblePrediction}</div>
          <div className="text-base sm:text-lg">
            {t('ensemble.final.confidence')} {(ensembleConfidence * 100).toFixed(1)}%
          </div>
          <div className="text-xs sm:text-sm mt-3 sm:mt-4">
            {t('ensemble.final.based', { count: String(activeModels.length), plural: activeModels.length !== 1 ? 's' : '' })}
          </div>
      </motion.div>

      {/* Benefits */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-white rounded-lg p-4 shadow-md"
        >
          <Shield className="w-8 h-8 text-indigo-600 mb-2" />
          <h4 className="font-semibold text-indigo-600 mb-2">{t('ensemble.robust')}</h4>
          <p className="text-sm text-gray-600">
            {t('ensemble.robust.desc')}
          </p>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-white rounded-lg p-4 shadow-md"
        >
          <TrendingUp className="w-8 h-8 text-indigo-600 mb-2" />
          <h4 className="font-semibold text-indigo-600 mb-2">{t('ensemble.better')}</h4>
          <p className="text-sm text-gray-600">
            {t('ensemble.better.desc')}
          </p>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-white rounded-lg p-4 shadow-md"
        >
          <Users className="w-8 h-8 text-indigo-600 mb-2" />
          <h4 className="font-semibold text-indigo-600 mb-2">{t('ensemble.diversity')}</h4>
          <p className="text-sm text-gray-600">
            {t('ensemble.diversity.desc')}
          </p>
        </motion.div>
      </div>
    </div>
  )
}

