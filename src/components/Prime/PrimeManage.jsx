import React, { Component } from 'react';
import { connect } from 'react-redux';
import Obstruction from 'obstruction';
import dayjs from 'dayjs';

import { Typography, Button, Modal, Paper, IconButton, CircularProgress } from '@mui/material';
import { withStyles } from '@mui/styles';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';

import { billing as Billing } from '@commaai/api';
import { deviceNamePretty, deviceTypePretty } from '../../utils';
import ResizeHandler from '../ResizeHandler';
import Colors from '../../colors';
import { ErrorOutline, InfoOutline } from '../../icons';
import { primeNav, primeGetSubscription } from '../../actions';

const styles = (theme) => ({
  linkHighlight: {
    '&:link': {
      textDecoration: "underline",
      color: Colors.green300,
    },
    '&:visited': {
      textDecoration: "underline",
      color: Colors.green300,
    },
    '&:active': {
      textDecoration: "underline",
      color: Colors.green300,
    },
    '&:hover': {
      textDecoration: "underline",
      color: Colors.green400,
    },
  },
  primeBox: {
    display: 'flex',
    flexDirection: 'column',
  },
  primeContainer: {
    borderBottom: `1px solid ${Colors.white10}`,
    color: '#fff',
  },
  primeBlock: {
    marginTop: 10,
  },
  overviewBlock: {
    marginTop: 20,
  },
  overviewBlockError: {
    marginTop: 15,
    padding: 10,
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 0, 0, 0.2)',
    '& p': { display: 'inline-block', marginLeft: 10 },
  },
  overviewBlockSuccess: {
    marginTop: 15,
    padding: 10,
    alignItems: 'center',
    backgroundColor: 'rgba(0, 255, 0, 0.2)',
    '& p': {
      display: 'inline-block',
      marginLeft: 10,
      '&:first-child': { fontWeight: 600 },
    },
  },
  overviewBlockLoading: {
    marginTop: 15,
    padding: 10,
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    '& p': { display: 'inline-block', marginLeft: 10 },
  },
  overviewBlockDisabled: {
    marginTop: 12,
    borderRadius: 12,
    padding: '8px 12px',
    display: 'flex',
    alignItems: 'center',
    backgroundColor: Colors.white08,
    '& p': { display: 'inline-block', marginLeft: 10 },
    '& a': { color: 'white' },
  },
  manageItem: {
    marginLeft: 10,
    '& span': {
      color: Colors.white70,
      fontSize: '0.9em',
    },
  },
  buttons: {
    marginTop: 10,
    background: Colors.white,
    borderRadius: 18,
    color: Colors.grey900,
    textTransform: 'none',
    width: 220,
    '&:hover': {
      backgroundColor: Colors.white70,
      color: Colors.grey900,
    },
    '&:disabled': {
      backgroundColor: Colors.white70,
      color: Colors.grey900,
    },
    '&:disabled:hover': {
      backgroundColor: Colors.white70,
      color: Colors.grey900,
    },
  },
  cancelButton: {
    color: Colors.white,
    background: 'transparent',
    border: `1px solid ${Colors.grey500}`,
    '&:hover': {
      backgroundColor: Colors.white10,
      color: Colors.white,
    },
    '&:disabled': {
      backgroundColor: 'transparent',
      color: Colors.grey500,
    },
    '&:disabled:hover': {
      backgroundColor: 'transparent',
      color: Colors.grey500,
    },
  },
  modal: {
    position: 'absolute',
    padding: theme.spacing(2),
    width: theme.spacing(50),
    maxWidth: '90%',
    left: '50%',
    top: '40%',
    transform: 'translate(-50%, -50%)',
    '& p': {
      marginTop: 10,
    },
  },
  closeButton: {
    marginTop: 10,
    float: 'right',
    backgroundColor: Colors.grey200,
    color: Colors.white,
    '&:hover': {
      backgroundColor: Colors.grey400,
    },
  },
  cancelModalButton: {
    width: 170,
    marginTop: 10,
    backgroundColor: Colors.grey200,
    color: Colors.white,
    '&:hover': {
      backgroundColor: Colors.grey400,
    },
    '&:disabled': {
      backgroundColor: Colors.grey400,
    },
    '&:disabled:hover': {
      backgroundColor: Colors.grey400,
    },
  },
  cancelError: {
    backgroundColor: 'rgba(255, 0, 0, 0.3)',
    marginTop: 10,
    padding: 10,
    '& p': { margin: 0 },
  },
  cancelSuccess: {
    backgroundColor: 'rgba(0, 255, 0, 0.3)',
    marginTop: 10,
    padding: 10,
    '& p': { margin: 0 },
  },
});

class PrimeManage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      cancelError: null,
      cancelModal: false,
      canceling: false,
      windowWidth: window.innerWidth,
    };

    this.fetchSubscription = this.fetchSubscription.bind(this);
    this.onResize = this.onResize.bind(this);
  }

  componentDidMount() {
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  async fetchSubscription(repeat = false) {
    const { dongleId } = this.props;
    if (!this.mounted) {
      return;
    }
    try {
      const subscription = await Billing.getSubscription(dongleId);
      if (subscription.user_id) {
        this.props.dispatch(primeGetSubscription(dongleId, subscription));
      } else {
        setTimeout(() => this.fetchSubscription(true), 2000);
      }
    } catch (err) {
      if (err.message && err.message.indexOf('404') === 0) {
        if (repeat) {
          setTimeout(() => this.fetchSubscription(true), 2000);
        }
      } else {
        console.error(err);
      }
    }
  }

  onResize(windowWidth) {
    this.setState({ windowWidth });
  }

  render() {
    const { dispatch, dongleId, subscription, classes, device } = this.props;
    const { windowWidth } = this.state;

    const hasPrimeSub = subscription && subscription.user_id;

    if (!hasPrimeSub) {
      return null;
    }

    let joinDate;
    let nextPaymentDate;
    let cancelAtDate;
    let planName;
    let planSubtext;
    if (hasPrimeSub) {
      joinDate = dayjs(subscription.subscribed_at ? subscription.subscribed_at * 1000 : 0).format('MMMM D, YYYY');
      nextPaymentDate = dayjs(subscription.next_charge_at ? subscription.next_charge_at * 1000 : 0).format('MMMM D, YYYY');
      cancelAtDate = dayjs(subscription.cancel_at ? subscription.cancel_at * 1000 : 0).format('MMMM D, YYYY');
      planName = subscription.plan === 'nodata' ? 'Lite' : 'Standard';
      planSubtext = subscription.plan === 'nodata' ? '(without data plan)' : '(with data plan)';
    }

    const hasCancelAt = Boolean(hasPrimeSub && subscription.cancel_at && subscription.cancel_at <= subscription.next_charge_at);
    const alias = deviceNamePretty(device);
    const containerPadding = windowWidth > 520 ? 36 : 16;
    const buttonSmallStyle = windowWidth < 514 ? { width: '100%' } : {};

    return <>
      <ResizeHandler onResize={this.onResize} />
      <div className={classes.primeBox}>
        <div className={classes.primeContainer} style={{ padding: `8px ${containerPadding}px` }}>
          <IconButton
            aria-label="Go Back"
            onClick={() => dispatch(primeNav(false))}
            size="large">
            <KeyboardBackspaceIcon />
          </IconButton>
        </div>
        <div className={classes.primeContainer} style={{ padding: `16px ${containerPadding}px` }}>
          <Typography variant="title">comma prime</Typography>
          <div className={classes.overviewBlock}>
            <Typography variant="subheading">Device</Typography>
            <div className={classes.manageItem}>
              <Typography variant="body2">{alias}</Typography>
              <Typography variant="caption" className={classes.deviceId}>
                {`(${device.dongle_id})`}
              </Typography>
            </div>
          </div>
          {hasPrimeSub && (
            <>
              <div className={classes.overviewBlock}>
                <Typography variant="subheading">Plan</Typography>
                <Typography className={classes.manageItem}>
                  {planName}
                  <span>{` ${planSubtext}`}</span>
                </Typography>
              </div>
              <div className={classes.overviewBlock}>
                <Typography variant="subheading">Joined</Typography>
                <Typography className={classes.manageItem}>{joinDate}</Typography>
              </div>
              {!hasCancelAt
                && (
                  <div className={classes.overviewBlock}>
                    <Typography variant="subheading">Next payment</Typography>
                    <Typography className={classes.manageItem}>{nextPaymentDate}</Typography>
                  </div>
                )}
              {hasCancelAt
                && (
                  <div className={classes.overviewBlock}>
                    <Typography variant="subheading">Subscription end</Typography>
                    <Typography className={classes.manageItem}>{cancelAtDate}</Typography>
                  </div>
                )}
              <div className={classes.overviewBlock}>
                <Typography variant="subheading">Amount</Typography>
                <Typography className={classes.manageItem}>
                  {`$${(subscription.amount / 100).toFixed(2)}`}
                </Typography>
              </div>
              {this.state.error && (
                <div className={classes.overviewBlockError}>
                  <ErrorOutline />
                  <Typography>{this.state.error}</Typography>
                </div>
              )}
              {hasPrimeSub && subscription.requires_migration
                && (
                  <div className={classes.overviewBlockDisabled}>
                    <PriorityHighIcon />
                    <Typography>
                      Your prime subscription will be canceled on May 15th unless you replace the
                      SIM
                      card in your device. A new SIM card can be ordered from the
                      <a className={ classes.linkHighlight} href="https://comma.ai/shop/comma-prime-sim">shop</a>
                      .
                      Use discount code SIMSWAP at checkout to receive a free SIM card.
                    </Typography>
                  </div>
                )}
              {hasCancelAt && !device.eligible_features?.prime_data && subscription.plan === 'data'
                && (
                  <div className={classes.overviewBlockDisabled}>
                    <InfoOutline />
                    <Typography>
                      Standard comma prime discontinued for
                      {deviceTypePretty(device.device_type)}
                    </Typography>
                  </div>
                )}
            </>
          )}
        </div>
      </div>
      <Modal
        open={this.state.cancelModal}
        onClose={() => this.setState({ cancelModal: false })}
      >
        <Paper className={classes.modal}>
          <Typography variant="title">Cancel prime subscription</Typography>
          {this.state.cancelError && (
            <div className={classes.cancelError}>
              <Typography>{this.state.cancelError}</Typography>
            </div>
          )}
          {this.state.cancelSuccess && (
            <div className={classes.cancelSuccess}>
              <Typography>{this.state.cancelSuccess}</Typography>
            </div>
          )}
          <Typography>
            {`Device: ${alias} (${dongleId})`}
          </Typography>
          <Typography>
            We&apos;re sorry to see you go.
          </Typography>
          <Typography>
            Your subscription will be cancelled immediately and can be resumed at any time.
          </Typography>
          <Button
            variant="contained"
            className={`${classes.closeButton} primeModalClose`}
            onClick={() => this.setState({ cancelModal: false })}
          >
            Close
          </Button>
        </Paper>
      </Modal>
    </>;
  }
}

const stateToProps = Obstruction({
  dongleId: 'dongleId',
  device: 'device',
  subscription: 'subscription',
});

export default connect(stateToProps)(withStyles(styles)(PrimeManage));
