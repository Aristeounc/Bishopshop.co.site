const noop = () => {};
const noopPromise = () => Promise.resolve();
const noopObj = new Proxy({}, { get: () => noopPromise });

const firestore = () => noopObj;
firestore.FieldValue = { serverTimestamp: () => new Date().toISOString() };
firestore.Timestamp = { now: () => ({ toDate: () => new Date() }) };

const auth = () => ({
  signInWithEmailAndPassword: noopPromise,
  createUserWithEmailAndPassword: noopPromise,
  sendPasswordResetEmail: noopPromise,
  signOut: noopPromise,
  onAuthStateChanged: (cb) => { cb(null); return noop; },
  currentUser: null,
});

const messaging = () => ({
  getToken: () => Promise.resolve('mock-token'),
  onMessage: () => noop,
  onTokenRefresh: () => noop,
  requestPermission: noopPromise,
  subscribeToTopic: noopPromise,
  unsubscribeFromTopic: noopPromise,
  hasPermission: () => Promise.resolve(true),
});

const analytics = () => ({
  logEvent: noop,
  logScreenView: noop,
  setUserProperties: noop,
  setUserId: noop,
});

module.exports = noop;
module.exports.default = noop;
module.exports.firebase = { app: noop, firestore, auth, messaging, analytics };
module.exports.firestore = firestore;
module.exports.auth = auth;
module.exports.messaging = messaging;
module.exports.analytics = analytics;
