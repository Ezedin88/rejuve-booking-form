import { Field } from 'formik'

function Agreement({
    agreeToTos,
    setAgreeToTos,
    agreeToCreateAccount,
    setAgreeToCreateAccount,
    agreeToSignUp,
    setAgreeToSignUp
}) {
  return (
    <>
     <div>
                <label>
                  <Field type="checkbox" name="terms" 
                  checked={agreeToTos}
                    onChange={() => setAgreeToTos(!agreeToTos)}
                  required
                  />
                  I agree to the ToS, Privacy Policy, Consent To Treat, and and Cancellation Policy *
                </label>
              </div>
              <div>
                <label>
                  <Field type="checkbox" name="createAccount" 
                  checked={agreeToCreateAccount}
                  onChange={() => setAgreeToCreateAccount(!agreeToCreateAccount)}
                  required
                  />
                  Create an account for me and send me secure login details to my e-mail. (recommended)
                </label>
              </div>
              <div>
                <label>
                  <Field type="checkbox" name="signUp"  
                  checked={agreeToSignUp}
                  onChange={() => setAgreeToSignUp(!agreeToSignUp)}
                  required
                  />
                  Sign-up to receiving exclusive offers and service updates! (recommended)
                </label>
              </div>
    </>
)
}

export default Agreement