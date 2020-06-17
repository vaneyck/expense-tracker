const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();
const firestore = admin.firestore();

/**
 * data should be of the form
{
    uid: "someid",
    expenseData: {
        expenseName: "ASD",
        expenseCost: 345,
        dateCreated: new Date(),
        categoryId: null
      }
}
 */

exports.autoCategoriseExpense = functions.firestore.document('/users/{uid}/expenses/{expenseId}')
  .onCreate((snap, context) => {
    console.log("UID :", context.params.uid)
    const original = snap.data();
    console.log("DATA : ", original)
    return true
    // return snap.ref.set({ uppercase }, { merge: true });
  });

// exports.addMessage = functions.https.onRequest(async (req, res) => {
//   const original = req.query.text;
//   const writeResult = await admin.firestore().collection('messages').add({original: original});
//   res.json({result: `Message with ID: ${writeResult.id} added.`});
// });