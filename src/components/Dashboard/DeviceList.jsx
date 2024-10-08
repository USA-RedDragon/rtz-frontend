import React, { Component } from 'react';
import { connect } from 'react-redux';
import Obstruction from 'obstruction';

import { Typography, IconButton } from '@mui/material';
import { withStyles } from '@mui/styles';
import SettingsIcon from '@mui/icons-material/Settings';

import MyCommaAuth from '@commaai/my-comma-auth';
import { devices as Devices } from '@commaai/api';

import { updateDevices } from '../../actions';
import Colors from '../../colors';
import { deviceNamePretty, deviceIsOnline, filterRegularClick, emptyDevice } from '../../utils';
import VisibilityHandler from '../VisibilityHandler';

import AddDevice from './AddDevice';
import DeviceSettingsModal from './DeviceSettingsModal';

const styles = (theme) => ({
  deviceList: {
    overflow: 'auto',
  },
  device: {
    textDecoration: 'none',
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'space-between',
    padding: '16px 32px',
    '&.isSelected': {
      backgroundColor: 'rgba(0, 0, 0, 0.25)',
    },
  },
  settingsButton: {
    height: 46,
    width: 46,
    color: Colors.white30,
    transition: 'color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
    '&:hover': {
      color: Colors.white,
    },
  },
  deviceOnline: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.green400,
  },
  deviceOffline: {
    backgroundColor: Colors.grey400,
  },
  deviceInfo: {
    display: 'flex',
    alignItems: 'center',
  },
  deviceName: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    marginLeft: 16,
  },
  deviceAlias: {
    fontWeight: 600,
  },
  deviceId: {
    color: '#74838e',
  },
  editDeviceIcon: {
    color: 'white',
    '&:hover': {
      color: theme.palette.grey[100],
    },
  },
  nameField: {
    marginRight: theme.spacing(1),
  },
  saveButton: {
    marginRight: theme.spacing(1),
  },
  textField: {
    marginBottom: theme.spacing(1),
  },
  addDeviceContainer: {
    '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.25)' },
  },
});

class DeviceList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      settingsModalDongleId: null,
    };

    this.renderDevice = this.renderDevice.bind(this);
    this.handleOpenedSettingsModal = this.handleOpenedSettingsModal.bind(this);
    this.handleClosedSettingsModal = this.handleClosedSettingsModal.bind(this);
    this.onVisible = this.onVisible.bind(this);
  }

  handleOpenedSettingsModal(dongleId, ev) {
    ev.stopPropagation();
    ev.preventDefault();
    this.setState({ settingsModalDongleId: dongleId });
  }

  handleClosedSettingsModal() {
    this.setState({ settingsModalDongleId: null });
  }

  async onVisible() {
    const { dispatch } = this.props;
    if (MyCommaAuth.isAuthenticated()) {
      try {
        const devices = await Devices.listDevices();
        dispatch(updateDevices(devices));
      } catch (err) {
        console.error(err);
      }
    }
  }

  renderDevice(device) {
    const { classes, handleDeviceSelected, profile, selectedDevice } = this.props;
    const isSelectedCls = (selectedDevice === device.dongle_id) ? 'isSelected' : '';
    const offlineCls = !deviceIsOnline(device) ? classes.deviceOffline : '';
    return (
      <a
        key={device.dongle_id}
        className={ `${classes.device} ${isSelectedCls}` }
        onClick={ filterRegularClick(() => handleDeviceSelected(device.dongle_id)) }
        href={ `/${device.dongle_id}` }
      >
        <div className={classes.deviceInfo}>
          <div className={ `${classes.deviceOnline} ${offlineCls}` }>&nbsp;</div>
          <div className={ classes.deviceName }>
            <Typography className={classes.deviceAlias}>
              {deviceNamePretty(device)}
            </Typography>
            <Typography variant="caption" className={classes.deviceId}>
              { device.dongle_id }
            </Typography>
          </div>
        </div>
        { (device.is_owner || (profile && profile.superuser))
          && (
          <IconButton
            className={classes.settingsButton}
            aria-label="device settings"
            onClick={ (ev) => this.handleOpenedSettingsModal(device.dongle_id, ev) }
            size="large">
            <SettingsIcon className={classes.settingsButtonIcon} />
          </IconButton>
          )}
      </a>
    );
  }

  render() {
    const { settingsModalDongleId } = this.state;
    const { classes, device, selectedDevice: dongleId } = this.props;

    let { devices } = this.props;
    if (devices === null) {
      return null;
    }

    const found = devices.some((d) => d.dongle_id === dongleId);
    if (!found && device && dongleId === device.dongle_id) {
      devices = [{
        ...device,
        alias: emptyDevice.alias,
      }].concat(devices);
    } else if (!found && dongleId) {
      devices = [{
        ...emptyDevice,
        dongle_id: dongleId,
      }].concat(devices);
    }

    const addButtonStyle = {
      borderRadius: 'unset',
      backgroundColor: 'transparent',
      color: 'white',
      fontWeight: 600,
      justifyContent: 'space-between',
      padding: '16px 44px 16px 54px',
    };

    return (
      <>
        <VisibilityHandler onVisible={ this.onVisible } minInterval={ 10 } />
        <div
          className={`scrollstyle ${classes.deviceList}`}
          style={{ height: 'calc(100vh - 64px)' }}
        >
          {devices.map(this.renderDevice)}
          {MyCommaAuth.isAuthenticated() && (
            <div className={classes.addDeviceContainer}>
              <AddDevice buttonText="add new device" buttonStyle={addButtonStyle} buttonIcon />
            </div>
          )}
        </div>
        <DeviceSettingsModal
          isOpen={Boolean(settingsModalDongleId)}
          dongleId={settingsModalDongleId}
          onClose={this.handleClosedSettingsModal}
        />
      </>
    );
  }
}

const stateToProps = Obstruction({
  devices: 'app.devices',
  device: 'app.device',
  profile: 'app.profile',
});

export default connect(stateToProps)(withStyles(styles)(DeviceList));
