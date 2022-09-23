import * as React from 'react';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

import { alertService } from 'src/services';

export { CustomAlert };

CustomAlert.propTypes = {
  id: PropTypes.string,
};

CustomAlert.defaultProps = {
  id: 'default-alert',
};

function CustomAlert({ id }) {
  const router = useRouter();
  const [alerts, setAlerts] = React.useState([]);
  const [open, setOpen] = React.useState(true);


  React.useEffect(() => {
    // subscribe to new alert notifications
    const subscription = alertService.onAlert(id)
      .subscribe(alert => {
        // clear alerts when an empty alert is received
        if (!alert.message) {
          setAlerts(currentAlerts => {
            // filter out alerts without 'keepAfterRouteChange' flag
            const filteredAlerts = currentAlerts.filter(x => x.keepAfterRouteChange);

            // set 'keepAfterRouteChange' flag to false on the rest
            filteredAlerts.forEach(x => delete x.keepAfterRouteChange);
            return filteredAlerts;
          });
        } else {
          // add alert to array
          setAlerts(currentAlerts => ([...currentAlerts, alert]));
          setOpen(true);

          // auto close alert if required
          if (alert.autoClose) {
            setTimeout(() => removeAlert(alert), 1500);
          }
        }
      });

    // clear alerts on location change
    const clearAlerts = () => {
      setTimeout(() => alertService.clear(id));
    };
    router.events.on('routeChangeStart', clearAlerts);

    // clean up function that runs when the component unmounts
    return () => {
      // unsubscribe to avoid memory leaks
      subscription.unsubscribe();
      router.events.off('routeChangeStart', clearAlerts);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function removeAlert(alert) {
    setAlerts(currentAlerts => currentAlerts.filter(x => x !== alert));
  }

  if (!alerts.length) return null;

  const handleClose = (_event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const action = (
    <React.Fragment>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  // Current limitation: will only show the first alert on list
  return (
    <div>
      <Snackbar
        open={open}
        autoHideDuration={1500}
        onClose={handleClose}
        message={alerts[0].message}
        action={action}
        anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
      />
    </div>
  );
}