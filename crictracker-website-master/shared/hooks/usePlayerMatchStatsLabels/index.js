import useTranslation from 'next-translate/useTranslation'

const usePlayerMatchStatsLabels = (role, options) => {
  const { t } = useTranslation()
  const labels = [t('common:Match'), t('common:Bat'), t('common:Bowl'), t('common:Date'), t('common:Venue')]
  const allLabels = [t('common:Match'), t('common:Bat'), t('common:Bowl'), t('common:Date'), t('common:Venue'), t('common:Format')]

  const recentBatLabelsAll = allLabels
  const recentBatLabels = labels

  const recentBowlLabelsAll = allLabels
  const recentBowlLabels = labels

  const recentAllRounderLabelsAll = allLabels
  const recentAllRounderLabels = labels

  if (role === 'bat' || role === 'wkbat' || role === 'wk') {
    if (!options?.isBowlingData) {
      recentBatLabels.splice(2, 1)
      recentBatLabelsAll.splice(2, 1)
    }
    return [recentBatLabelsAll, recentBatLabels]
  } else if (role === 'bowl') {
    if (!options?.isBattingData) {
      recentBowlLabels.splice(1, 1)
      recentBowlLabelsAll.splice(1, 1)
    }
    return [recentBowlLabelsAll, recentBowlLabels]
  } else if (role === 'all') {
    return [recentAllRounderLabelsAll, recentAllRounderLabels]
  } else {
    return null
  }
}

export default usePlayerMatchStatsLabels
