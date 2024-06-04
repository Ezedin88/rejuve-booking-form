import './App.css';
import { Elements } from '@stripe/react-stripe-js';
import MainAppEntry from './MainAppEntry';
import { loadStripe } from '@stripe/stripe-js';
function App() {
 const stripePromise = loadStripe('pk_test_51HFQsEF7hHoyPJTdIvpMJXC7IwKaM7eq4NCaplVU8pw7ti9fWWcPfE7b8ABWv2tUNJgmP1cEgZxqinVBYA7y31mC00e4PgE3PH');
  return (
    <Elements stripe={stripePromise}>
      <MainAppEntry/>
    </Elements>
  )
}

export default App;
