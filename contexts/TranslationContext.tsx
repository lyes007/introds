'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

type Language = 'en' | 'fr'

interface Translations {
  [key: string]: {
    en: string
    fr: string
  }
}

const translations: Translations = {
  // Main page
  'title': { en: 'Machine Learning Models Explained', fr: 'Modèles d\'Apprentissage Automatique Expliqués' },
  'subtitle': { en: 'Interactive visualizations of ad click prediction models', fr: 'Visualisations interactives des modèles de prédiction de clics publicitaires' },
  'selectModel': { en: 'Select a Model to Explore', fr: 'Sélectionnez un Modèle à Explorer' },
  'selectModelDesc': { en: 'Choose one of the machine learning models from the grid above to see an interactive visualization explaining how it thinks and makes predictions.', fr: 'Choisissez l\'un des modèles d\'apprentissage automatique dans la grille ci-dessus pour voir une visualisation interactive expliquant comment il pense et fait des prédictions.' },
  'clickToExplore': { en: 'Click to explore', fr: 'Cliquez pour explorer' },
  'clickToClose': { en: 'Click to close', fr: 'Cliquez pour fermer' },
  'step': { en: 'Step', fr: 'Étape' },
  'click': { en: 'Click', fr: 'Clic' },
  'noClick': { en: 'No Click', fr: 'Pas de Clic' },

  // Logistic Regression
  'lr.title': { en: 'Logistic Regression', fr: 'Régression Logistique' },
  'lr.subtitle': { en: 'A linear model that uses the sigmoid function to predict probabilities', fr: 'Un modèle linéaire qui utilise la fonction sigmoïde pour prédire les probabilités' },
  'lr.step1.title': { en: 'Linear Combination', fr: 'Combinaison Linéaire' },
  'lr.step1.desc': { en: 'The model combines features with weights to create a linear score (z)', fr: 'Le modèle combine les caractéristiques avec des poids pour créer un score linéaire (z)' },
  'lr.step1.formula': { en: 'z = w₁×age + w₂×device + w₃×time + b', fr: 'z = w₁×âge + w₂×appareil + w₃×heure + b' },
  'lr.step2.title': { en: 'Sigmoid Transformation', fr: 'Transformation Sigmoïde' },
  'lr.step2.desc': { en: 'The sigmoid function converts the linear score into a probability between 0 and 1', fr: 'La fonction sigmoïde convertit le score linéaire en une probabilité entre 0 et 1' },
  'lr.step2.formula': { en: 'P(click) = 1 / (1 + e^(-z))', fr: 'P(clic) = 1 / (1 + e^(-z))' },
  'lr.step3.title': { en: 'Decision Threshold', fr: 'Seuil de Décision' },
  'lr.step3.desc': { en: 'If probability > 0.5, predict "click", otherwise predict "no click"', fr: 'Si probabilité > 0.5, prédire "clic", sinon prédire "pas de clic"' },
  'lr.step3.formula': { en: 'Prediction = P(click) > 0.5 ? Click : No Click', fr: 'Prédiction = P(clic) > 0.5 ? Clic : Pas de Clic' },
  'lr.sigmoid.title': { en: 'Sigmoid Function Visualization', fr: 'Visualisation de la Fonction Sigmoïde' },
  'lr.sigmoid.desc': { en: 'The S-shaped curve ensures probabilities stay between 0 and 1', fr: 'La courbe en forme de S garantit que les probabilités restent entre 0 et 1' },
  'lr.weights.title': { en: 'Adjust Feature Weights', fr: 'Ajuster les Poids des Caractéristiques' },
  'lr.prediction': { en: 'Predicted Click Probability', fr: 'Probabilité de Clic Prédite' },
  'lr.interpretable': { en: '✓ Interpretable', fr: '✓ Interprétable' },
  'lr.interpretable.desc': { en: 'Easy to understand feature importance', fr: 'Facile de comprendre l\'importance des caractéristiques' },
  'lr.fast': { en: '⚡ Fast Training', fr: '⚡ Entraînement Rapide' },
  'lr.fast.desc': { en: 'Quick to train and make predictions', fr: 'Rapide à entraîner et à faire des prédictions' },
  'lr.probabilistic': { en: '📊 Probabilistic', fr: '📊 Probabiliste' },
  'lr.probabilistic.desc': { en: 'Provides probability scores, not just predictions', fr: 'Fournit des scores de probabilité, pas seulement des prédictions' },

  // KNN
  'knn.title': { en: 'K-Nearest Neighbors (KNN)', fr: 'K Plus Proches Voisins (KNN)' },
  'knn.subtitle': { en: 'A lazy learning algorithm that makes predictions based on similarity to training examples', fr: 'Un algorithme d\'apprentissage paresseux qui fait des prédictions basées sur la similarité aux exemples d\'entraînement' },
  'knn.kValue': { en: 'K Value (Number of Neighbors)', fr: 'Valeur K (Nombre de Voisins)' },
  'knn.kValue.desc': { en: 'Adjust K to see how it affects the prediction. Lower K = more sensitive, Higher K = more stable', fr: 'Ajustez K pour voir comment cela affecte la prédiction. K plus bas = plus sensible, K plus haut = plus stable' },
  'knn.step1.title': { en: 'Find K Nearest Neighbors', fr: 'Trouver les K Plus Proches Voisins' },
  'knn.step1.desc': { en: 'The algorithm finds the {k} closest data points to the new point based on distance', fr: 'L\'algorithme trouve les {k} points de données les plus proches du nouveau point basé sur la distance' },
  'knn.step2.title': { en: 'Count Votes', fr: 'Compter les Votes' },
  'knn.step2.desc': { en: 'Count how many of the {k} neighbors belong to each class (Click vs No Click)', fr: 'Compter combien des {k} voisins appartiennent à chaque classe (Clic vs Pas de Clic)' },
  'knn.step3.title': { en: 'Make Prediction', fr: 'Faire une Prédiction' },
  'knn.step3.desc': { en: 'Predict the class that has the majority vote among the {k} neighbors', fr: 'Prédire la classe qui a le vote majoritaire parmi les {k} voisins' },
  'knn.viz.title': { en: 'Interactive 2D Visualization', fr: 'Visualisation 2D Interactive' },
  'knn.legend.click': { en: 'Click', fr: 'Clic' },
  'knn.legend.noClick': { en: 'No Click', fr: 'Pas de Clic' },
  'knn.legend.neighbor': { en: 'Neighbor', fr: 'Voisin' },
  'knn.legend.newPoint': { en: 'New Point', fr: 'Nouveau Point' },
  'knn.prediction': { en: 'Prediction', fr: 'Prédiction' },
  'knn.prediction.based': { en: 'Based on {count} out of {k} neighbors', fr: 'Basé sur {count} sur {k} voisins' },
  'knn.simple': { en: '🎯 Simple & Intuitive', fr: '🎯 Simple et Intuitif' },
  'knn.simple.desc': { en: 'Easy to understand and implement', fr: 'Facile à comprendre et à implémenter' },
  'knn.nonParametric': { en: '📊 Non-Parametric', fr: '📊 Non-Paramétrique' },
  'knn.nonParametric.desc': { en: 'Makes no assumptions about data distribution', fr: 'Ne fait aucune hypothèse sur la distribution des données' },
  'knn.kSelection': { en: '⚖️ K Selection Matters', fr: '⚖️ La Sélection de K est Importante' },
  'knn.kSelection.desc': { en: 'Choosing the right K is crucial for performance', fr: 'Choisir le bon K est crucial pour les performances' },

  // Random Forest
  'rf.title': { en: 'Random Forest', fr: 'Forêt Aléatoire' },
  'rf.subtitle': { en: 'An ensemble method that combines multiple decision trees for robust predictions', fr: 'Une méthode d\'ensemble qui combine plusieurs arbres de décision pour des prédictions robustes' },
  'rf.numTrees': { en: 'Number of Trees', fr: 'Nombre d\'Arbres' },
  'rf.numTrees.desc': { en: 'More trees generally improve accuracy but increase training time', fr: 'Plus d\'arbres améliorent généralement la précision mais augmentent le temps d\'entraînement' },
  'rf.step1.title': { en: 'Bootstrap Sampling', fr: 'Échantillonnage Bootstrap' },
  'rf.step1.desc': { en: 'Create multiple training sets by randomly sampling with replacement', fr: 'Créer plusieurs ensembles d\'entraînement en échantillonnant aléatoirement avec remplacement' },
  'rf.step2.title': { en: 'Build Decision Trees', fr: 'Construire des Arbres de Décision' },
  'rf.step2.desc': { en: 'Each tree is built on a different sample and uses random feature subsets', fr: 'Chaque arbre est construit sur un échantillon différent et utilise des sous-ensembles de caractéristiques aléatoires' },
  'rf.step3.title': { en: 'Voting & Aggregation', fr: 'Vote et Agrégation' },
  'rf.step3.desc': { en: 'All trees vote on the prediction, and the majority vote wins', fr: 'Tous les arbres votent sur la prédiction, et le vote majoritaire l\'emporte' },
  'rf.trees.title': { en: 'Individual Tree Predictions', fr: 'Prédictions des Arbres Individuels' },
  'rf.trees.confident': { en: '% confident', fr: '% confiant' },
  'rf.voting.title': { en: 'Voting Process', fr: 'Processus de Vote' },
  'rf.voting.click': { en: 'Click Votes', fr: 'Votes pour Clic' },
  'rf.voting.noClick': { en: 'No Click Votes', fr: 'Votes pour Pas de Clic' },
  'rf.final.title': { en: 'Final Prediction (Majority Vote)', fr: 'Prédiction Finale (Vote Majoritaire)' },
  'rf.final.confidence': { en: 'Confidence:', fr: 'Confiance:' },
  'rf.overfitting': { en: '🌳 Reduces Overfitting', fr: '🌳 Réduit le Surapprentissage' },
  'rf.overfitting.desc': { en: 'Averaging multiple trees reduces variance', fr: 'La moyenne de plusieurs arbres réduit la variance' },
  'rf.importance': { en: '📊 Feature Importance', fr: '📊 Importance des Caractéristiques' },
  'rf.importance.desc': { en: 'Can identify which features matter most', fr: 'Peut identifier quelles caractéristiques sont les plus importantes' },
  'rf.nonlinearity': { en: '⚡ Handles Non-linearity', fr: '⚡ Gère la Non-linéarité' },
  'rf.nonlinearity.desc': { en: 'Can capture complex feature interactions', fr: 'Peut capturer des interactions complexes de caractéristiques' },

  // XGBoost
  'xgb.title': { en: 'XGBoost (Extreme Gradient Boosting)', fr: 'XGBoost (Gradient Boosting Extrême)' },
  'xgb.subtitle': { en: 'An advanced gradient boosting algorithm that builds trees sequentially to minimize errors', fr: 'Un algorithme de gradient boosting avancé qui construit des arbres séquentiellement pour minimiser les erreurs' },
  'xgb.numTrees': { en: 'Number of Trees', fr: 'Nombre d\'Arbres' },
  'xgb.learningRate': { en: 'Learning Rate', fr: 'Taux d\'Apprentissage' },
  'xgb.learningRate.desc': { en: 'Lower rate = more conservative, slower learning', fr: 'Taux plus bas = plus conservateur, apprentissage plus lent' },
  'xgb.step1.title': { en: 'Sequential Tree Building', fr: 'Construction Séquentielle d\'Arbres' },
  'xgb.step1.desc': { en: 'Trees are built sequentially, where each new tree corrects errors made by previous trees', fr: 'Les arbres sont construits séquentiellement, où chaque nouvel arbre corrige les erreurs faites par les arbres précédents' },
  'xgb.step2.title': { en: 'Gradient Boosting', fr: 'Gradient Boosting' },
  'xgb.step2.desc': { en: 'Uses gradient descent to minimize prediction errors by focusing on difficult examples', fr: 'Utilise la descente de gradient pour minimiser les erreurs de prédiction en se concentrant sur les exemples difficiles' },
  'xgb.step3.title': { en: 'Weighted Combination', fr: 'Combinaison Pondérée' },
  'xgb.step3.desc': { en: 'Final prediction is a weighted sum of all tree predictions, with later trees having more weight', fr: 'La prédiction finale est une somme pondérée de toutes les prédictions d\'arbres, les arbres plus récents ayant plus de poids' },
  'xgb.sequential.title': { en: 'Sequential Tree Building', fr: 'Construction Séquentielle d\'Arbres' },
  'xgb.sequential.tree': { en: 'Tree', fr: 'Arbre' },
  'xgb.sequential.error': { en: 'Error:', fr: 'Erreur:' },
  'xgb.loss.title': { en: 'Training Loss Over Iterations', fr: 'Perte d\'Entraînement sur les Itérations' },
  'xgb.loss.desc': { en: 'Loss decreases as each new tree corrects previous errors', fr: 'La perte diminue à mesure que chaque nouvel arbre corrige les erreurs précédentes' },
  'xgb.formula.title': { en: 'How Predictions Are Made', fr: 'Comment les Prédictions sont Faites' },
  'xgb.formula.eq': { en: 'Prediction = Tree₁ + Tree₂ + Tree₃ + ... + Treeₙ', fr: 'Prédiction = Arbre₁ + Arbre₂ + Arbre₃ + ... + Arbreₙ' },
  'xgb.formula.point1': { en: '• Each tree makes a prediction (residual correction)', fr: '• Chaque arbre fait une prédiction (correction résiduelle)' },
  'xgb.formula.point2': { en: '• Predictions are summed together', fr: '• Les prédictions sont additionnées' },
  'xgb.formula.point3': { en: '• Learning rate ({rate}) controls how much each tree contributes', fr: '• Le taux d\'apprentissage ({rate}) contrôle la contribution de chaque arbre' },
  'xgb.formula.point4': { en: '• Final prediction = weighted sum of all tree predictions', fr: '• Prédiction finale = somme pondérée de toutes les prédictions d\'arbres' },
  'xgb.performance': { en: '🏆 High Performance', fr: '🏆 Haute Performance' },
  'xgb.performance.desc': { en: 'Often achieves state-of-the-art results', fr: 'Atteint souvent des résultats de pointe' },
  'xgb.fast': { en: '⚡ Fast Training', fr: '⚡ Entraînement Rapide' },
  'xgb.fast.desc': { en: 'Optimized for speed and efficiency', fr: 'Optimisé pour la vitesse et l\'efficacité' },
  'xgb.error': { en: '🎯 Error Correction', fr: '🎯 Correction d\'Erreur' },
  'xgb.error.desc': { en: 'Each tree focuses on previous mistakes', fr: 'Chaque arbre se concentre sur les erreurs précédentes' },
  'xgb.treeGrowth.title': { en: 'Level-wise Tree Growth', fr: 'Croissance d\'Arbre Niveau par Niveau' },
  'xgb.treeGrowth.desc': { en: 'XGBoost grows trees level by level. All nodes at level 0 are created first, then all nodes at level 1, and so on. This ensures balanced trees.', fr: 'XGBoost fait pousser les arbres niveau par niveau. Tous les nœuds au niveau 0 sont créés en premier, puis tous les nœuds au niveau 1, et ainsi de suite. Cela garantit des arbres équilibrés.' },
  'xgb.treeGrowth.level': { en: 'Level', fr: 'Niveau' },
  'xgb.treeGrowth.animating': { en: 'Growing level by level...', fr: 'Croissance niveau par niveau...' },

  // LightGBM
  'lgbm.title': { en: 'LightGBM', fr: 'LightGBM' },
  'lgbm.subtitle': { en: 'A fast, distributed gradient boosting framework optimized for efficiency and accuracy', fr: 'Un framework de gradient boosting rapide et distribué optimisé pour l\'efficacité et la précision' },
  'lgbm.hyperparams.title': { en: 'Hyperparameters', fr: 'Hyperparamètres' },
  'lgbm.hyperparams.desc': { en: 'Adjust these parameters to control how LightGBM learns. Each parameter affects model performance differently.', fr: 'Ajustez ces paramètres pour contrôler comment LightGBM apprend. Chaque paramètre affecte les performances du modèle différemment.' },
  'lgbm.nEstimators.title': { en: 'n_estimators', fr: 'n_estimators' },
  'lgbm.nEstimators.desc': { en: 'Number of boosting rounds (trees) to build', fr: 'Nombre de tours de boosting (arbres) à construire' },
  'lgbm.nEstimators.effect': { en: 'Effect:', fr: 'Effet:' },
  'lgbm.nEstimators.effect.desc': { en: 'More trees = better accuracy but slower training. Too many can cause overfitting.', fr: 'Plus d\'arbres = meilleure précision mais entraînement plus lent. Trop peut causer du surapprentissage.' },
  'lgbm.maxDepth.title': { en: 'max_depth', fr: 'max_depth' },
  'lgbm.maxDepth.desc': { en: 'Maximum depth of each decision tree', fr: 'Profondeur maximale de chaque arbre de décision' },
  'lgbm.maxDepth.effect': { en: 'Effect:', fr: 'Effet:' },
  'lgbm.maxDepth.effect.desc': { en: 'Deeper trees = more complex patterns but risk of overfitting. Shallower = faster, simpler models.', fr: 'Arbres plus profonds = modèles plus complexes mais risque de surapprentissage. Plus superficiels = plus rapides, modèles plus simples.' },
  'lgbm.learningRate.title': { en: 'learning_rate', fr: 'learning_rate' },
  'lgbm.learningRate.desc': { en: 'Step size for each tree\'s contribution to the final prediction', fr: 'Taille du pas pour la contribution de chaque arbre à la prédiction finale' },
  'lgbm.learningRate.effect': { en: 'Effect:', fr: 'Effet:' },
  'lgbm.learningRate.effect.desc': { en: 'Lower rate = slower learning, more stable. Higher rate = faster learning, may overshoot optimal solution.', fr: 'Taux plus bas = apprentissage plus lent, plus stable. Taux plus élevé = apprentissage plus rapide, peut dépasser la solution optimale.' },
  'lgbm.numLeaves': { en: 'num_leaves', fr: 'num_leaves' },
  'lgbm.numLeaves.desc': { en: 'Maximum number of leaves in one tree (LightGBM specific)', fr: 'Nombre maximum de feuilles dans un arbre (spécifique à LightGBM)' },
  'lgbm.numLeaves.effect': { en: 'Effect:', fr: 'Effet:' },
  'lgbm.numLeaves.effect.desc': { en: 'More leaves = more complex trees, better fit but slower and risk of overfitting. This is the main parameter for controlling tree complexity in LightGBM.', fr: 'Plus de feuilles = arbres plus complexes, meilleur ajustement mais plus lent et risque de surapprentissage. C\'est le paramètre principal pour contrôler la complexité des arbres dans LightGBM.' },
  'lgbm.sequential.title': { en: 'Sequential Tree Building', fr: 'Construction Séquentielle d\'Arbres' },
  'lgbm.sequential.desc': { en: 'LightGBM builds trees one after another. Each new tree focuses on correcting errors made by previous trees.', fr: 'LightGBM construit les arbres un après l\'autre. Chaque nouvel arbre se concentre sur la correction des erreurs faites par les arbres précédents.' },
  'lgbm.sequential.tree': { en: 'Tree', fr: 'Arbre' },
  'lgbm.sequential.error': { en: 'Error:', fr: 'Erreur:' },
  'lgbm.loss.title': { en: 'Loss Reduction Over Iterations', fr: 'Réduction de Perte sur les Itérations' },
  'lgbm.loss.desc': { en: 'As each tree is added, the overall prediction error decreases', fr: 'À mesure que chaque arbre est ajouté, l\'erreur de prédiction globale diminue' },
  'lgbm.prediction.title': { en: 'How Predictions Are Made', fr: 'Comment les Prédictions sont Faites' },
  'lgbm.prediction.desc': { en: 'LightGBM combines predictions from all trees. Each tree makes a small correction, and together they create an accurate prediction.', fr: 'LightGBM combine les prédictions de tous les arbres. Chaque arbre fait une petite correction, et ensemble ils créent une prédiction précise.' },
  'lgbm.prediction.formula': { en: 'Final Prediction = Tree₁ + Tree₂ + Tree₃ + ... + Treeₙ', fr: 'Prédiction Finale = Arbre₁ + Arbre₂ + Arbre₃ + ... + Arbreₙ' },
  'lgbm.treeGrowth.title': { en: 'Leaf-wise Tree Growth', fr: 'Croissance d\'Arbre Feuille par Feuille' },
  'lgbm.treeGrowth.desc': { en: 'LightGBM grows trees leaf-wise. It finds the leaf with the largest loss reduction and splits it, creating a complete path to a new leaf before expanding other branches. This creates deeper, more efficient trees.', fr: 'LightGBM fait pousser les arbres feuille par feuille. Il trouve la feuille avec la plus grande réduction de perte et la divise, créant un chemin complet vers une nouvelle feuille avant d\'étendre d\'autres branches. Cela crée des arbres plus profonds et plus efficaces.' },
  'lgbm.treeGrowth.animating': { en: 'Growing leaf by leaf...', fr: 'Croissance feuille par feuille...' },
  'lgbm.treeGrowth.split': { en: 'Splitting leaf with max loss reduction', fr: 'Division de la feuille avec la plus grande réduction de perte' },
  'lgbm.advantages.title': { en: 'Key Advantages', fr: 'Avantages Clés' },
  'lgbm.faster': { en: '⚡ Faster Training', fr: '⚡ Entraînement Plus Rapide' },
  'lgbm.faster.desc': { en: 'Up to 10x faster than XGBoost due to leaf-wise growth and feature bundling', fr: 'Jusqu\'à 10x plus rapide que XGBoost grâce à la croissance feuille par feuille et au regroupement de caractéristiques' },
  'lgbm.memory': { en: '🌿 Lower Memory', fr: '🌿 Moins de Mémoire' },
  'lgbm.memory.desc': { en: 'More memory efficient, can handle larger datasets', fr: 'Plus efficace en mémoire, peut gérer des ensembles de données plus volumineux' },
  'lgbm.accuracy': { en: '📉 Better Accuracy', fr: '📉 Meilleure Précision' },
  'lgbm.accuracy.desc': { en: 'Often achieves better accuracy with fewer trees', fr: 'Atteint souvent une meilleure précision avec moins d\'arbres' },

  // Decision Tree
  'dt.title': { en: 'Decision Tree', fr: 'Arbre de Décision' },
  'dt.subtitle': { en: 'A simple tree-based model that makes decisions by asking questions about features', fr: 'Un modèle simple basé sur des arbres qui prend des décisions en posant des questions sur les caractéristiques' },

  // Ensemble
  'ensemble.title': { en: 'Ensemble Model (Voting Classifier)', fr: 'Modèle d\'Ensemble (Classifieur de Vote)' },
  'ensemble.subtitle': { en: 'Combines predictions from multiple models to achieve better accuracy and robustness', fr: 'Combine les prédictions de plusieurs modèles pour atteindre une meilleure précision et robustesse' },
  'ensemble.voting.title': { en: 'Voting Strategy', fr: 'Stratégie de Vote' },
  'ensemble.voting.hard': { en: 'Hard Voting', fr: 'Vote Dur' },
  'ensemble.voting.hard.desc': { en: 'Each model votes for a class, majority wins', fr: 'Chaque modèle vote pour une classe, la majorité l\'emporte' },
  'ensemble.voting.soft': { en: 'Soft Voting', fr: 'Vote Doux' },
  'ensemble.voting.soft.desc': { en: 'Averages probability scores from all models', fr: 'Moyenne des scores de probabilité de tous les modèles' },
  'ensemble.select.title': { en: 'Select Models for Ensemble', fr: 'Sélectionner les Modèles pour l\'Ensemble' },
  'ensemble.select.active': { en: '✓ Active', fr: '✓ Actif' },
  'ensemble.select.inactive': { en: 'Inactive', fr: 'Inactif' },
  'ensemble.predictions.title': { en: 'Individual Model Predictions', fr: 'Prédictions des Modèles Individuels' },
  'ensemble.votingProcess.title': { en: 'Voting Process', fr: 'Processus de Vote' },
  'ensemble.votingProcess.hard': { en: 'Hard Voting Process', fr: 'Processus de Vote Dur' },
  'ensemble.votingProcess.soft': { en: 'Soft Voting Process', fr: 'Processus de Vote Doux' },
  'ensemble.votingProcess.click': { en: 'Click Votes', fr: 'Votes pour Clic' },
  'ensemble.votingProcess.noClick': { en: 'No Click Votes', fr: 'Votes pour Pas de Clic' },
  'ensemble.votingProcess.avg': { en: 'Average Probability', fr: 'Probabilité Moyenne' },
  'ensemble.final.title': { en: 'Ensemble Prediction ({type} voting)', fr: 'Prédiction d\'Ensemble (vote {type})' },
  'ensemble.final.confidence': { en: 'Confidence:', fr: 'Confiance:' },
  'ensemble.final.based': { en: 'Based on {count} model{plural}', fr: 'Basé sur {count} modèle{plural}' },
  'ensemble.robust': { en: '🛡️ More Robust', fr: '🛡️ Plus Robuste' },
  'ensemble.robust.desc': { en: 'Reduces risk of relying on a single model\'s weaknesses', fr: 'Réduit le risque de s\'appuyer sur les faiblesses d\'un seul modèle' },
  'ensemble.better': { en: '📈 Better Accuracy', fr: '📈 Meilleure Précision' },
  'ensemble.better.desc': { en: 'Often outperforms individual models through diversity', fr: 'Surpasse souvent les modèles individuels grâce à la diversité' },
  'ensemble.diversity': { en: '👥 Diversity', fr: '👥 Diversité' },
  'ensemble.diversity.desc': { en: 'Different models capture different patterns in the data', fr: 'Différents modèles capturent différents modèles dans les données' },
}

interface TranslationContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string, params?: Record<string, string | number>) => string
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined)

export function TranslationProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en')

  const t = (key: string, params?: Record<string, string | number>): string => {
    const translation = translations[key]?.[language] || translations[key]?.en || key
    
    if (params) {
      return Object.entries(params).reduce((str, [param, value]) => {
        return str.replace(new RegExp(`\\{${param}\\}`, 'g'), String(value))
      }, translation)
    }
    
    return translation
  }

  return (
    <TranslationContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </TranslationContext.Provider>
  )
}

export function useTranslation() {
  const context = useContext(TranslationContext)
  if (!context) {
    throw new Error('useTranslation must be used within TranslationProvider')
  }
  return context
}

