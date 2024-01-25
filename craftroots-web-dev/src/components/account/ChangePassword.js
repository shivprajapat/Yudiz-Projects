import { useIntl } from 'react-intl'
import PasswordFields from '../generic/form/PasswordFields'
import { Button, PasswordInput } from '@/components/generic'
import useChangePassword from '@/hooks/useChangePassword'

function ChangePassword() {
  const {
    register,
    handlePassword,
    changePasswordResult,
    errors,
    passwordState,
    handleSubmit,
    onSubmit,
    hasRequiredFieldError,
    validateConfirmPassword,
  } = useChangePassword()
  const intl = useIntl()

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="form-group">
        <PasswordInput
          placeholder={intl.formatMessage({
            id: 'form.oldPassword.placeHolder',
          })}
          name="currentPassword"
          type="text"
          errorFieldName="Current Password"
          register={register}
          required
          disabled={changePasswordResult?.state?.isLoading}
          eyeBtn
          hideErrorMessage={true}
          errors={errors}
        />
      </div>
      <PasswordFields
        intl={intl}
        register={register}
        handlePassword={handlePassword}
        PasswordResult={changePasswordResult}
        errors={errors}
        passwordState={passwordState}
        hasRequiredFieldError={hasRequiredFieldError}
        validateConfirmPassword={validateConfirmPassword}
      />
      <div className="mt-8">
        <Button
          title={intl.formatMessage({
            id: 'button.submit',
          })}
          type="submit"
          disabled={changePasswordResult?.state?.isLoading}
          className="w-full sm:w-fit"
        />
      </div>
    </form>
  )
}
export default ChangePassword
