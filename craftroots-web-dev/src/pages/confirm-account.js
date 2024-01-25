import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import { FormattedMessage } from 'react-intl'
import Link from 'next/link'
import { useSelector } from 'react-redux'
import { iconEmail } from '@/assets/images'
import { allRoutes } from '@/constants/allRoutes'
import useConfirmAccount from '@/hooks/useConfirmAccount'
import { AuthForm, Meta, SpinnerLoader } from '@/components/generic'
import AuthBannerWrapper from '@/components/generic/AuthBannerWrapper'
import META from '@/helper/meta-constant'

const ConfirmAccount = () => {
  const intl = useIntl()

  const router = useRouter()

  const { loading } = useConfirmAccount()
  const { toast: toastState } = useSelector((state) => state)
  const labels = {
    verifying2: intl.formatMessage({ id: 'page.confirmAccount.verifying2' }),
    verifying3: intl.formatMessage({ id: 'page.confirmAccount.verifying3' }),
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (!params || !params.size || !params.get('id')) {
      router.push(allRoutes.signIn)
    }
  }, [router])

  return (
    <>
      <Meta
        title={META.confirmAccount.title}
        description={META.confirmAccount.description}
      />
      <AuthBannerWrapper>
        <AuthForm
          title="page.confirmAccount.verifying1"
          icon={iconEmail}
          className="!mb-4"
        >
          <div className="text-center">
            <div className="mb-2">
              <p className="text-base sm:text-lg text-gray-500">
                {labels.verifying2}
              </p>
              <p className="text-base sm:text-lg text-gray-500">
                {labels.verifying3}
              </p>
            </div>
            <div className="flex justify-center py-2">
              {toastState?.error && (
                <div className="text-center mt-4">
                  <Link
                    href={allRoutes.home}
                    className="text-secondary-200 font-medium text-sm"
                  >
                    <FormattedMessage id="page.confirmEmailAddress.backToHome" />
                  </Link>
                </div>
              )}
              {loading && <SpinnerLoader size={10} grey />}
            </div>
          </div>
        </AuthForm>
      </AuthBannerWrapper>
    </>
  )
}
export default ConfirmAccount
