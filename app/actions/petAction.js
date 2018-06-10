import * as firebase from 'firebase';
import Mailer from 'react-native-mail';
import { Alert, Platform } from 'react-native';

import I18n from '../i18n/i18n';

const RNFS = require('react-native-fs');
const moment = require('moment');

/**
 * @param  {string} mode  0(rest) or 1(sleep)
 */
export function newBreathRecord(petID, breathRate, mode, recordTime) {
  return () => {
    const petPath = `pets/${petID}`;

    const newRecord = {};
    newRecord[recordTime] = { mode, breathRate };

    console.log('new record', newRecord);
    firebase.database().ref(petPath).child('breathRecord').update(newRecord)
      .then(() => {
        console.log('set new record ok');
      })
      .catch((error) => {
        console.log('add new record failed,', error);
      });
  };
}

export function updatePetInfo(petID, info) {
  return () => {
    const petPath = `pets/${petID}`;

    // console.log('new info', info);
    firebase.database().ref(petPath).update(info)
      .then(() => {
        console.log('update pet info ok');
      })
      .catch((error) => {
        console.log('update pet info failed,', error);
      });
  };
}

export function deleteBreathRecord(petID, recordTime) {
  return () => {
    const recordPath = `pets/${petID}/breathRecord/${recordTime}`;

    // console.log('delete record', recordPath);
    firebase.database().ref(recordPath).remove()
      .then(() => {
        console.log('delete breath ok');
      })
      .catch((error) => {
        console.log('delete record failed,', error);
      });
  };
}

export function exportRecords() {
  return (dispatch, getState) => {
    console.log('export records');

    if (!Mailer) {
      console.log('Mailer is undefined, may be you need to clean the native build cache and try again');
      return;
    }

    const state = getState();
    const { pets } = state;
    const data = JSON.stringify(pets, null, 2);
    const today = moment().format('YYYY-MM-DD');
    const fileName = `maolife-backup-${today}.json`;

    let path;
    if (Platform.OS === 'android') {
      console.log('use android specific path');
      path = `${RNFS.ExternalCachesDirectoryPath}/${fileName}`;
    } else {
      // on android: /data/data/
      // ios: /var/xxx/
      path = `${RNFS.DocumentDirectoryPath}/${fileName}`;
    }

    console.log('FILE WRITE TO!:', path);

    const body = 'Something like 1480949880 is Unix time (from 1970) and the file lists the oldest to the newest';

    // write the file
    RNFS.writeFile(path, data, 'utf8')
      .then((success) => {
        console.log('FILE WRITTEN!');

        console.log('Mailer tries to send');

        Mailer.mail({
          subject: 'backup pet data of maolife',
          recipients: [''],
          // ccRecipients: ['supportCC@example.com'],
          // bccRecipients: ['supportBCC@example.com'],
          body,
          isHTML: true,
          attachment: {
            path, // : '', // The absolute path of the file from which to read data.
            type: 'text', // Mime Type: jpg, png, doc, ppt, html, pdf, csv
            name: fileName, // Optional: Custom filename for attachment
          },
        }, (error, event) => {
          console.log('error:', error, ';ev:', event);
          Alert.alert(
            error === 'not_available' ? I18n.t('Email app is not availabe') : error,
            event,
            [
              { text: 'Ok', onPress: () => console.log('OK: Email Error Response') },
              { text: I18n.t('Cancel'), onPress: () => console.log('CANCEL: Email Error Response') },
            ],
            { cancelable: true },
          );
        });
      })
      .catch((err) => {
        console.log(err.message, err.code);
      });
  };
}
