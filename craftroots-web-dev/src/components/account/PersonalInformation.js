import { FormattedMessage, useIntl } from 'react-intl'
import PropTypes from 'prop-types'
import { Button } from '../generic'

function PersonalInformation({ handleStepChange, accountdetails }) {
  const intl = useIntl()
  return (
    <div>
      <div className="sm:border border-grey-400 sm:p-5">
        <ul className="space-y-5">
          <li>
            <span className="mb-1 text-custom-black1 text-sm">
              <FormattedMessage id="form.firstName.placeHolder" />:
            </span>
            <p className="text-base font-medium text-custom-black2">
              {accountdetails?.firstname}
            </p>
          </li>
          <li>
            <span className="mb-1 text-custom-black1 text-sm">
              <FormattedMessage id="form.lastName.placeHolder" />:
            </span>
            <p className="text-base font-medium text-custom-black2">
              {accountdetails?.lastname}
            </p>
          </li>
          <li>
            <span className="mb-1 text-custom-black1 text-sm">
              <FormattedMessage id="form.email.placeHolder" />:
            </span>
            <p className="text-base font-medium text-custom-black2">
              {accountdetails?.email}
            </p>
          </li>
          <li>
            <span className="mb-1 text-custom-black1 text-sm">
              <FormattedMessage id="form.mobileNumber.placeHolder" />:
            </span>
            <p className="text-base font-medium text-custom-black2">
              +91 {accountdetails?.mobilenumber}
            </p>
          </li>
        </ul>
      </div>
      <div className="flex justify-between sm:justify-start gap-2 mt-6">
        <Button
          title={intl.formatMessage({ id: 'button.editProfile' })}
          onClick={() => handleStepChange(2)}
          className="w-[90%] sm:w-fit"
        />
        <Button
          title={intl.formatMessage({
            id: 'page.myAccount.title.changePassword',
          })}
          onClick={() => handleStepChange(1)}
          className="w-full sm:w-fit"
        />
      </div>
    </div>
  )
}

export default PersonalInformation
PersonalInformation.propTypes = {
  handleStepChange: PropTypes.func,
  accountdetails: PropTypes.any,
}
