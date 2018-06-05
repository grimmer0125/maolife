import * as firebase from 'firebase';

/**
 * @param  {string} mode "sleep" or "rest"
 */
export function newBreathRecord(petID, breathRate, mode, recordTime) {
  return () => {
    const petPath = `pets/${petID}`;

    const newRecord = {};
    newRecord[recordTime] = { mode, breathRate };

    console.log('new record', newRecord);
    firebase.database().ref(petPath).child('breathRecord').update(newRecord)
      .then(() => {
        console.log('set new breath ok');
      })
      .catch((error) => {
        console.log('add new record failed,', error);
      });
  };
}

export function updateInfo(petID, info) {
  return () => {
    const petPath = `pets/${petID}`;

    console.log('new info', info);
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

    console.log('delete record', recordPath);
    firebase.database().ref(recordPath).remove()
      .then(() => {
        console.log('delete breath ok');
      })
      .catch((error) => {
        console.log('delete record failed,', error);
      });
  };
}
