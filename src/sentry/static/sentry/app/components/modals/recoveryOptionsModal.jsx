import PropTypes from 'prop-types';
import React from 'react';

import {t} from '../../locale';
import AsyncComponent from '../../components/asyncComponent';
import Button from '../../components/buttons/button';
import TextBlock from '../../views/settings/components/text/textBlock';

class RecoveryOptions extends AsyncComponent {
  static propTypes = {
    closeModal: PropTypes.func,
    onClose: PropTypes.func,
    authenticatorName: PropTypes.string.isRequired,
    Body: PropTypes.oneOfType([PropTypes.func, PropTypes.node]).isRequired,
    Header: PropTypes.oneOfType([PropTypes.func, PropTypes.node]).isRequired,
  };

  constructor(...args) {
    super(...args);
    this.state = {
      skipSms: false,
    };
  }

  getEndpoints() {
    return [['authenticators', '/users/me/authenticators/']];
  }

  handleSkipSms = () => {
    this.setState({skipSms: true});
  };

  renderBody() {
    let {closeModal, authenticatorName, Header, Body} = this.props;
    let {skipSms, authenticators} = this.state;

    let {recovery, sms} = authenticators.reduce((obj, item) => {
      obj[item.id] = item;
      return obj;
    }, {});

    let smsEnrolled = sms && sms.isEnrolled;
    let recoveryEnrolled = recovery && recovery.isEnrolled;

    return (
      <React.Fragment>
        <Header closeButton onHide={closeModal}>
          {t('Two Factor Authentication Enabled')}
        </Header>

        <Body>
          <TextBlock>
            {t(`Two factor authentication via ${authenticatorName} has been enabled. `)}
          </TextBlock>
          <TextBlock>
            {t('You should now set up recovery options to secure your account.')}
          </TextBlock>

          {!skipSms && !smsEnrolled ? (
            // set up backup phone number
            <div>
              <TextBlock>
                {t('Do you want to add a phone number as a backup 2FA method?')}
              </TextBlock>
              <Button onClick={this.handleSkipSms} autoFocus>
                {t('Skip this step')}
              </Button>
              <Button
                priority={'primary'}
                to={`/settings/account/security/${sms.id}/enroll/`}
                autoFocus
              >
                {t('Add a Phone Number')}
              </Button>
            </div>
          ) : (
            // get recovery codes
            <div>
              <TextBlock>
                {t(
                  `Using a recovery code is the only way to access your account if you lose your
                   device and cannot receive two factor authentication codes. We strongly recommend
                   that you save a copy of your recovery codes and store them in a safe place.`
                )}
              </TextBlock>
              <Button
                priority={'primary'}
                to={
                  recoveryEnrolled
                    ? `/settings/account/security/${recovery.authId}/`
                    : '/settings/account/security/'
                }
                autoFocus
              >
                {t('Get Recovery Codes')}
              </Button>
            </div>
          )}
        </Body>
      </React.Fragment>
    );
  }
}

export default RecoveryOptions;
