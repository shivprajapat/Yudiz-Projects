import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import { FormattedMessage } from 'react-intl'
import Link from 'next/link'
import { iconEmail } from '@/assets/images'
import { allRoutes } from '@/constants/allRoutes'
import { AuthForm, Button, Input, Meta } from '@/components/generic'
import useConfirmEmailAddress from '@/hooks/useConfirmEmailAddress'
import AuthBannerWrapper from '@/components/generic/AuthBannerWrapper'
import META from '@/helper/meta-constant'

const ConfirmEmailAddress = () => {
  const { register, handleSubmit, errors, intl, onSubmit, setValue } =
    useConfirmEmailAddress()

  const router = useRouter()
  const { email } = router.query

  useEffect(() => {
    if (email) {
      setValue('email', email)
    }
  }, [email, setValue])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (!params || !params.size || !params.get('email')) {
      router.push(allRoutes.signIn)
    }
  }, [router])

  return (
    <>
      <Meta
        title={META.confirmEmailAddress.title}
        description={META.confirmEmailAddress.description}
      />
      <AuthBannerWrapper>
        <AuthForm
          title="page.auth.title.confirmEmailAddress"
          icon={iconEmail}
          className="!mb-4 text-xl"
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group">
              <Input
                placeholder={intl.formatMessage({
                  id: 'form.emailAddress.placeHolder',
                })}
                name="email"
                type="email"
                register={register}
                required
                disabled
                errors={errors}
              />
            </div>
            <div className="text-center mt-4 sm:mt-8">
              <Button
                fullWidth
                title={intl.formatMessage({
                  id: 'button.sendConfirmationLink',
                })}
                type="submit"
              />
            </div>

            <div className="text-center mt-4">
              <Link
                href={allRoutes.home}
                className="text-secondary-200 font-medium text-sm"
              >
                <FormattedMessage id="page.confirmEmailAddress.backToHome" />
              </Link>
            </div>
          </form>
        </AuthForm>
      </AuthBannerWrapper>
    </>
  )
}

export default ConfirmEmailAddress
