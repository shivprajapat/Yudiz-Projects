import { Link, useHistory } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Form, FormGroup, Label, Input, Button, FormFeedback } from 'reactstrap'
import { Fragment } from 'react'
import { useDispatch } from 'react-redux'
import { Coffee } from 'react-feather'
import { toast, Slide } from 'react-toastify'

import '@styles/base/pages/page-auth.scss'
import Avatar from '@components/avatar'
import InputPasswordToggle from '@components/input-password-toggle'
import { handleLogin } from '../../../redux/actions/auth'
import { getHomeRouteForLoggedInUser } from '@utils'
import { EMAIL_ADDRESS } from '../../../utility/Constant'

export const ToastContent = ({ name, role }) => (
  <Fragment>
    <div className="toastify-header">
      <div className="title-wrapper">
        <Avatar size="sm" color="success" icon={<Coffee size={12} />} />
        <h6 className="toast-title font-weight-bold">Welcome, {name}</h6>
      </div>
    </div>
    <div className="toastify-body">
      <span>You have successfully logged in as an {role} user to Super. Now you can start to explore. Enjoy!</span>
    </div>
  </Fragment>
)

const Login = () => {
  // ** skin state
  // const [skin, setSkin] = useSkin()

  // ** form states
  const history = useHistory()
  const dispatch = useDispatch()
  // const [email, setEmail] = useState('')
  // const [password, setPassword] = useState('')

  // const illustration = skin === 'dark' ? 'login-v2-dark.svg' : 'login-v2.svg'
  // const source = require(`@src/assets/images/pages/${illustration}`).default

  // ** form cofig
  const { handleSubmit, register, errors } = useForm({ mode: 'onTouched' })

  // ** submit-login-data
  const onSubmit = async (data) => {
    const payload = {
      sEmail: data.sEmail,
      sPassword: data.sPassword
    }
    dispatch(
      await handleLogin(payload, (data) => {
        toast.success(<ToastContent name={data?.message} role="admin" />, {
          transition: Slide,
          hideProgressBar: true,
          autoClose: 2000
        })
        history.push(getHomeRouteForLoggedInUser('admin'))
      })
    )
  }

  return (
    <Form className="auth-login-form mt-2" onSubmit={handleSubmit(onSubmit)}>
      <FormGroup>
        <Label className="form-label" for="login-email">
          Email
        </Label>
        <Input
          autoFocus
          id="login-email"
          placeholder="john@example.com"
          name="sEmail"
          invalid={errors.sEmail && true}
          // value={'priyanshu@yudiz.com'}
          // onChange={(e) => setEmail(e.target.value)}
          innerRef={register({
            required: 'This field is required',
            pattern: { value: EMAIL_ADDRESS, message: 'Please enter a valid email' }
          })}
        />

        {errors && errors.sEmail && <FormFeedback className="d-block">{errors.sEmail.message}</FormFeedback>}
      </FormGroup>
      <FormGroup>
        <div className="d-flex justify-content-between">
          <Label className="form-label" for="login-password">
            Password
          </Label>
          <Link to="/forgotpassword">
            <small>Forgot Password?</small>
          </Link>
        </div>
        <InputPasswordToggle
          id="login-password"
          className="input-group-merge"
          name="sPassword"
          invalid={errors.sPassword && true}
          innerRef={register({ required: true })}
        />
        {errors && errors.sPassword && <FormFeedback className="d-block">Please enter your password</FormFeedback>}
      </FormGroup>

      <Button.Ripple type="submit" color="primary" block>
        Sign in
      </Button.Ripple>
    </Form>
  )
}

export default Login
