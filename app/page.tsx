'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import LogisticRegressionViz from '@/components/LogisticRegressionViz'
import KNNViz from '@/components/KNNViz'
import RandomForestViz from '@/components/RandomForestViz'
import XGBoostViz from '@/components/XGBoostViz'
import LightGBMViz from '@/components/LightGBMViz'
import EnsembleViz from '@/components/EnsembleViz'
import DecisionTreeViz from '@/components/DecisionTreeViz'
import { Brain, TrendingUp, Zap, Target, Languages, TreePine } from 'lucide-react'
import { useTranslation } from '@/contexts/TranslationContext'

const models = [
  { id: 'decision-tree', nameKey: 'dt.title', icon: TreePine, color: 'bg-teal-500' },
  { id: 'logistic', nameKey: 'lr.title', icon: TrendingUp, color: 'bg-blue-500' },
  { id: 'knn', nameKey: 'knn.title', icon: Target, color: 'bg-green-500' },
  { id: 'random-forest', nameKey: 'rf.title', icon: Brain, color: 'bg-purple-500' },
  { id: 'xgboost', nameKey: 'xgb.title', icon: Zap, color: 'bg-orange-500' },
  { id: 'lightgbm', nameKey: 'lgbm.title', icon: Zap, color: 'bg-pink-500' },
  { id: 'ensemble', nameKey: 'ensemble.title', icon: Brain, color: 'bg-indigo-500' },
]

export default function Home() {
  const [selectedModel, setSelectedModel] = useState<string | null>(null)
  const { language, setLanguage, t } = useTranslation()

  const renderModelViz = () => {
    switch (selectedModel) {
      case 'decision-tree':
        return <DecisionTreeViz />
      case 'logistic':
        return <LogisticRegressionViz />
      case 'knn':
        return <KNNViz />
      case 'random-forest':
        return <RandomForestViz />
      case 'xgboost':
        return <XGBoostViz />
      case 'lightgbm':
        return <LightGBMViz />
      case 'ensemble':
        return <EnsembleViz />
      default:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <Brain className="w-16 h-16 sm:w-24 sm:h-24 mx-auto mb-4 sm:mb-6 text-gray-400" />
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-3 sm:mb-4 text-gray-700 px-4">{t('selectModel')}</h2>
            <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto px-4">
              {t('selectModelDesc')}
            </p>
          </motion.div>
        )
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-end mb-4">
            <button
              onClick={() => setLanguage(language === 'en' ? 'fr' : 'en')}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <Languages className="w-5 h-5" />
              <span className="font-medium">{language === 'en' ? 'FR' : 'EN'}</span>
            </button>
          </div>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 px-2">
              {t('title')}
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-gray-600 px-2">
              {t('subtitle')}
            </p>
          </motion.div>
        </div>
      </header>

      {/* Model Selection Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {models.map((model, index) => {
            const Icon = model.icon
            const isSelected = selectedModel === model.id
            return (
              <motion.button
                key={model.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedModel(isSelected ? null : model.id)}
                className={`p-4 sm:p-6 rounded-xl shadow-lg transition-all border-2 ${
                  isSelected
                    ? 'bg-gradient-to-br from-primary-100 to-primary-200 text-primary-900 border-primary-400'
                    : 'bg-white text-gray-800 hover:shadow-xl border-gray-200'
                }`}
              >
                <Icon className={`w-10 h-10 sm:w-12 sm:h-12 mb-3 sm:mb-4 ${isSelected ? 'text-primary-700' : 'text-primary-600'}`} />
                <h3 className="text-lg sm:text-xl font-semibold mb-2">{t(model.nameKey)}</h3>
                <p className={`text-xs sm:text-sm ${isSelected ? 'text-primary-800' : 'text-gray-600'}`}>
                  {isSelected ? t('clickToClose') : t('clickToExplore')}
                </p>
              </motion.button>
            )
          })}
        </div>

        {/* Model Visualization */}
        <motion.div
          key={selectedModel}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-xl shadow-xl p-4 sm:p-6 lg:p-8 min-h-[400px] sm:min-h-[600px]"
        >
          {renderModelViz()}
        </motion.div>
      </div>
    </main>
  )
}

