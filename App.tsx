import React from 'react';
import NavigationTab from './src/router';
import {Amplify} from 'aws-amplify';
import awsconfig from './src/aws-exports';
import {withAuthenticator} from 'aws-amplify-react-native';
import {StripeProvider} from '@stripe/stripe-react-native';

Amplify.configure({
  ...awsconfig,
  Analytics: {
    disabled: true,
  },
});
function App() {
  return (
    <StripeProvider publishableKey="pk_test_qblFNYngBkEdjEZ16jxxoWSM">
      <NavigationTab />
    </StripeProvider>
  );
}
export default withAuthenticator(App);
