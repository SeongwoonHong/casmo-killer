import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import ConnectTransitionWrapper from '../../ConnectTransitionWrapper/ConnectTransitionWrapper';
import Comment from './Comment';


export default ConnectTransitionWrapper()(
  reduxForm({ })(
    connect(null, null, undefined, { withRef: true }
    )(Comment)));
