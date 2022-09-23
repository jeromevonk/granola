import { Subject } from 'rxjs';
import { filter } from 'rxjs/operators';

export const alertService = {
  onAlert,
  success,
  error,
  alert,
  clear
};

export const AlertType = {
  Success: 'success',
  Error: 'error',
};

const alertSubject = new Subject();
const defaultId = 'default-alert';

// enable subscribing to alerts observable
function onAlert(id = defaultId) {
  return alertSubject.asObservable().pipe(filter(x => x && x.id === id));
}

// convenience methods
function success(message, options) {
  alert({ ...options, type: AlertType.Success, message });
}

function error(message, options) {
  alert({ ...options, type: AlertType.Error, message });
}

// core alert method
function alert(newAlert) {
  newAlert.id = newAlert.id || defaultId;
  newAlert.autoClose = (newAlert.autoClose === undefined ? true : newAlert.autoClose);
  alertSubject.next(newAlert);
}

// clear alerts
function clear(id = defaultId) {
  alertSubject.next({ id });
}