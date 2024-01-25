import { useRouter } from 'next/router'

const useCustomAmp = () => {
  const router = useRouter()
  const ampValidator = /\?amp/
  return {
    isAmp: ampValidator.test(router?.asPath)
  }
}

export default useCustomAmp
