import * as firebase from 'firebase';
import Mailer from 'react-native-mail';
import { Alert, Platform } from 'react-native';

import I18n from '../i18n/i18n';

const RNFS = require('react-native-fs');
const moment = require('moment');

const OWNER_DATA = 'OWNER_DATA';
const UPDATE_PET_INFO = 'UPDATE_PET_INFO';
const REMOVE_PET = 'REMOVE_PET';

export const ActionTypes = {
  OWNER_DATA,
  UPDATE_PET_INFO,
  REMOVE_PET,
};

/**
 * @param  {string} mode 0(rest) or 1(sleep)
 */
function newBreathRecord(petID, breathRate, mode, recordTime) {
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

function updatePetInfo(petID, info) {
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

function deleteBreathRecord(petID, recordTime) {
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

function exportRecords() {
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

function addNewPet(name, age) {
  return (dispatch, getState) => {
    const state = getState();

    const newPetRef = firebase.database().ref('pets').push();
    const newPetId = newPetRef.key;
    console.log('newPet:', newPetId);

    newPetRef.set({
      name,
      age,
      owners: [firebase.auth().currentUser.uid],
    })
      .then(() => {
        console.log('add new pet succeeded');

        const userPath = `/users/${firebase.auth().currentUser.uid}`;
        let petIDList = [];
        if (state.currentUser.petIDList) {
          petIDList = state.currentUser.petIDList.slice(0);
        }
        addPetToUserFireBaseData(petIDList, newPetId, userPath, getState)
          .then(() => {
            console.log('add new pet\'s id to user\'s petIDList ok');
          });
      })
      .catch((error) => {
        console.log('add pet failed:', error);
      });
  };
}

function removePetFromUserFields(petIDList, petID, ownerPath) {
  const index = petIDList.indexOf(petID);
  if (index === -1) {
    console.log("can not find petid in self's petIDList");

    return;
  }
  petIDList.splice(index, 1);

  firebase.database().ref(ownerPath).child('petIDList').set(petIDList)
    .then(() => {
      console.log('reset petIDList (remove) ok !!!:');
    })
    .catch((error) => {
      console.log('reset petIDList (remove) failed:', error);
    });
}

function removeSelfFromPetOwners(petID) {
  return (dispatch, getState) => {
    const state = getState();

    // step1: update pet's owners,
    // a: if self is the only one owner, completely delete pet info.
    // b: just remove self from pet's owners
    const owners = state.pets[petID].owners.slice(0);

    const index = owners.indexOf(firebase.auth().currentUser.uid);
    if (index === -1) {
      console.log("can not find self in pet's owners");

      return;
    }
    owners.splice(index, 1);

    const petPath = `pets/${petID}`;

    if (owners.length > 0) {
      // case 1-a

      firebase.database().ref(petPath).child('owners').set(owners)
        .then(() => {
          console.log("update pet's owner ok");
          // step2: update user's petIDList

          const userPath = `/users/${firebase.auth().currentUser.uid}`;
          const petIDList = state.currentUser.petIDList.slice(0);
          removePetFromUserFields(petIDList, petID, userPath);
        })
        .catch((error) => {
          console.log('update pet owner failed:', error);
        });
    } else {
      // case 1-b: will trigger a UPDATE_PET_INFO but value is null
      firebase.database().ref(petPath).remove()
        .then(() => {
          console.log('remove pet ok');
          // step2: update user's petIDList

          const userPath = `/users/${firebase.auth().currentUser.uid}`;
          const petIDList = state.currentUser.petIDList.slice(0);
          removePetFromUserFields(petIDList, petID, userPath);
        })
        .catch((error) => {
          console.log('remove pet fail:', error);
        });
    }
  };
}

function addPetToUserFireBaseData(petIDList, newPetId, ownerPath) {
  petIDList.push(newPetId);

  return firebase.database().ref(ownerPath).child('petIDList').set(petIDList)
    .then(() => {
      console.log('add pet to petIDList ok !!!');
    })
    .catch((error) => {
      console.log('add pet to petIDList failed:', error);
    });
}

/**
 * two steps: 1. add owners to pet's property
 * 2. add pet to owner's petIDList property
 */
function addNewOwner(petID, ownerKID) {
  return (dispatch, getState) => {
    if (!ownerKID || ownerKID === '') {
      console.log('invalid ownerKID:', ownerKID);
      return;
    }

    const query = firebase.database().ref().child('users').orderByChild('KID')
      .equalTo(ownerKID);
    query.once('value', (snapshot) => {
      const matchIDs = snapshot.val();
      if (matchIDs) {
        const matchIDKeys = Object.keys(matchIDs); // or use snapshot.foreach
        const matchID = matchIDKeys[0];

        console.log('get matched KID:', matchID);

        const state = getState();

        const owners = state.pets[petID].owners.slice(0);
        if (owners.indexOf(matchID) > -1) {
          console.log('that user is already authorized yet, not add again');
          return;
        }
        owners.push(matchID);

        const petPath = `pets/${petID}`;

        firebase.database().ref(petPath).child('owners').set(owners)
          .then(() => {
            console.log('add ownerID into pet\'s owners ok !!!');

            const userPath = `users/${matchID}`;
            firebase.database().ref(userPath).child('petIDList').once('value', (snapshot) => {
              const data = snapshot.val();

              let petIDList = [];
              if (data) {
                petIDList = data;
              }

              // TODO avoid duplipete petid in petIDList
              addPetToUserFireBaseData(petIDList, petID, userPath);
            });
          });
      }
    });
  };
}

function getOwnerData(userID, userInfo) {
  return {
    type: OWNER_DATA,
    payload: {
      userID,
      userInfo,
    },
  };
}

function fetchOwnerData(pet) {
  return (dispatch, getState) => {
    if (!pet.owners || pet.owners.length === 0) {
      return;
    }

    const state = getState();
    const selfID = firebase.auth().currentUser.uid;
    for (const ownerID of pet.owners) {
      if (ownerID !== selfID) {
        if (!state.users[ownerID]) {
          console.log('fetch owner data:', ownerID);
          const userPath = `users/${ownerID}`;
          firebase.database().ref(userPath).once('value', (snapshot) => {
            const data = snapshot.val();

            dispatch(getOwnerData(ownerID, data));
          })
            .catch((error) => {
              console.log('fetch owner failed:', error);
            });
        }
      }
    }
  };
}

function removePet(petID) {
  return {
    type: REMOVE_PET,
    payload: {
      petID,
    },
  };
}

function getPetInfo(petID, petInfo) {
  return {
    type: UPDATE_PET_INFO,
    payload: {
      petID,
      petInfo,
    },
  };
}

function liveQueryPetInfo(petID) {
  return (dispatch) => {
    firebase.database().ref('pets').child(petID).on('value', (snapshot) => {
      const petInfo = snapshot.val();

      dispatch(getPetInfo(petID, petInfo));
    });
  };
}

function stopLiveQueryPetInfo(petID) {
  return () => {
    // ref: https://stackoverflow.com/a/28266537/7354486
    // ref: https://stackoverflow.com/questions/11804424/deactivating-events-with-off indipetes that
    // off('value') w/o callback seems ok too.
    firebase.database().ref('pets').child(petID).off();
  };
}

function updatePetsFromNewPetList(userValue) {
  return (dispatch, getState) => {
    let petIDList = [];
    let petIDList_copy = [];
    let oldPetIDList_copy = [];

    if (userValue && userValue.petIDList) {
      petIDList = userValue.petIDList.slice(0);
      petIDList_copy = userValue.petIDList.slice(0);
    }

    const state = getState();
    if (state.currentUser.petIDList) {
      const oldPetIDList = state.currentUser.petIDList;

      for (const id of oldPetIDList) {
        const index = petIDList.indexOf(id);
        if (index !== -1) {
          petIDList.splice(index, 1);
        }
      }

      oldPetIDList_copy = oldPetIDList.slice(0);
      for (const id of petIDList_copy) {
        const index = oldPetIDList_copy.indexOf(id);
        if (index !== -1) {
          oldPetIDList_copy.splice(index, 1);
        }
      }
    }

    // case: add pet to petIDList
    for (const id of petIDList) {
      dispatch(liveQueryPetInfo(id));
    }

    // case: remove pet from petIDList
    for (const id of oldPetIDList_copy) {
      console.log('stopquery and remove pet:', id);
      dispatch(stopLiveQueryPetInfo(id));
      dispatch(removePet(id));
    }
  };
}

const actions = {
  removeSelfFromPetOwners,
  addNewPet,
  addNewOwner,
  fetchOwnerData,
  updatePetsFromNewPetList,
  updatePetInfo,
  deleteBreathRecord,
  newBreathRecord,
  exportRecords,
};

export default actions;
