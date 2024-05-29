import '../agreementStyles.css';
import { Field } from 'formik';

function Agreement({
  agreeToTos,
  setAgreeToTos,
  agreeToCreateAccount,
  setAgreeToCreateAccount,
  agreeToSignUp,
  setAgreeToSignUp,
}) {
  return (
    <div className="agreement-container-wrapper">
      <div>
        <div className="agreement-wrapper-label">
          <Field
            type="checkbox"
            name="terms"
            id="terms"
            // value="terms"
            // checked={agreeToTos}
            // onChange={() => setAgreeToTos(!agreeToTos)}
            className="agreement-checkbox-input"
          />
          <p className="agreement-description">
            I agree to the ToS, Privacy Policy, Consent To Treat, and and
            Cancellation Policy *
          </p>
        </div>
      </div>
      <div>
        <div className="agreement-wrapper-label">
          {/* <Field type="checkbox" name="createAccount"
            checked={agreeToCreateAccount}
            onChange={() => setAgreeToCreateAccount(!agreeToCreateAccount)}
            required
          /> */}
          <input
            className="agreement-checkbox-input"
            type="checkbox"
            name="createAccount"
            id="createAccount"
            value="createAccount"
            checked={agreeToCreateAccount}
            onChange={() => setAgreeToCreateAccount(!agreeToCreateAccount)}
          />
          <p className="agreement-description">
            {' '}
            Create an account for me and send me secure login details to my
            e-mail. (recommended)
          </p>
        </div>
      </div>
      <div>
        <div className="agreement-wrapper-label">
          {/* <Field type="checkbox" name="signUp"
            checked={agreeToSignUp}
            onChange={() => setAgreeToSignUp(!agreeToSignUp)}
            required
          /> */}

          <input
            className="agreement-checkbox-input"
            type="checkbox"
            name="signUp"
            id="signUp"
            value="signUp"
            checked={agreeToSignUp}
            onChange={() => setAgreeToSignUp(!agreeToSignUp)}
          />
          <p className="agreement-description">
            Sign-up to receiving exclusive offers and service updates!
            (recommended)
          </p>
        </div>
      </div>
    </div>
  );
}

export default Agreement;
