const functions = require('firebase-functions');
const admin = require('firebase-admin');
const brain = require("brain.js")

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

var learnCategories = async function (userId) {
  const config = {
    iterations: 500,
    log: true,
    logPeriod: 100,
    layers: [10],
    errorThresh: 0.00005,
  };

  let ref = `/users/${userId}/expenses/`;
  ref = firestore.collection(ref);
  var trainingData = []

  let querySnapshot = await ref
    .where("categoryId", ">=", "")
    .limit(200)
    .get()

  querySnapshot.forEach(function (doc) {
    const data = doc.data()
    trainingData.push({ input: data.expenseName, output: data.categoryId })
  });

  const network = new brain.recurrent.LSTM();
  network.train(trainingData, config)
  return network
}

exports.autoCategoriseExpense = functions.firestore.document('/users/{uid}/expenses/{expenseId}')
  .onCreate((snap, context) => {
    console.log("UID :", context.params.uid)
    const original = snap.data();
    console.log("DATA : ", original)

    learnCategories(context.params.uid).then(network => {
      console.log(network)
    })
    return true
    // return snap.ref.set({ uppercase }, { merge: true });
  });

// exports.addMessage = functions.https.onRequest(async (req, res) => {
//   const original = req.query.text;
//   const writeResult = await admin.firestore().collection('messages').add({original: original});
//   res.json({result: `Message with ID: ${writeResult.id} added.`});
// });