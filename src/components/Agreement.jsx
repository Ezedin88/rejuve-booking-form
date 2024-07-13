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
  const handleCheckboxClick = (e) => {
    e.stopPropagation();
    setAgreeToCreateAccount(!agreeToCreateAccount);
  };
  return (
    <div className="agreement-container-wrapper">
      <div>
        <label className="agreement-wrapper-label" htmlFor="terms">
          <Field
            type="checkbox"
            name="terms"
            id="terms"
            // value="terms"
            // checked={agreeToTos}
            // onChange={() => setAgreeToTos(!agreeToTos)}
            className="agreement-checkbox-input"
          />
         <p
  className="agreement-description"
  style={{ cursor: 'pointer' }}
  onClick={() => setAgreeToTos(!agreeToTos)}
>
  I agree to the <a
    href="https://rejuve.com/tos-policy/"
    target="_blank"
    style={{ textDecoration: 'none', color: '#32c0cc' }}
    onClick={(e) => e.stopPropagation()} // Prevents toggling agreeToTos when clicking the link
  >ToS</a>,
  <a
    href="https://rejuve.com/privacy-policy/"
    target="_blank"
    style={{ textDecoration: 'none', color: '#32c0cc' }}
    onClick={(e) => e.stopPropagation()} // Prevents toggling agreeToTos when clicking the link
  >
    Privacy Policy
  </a>
  ,
  <a 
    href="https://rejuve.com/consent-to-treat-policy/"
    target="_blank"
    style={{ textDecoration: 'none', color: '#32c0cc' }}
    onClick={(e) => e.stopPropagation()} // Prevents toggling agreeToTos when clicking the link
  >
    Consent To Treat
  </a>
  , <a
    href="https://rejuve.com/cancellation-policy/"
    target="_blank"
    style={{ textDecoration: 'none', color: '#32c0cc' }}
    onClick={(e) => e.stopPropagation()} // Prevents toggling agreeToTos when clicking the link
  >and Cancellation Policy *</a>
</p>

        </label>
      </div>

      <div>
        <label className="agreement-wrapper-label" htmlFor="createAccounts">
          <Field
            type="checkbox"
            name="createAccount"
            checked={agreeToCreateAccount}
            onChange={(e) => handleCheckboxClick(e)}
            required
            className="agreement-checkbox-input"
          />
          {/* <input
            type="checkbox"
            name="createAccount"
            id="createAccounts"
            value="createAccount"
            checked={agreeToCreateAccount}
            onChange={(e) => handleCheckboxClick(e)}
          /> */}
          <p
            className="agreement-description"
            style={{ cursor: 'pointer' }}
            onClick={(e) => handleCheckboxClick(e)}
          >
            {' '}
            Create an account for me and send me secure login details to my
            e-mail. (recommended)
          </p>
        </label>
      </div>

      <div>
        <label className="agreement-wrapper-label" htmlFor="signUp">
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
          <p className="agreement-description" style={{ cursor: 'pointer' }}>
            Sign-up to receiving exclusive offers and service updates!
            (recommended)
          </p>
        </label>
      </div>
    </div>
  );
}

export default Agreement;
