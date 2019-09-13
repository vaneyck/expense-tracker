const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { WebhookClient } = require('dialogflow-fulfillment');
const { Card, Suggestion } = require('dialogflow-fulfillment');

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
 * @param {*} data 
 */
var storeExpense = function (data) {
    let ref = `/users/${data.uid}/expenses/`;
    firestore.collection(ref)
        .doc(this.expenseId)
        .set(data.expenseData)
        .then(saveSuccessFullHanlder);
}

var saveSuccessFullHanlder = function (data) {
    console.log("Saved", data);
}
// exports.recordExpense = functions.https.onRequest((request, response) => {
//     var input = request.body;
//     storeExpense(input);
//     response.send("Expense Recorded");
// });

//=========

// See https://github.com/dialogflow/dialogflow-fulfillment-nodejs
// for Dialogflow fulfillment library docs, samples, and to report issues
// TODO Remove use-strict
// 'use strict';

process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements

const {dialogflow, SignIn} = require('actions-on-google');
const app = dialogflow({
  clientId: "211067149885-l8hkoltdoc1ch0615l239m1vdj11ir2k.apps.googleusercontent.com",
});

exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
    const agent = new WebhookClient({ request, response });
    console.log('Dialogflow Request headers: ', request.headers);
    console.log('Dialogflow Request body: ', request.body);

    function yourFunctionHandler(agent) {
        var messageToReplyWith = request.body.queryResult.fulfillmentText;

        var user = JSON.stringify(request.body.originalDetectIntentRequest.payload.user);
        console.log("User is : ", user);

        // This is the user information
        var x = {
            "locale": "en-GB",
            "lastSeen": "2019-08-07T13:34:44Z",
            "idToken": "eyJhbGciOiJSUzI1NiIsImtpZCI6",
            "userVerificationStatus": "VERIFIED"
        };

        agent.add(messageToReplyWith);
        // agent.add(new Card({
        //     title: `Recorded Expense`,
        //     //imageUrl: 'https://developers.google.com/actions/images/badges/XPM_BADGING_GoogleAssistant_VER.png',
        //     text: `${messageToReplyWith}`,
        //     buttonText: 'Edit Expense',
        //     buttonUrl: 'https://assistant.google.com/'
        // }));

        //agent.add(new Suggestion(`Quick Reply`));
        //agent.add(new Suggestion(`Suggestion`));
        //agent.setContext({ name: 'weather', lifespan: 2, parameters: { city: 'Rome' }});
    }

    // Uncomment and edit to make your own Google Assistant intent handler
    // uncomment `intentMap.set('your intent name here', googleAssistantHandler);`
    // below to get this function to be run when a Dialogflow intent is matched
    function googleAssistantHandler(agent) {
        let conv = agent.conv();
        conv.ask(new SignIn('To get your account details'));
        // Get Actions on Google library conv instance
        //conv.ask('Hello from the Actions on Google client library!') // Use Actions on Google library
        //agent.add(conv); // Add Actions on Google library responses to your agent's response
    }
    // See https://github.com/dialogflow/dialogflow-fulfillment-nodejs/tree/master/samples/actions-on-google
    // for a complete Dialogflow fulfillment library Actions on Google client library v2 integration sample

    function handleSignin(conv, params, signin) {
      if (signin.status === 'OK') {
        const payload = conv.user.profile.payload;
        conv.ask(`I got your account details, ${payload.name}. What do you want to do next?`);
      } else {
        conv.ask(`I won't be able to save your data, but what do you want to do next?`);
      }
    }

    // Run the proper function handler based on the matched Dialogflow intent name
    let intentMap = new Map();

    intentMap.set('Record Expense', yourFunctionHandler);
    intentMap.set('actions.intent.SIGN_IN', googleAssistantHandler);
    intentMap.set('ask_for_sign_in_confirmation', handleSignin);

    agent.handleRequest(intentMap);
});


// TODO Get Login here
// https://developers.google.com/actions/identity/google-sign-in
// https://developers.google.com/actions/assistant/helpers#account_sign-in