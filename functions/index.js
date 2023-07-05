const { onRequest } = require("firebase-functions/v2/https");
const { logger } = require("firebase-functions");
const { initializeApp } = require("firebase-admin/app");
const { getFirestore, Timestamp } = require("firebase-admin/firestore");
const { getAuth } = require("firebase-admin/auth");
const moment = require("moment");
const cors = require('cors')({origin: true});

initializeApp();

async function doStuff(req, res) {
  const uuid = req.query.uuid;
  // Expecting dates in the format MM/dd/yyyy i.e. 08/01/2023
  const lowerLimit = req.query.lower_limit;
  const upperLimit = req.query.upper_limit;

  const rawExpenses = await getFirestore()
    .collection('users')
    .doc(uuid)
    .collection("expenses")
    .where("dateCreated", ">=", new Date(lowerLimit))
    .where("dateCreated", "<", new Date(upperLimit))
    .get();

  const rawCategories = await getFirestore()
    .collection('users')
    .doc(uuid)
    .collection("categories")
    .get();

  const categories = rawCategories.docs.map(doc => {
    var map = doc.data();
    map["id"] = doc.id;
    return map;
  });

  const expenses = rawExpenses.docs.map(doc => {
    var map = doc.data();
    map["id"] = doc.id;
    return map;
  });


  var dailyUsage = new Map();
  var dailyFrequency = new Map();
  var transactionChargesFrequency = new Map();
  
  var totalUsage = 0;
  var totalBudget = 0;
  var totalTransactonCharges = 0;

  for (var x = 0; x < expenses.length; x++) {
    // Calculate usage per day
    const singleExpense = expenses[x];

    var fullYearFormat = "MM/DD/YYYY";
    var dayFormat = "MM/DD";

    var dateAsString = moment(singleExpense.dateCreated._seconds * 1000).format(dayFormat);
    if (dailyUsage.get(dateAsString) == null) {
      dailyUsage.set(dateAsString, singleExpense.expenseCost);
    } else {
      dailyUsage.set(dateAsString, (dailyUsage.get(dateAsString) + singleExpense.expenseCost));
    }

    // Calculate daily frequency
    if (dailyFrequency.get(dateAsString) == null) {
      dailyFrequency.set(dateAsString, 1);
    } else {
      dailyFrequency.set(dateAsString, (dailyFrequency.get(dateAsString) + 1));
    }

    let transactionCost = 0;
    if (singleExpense.mpesaTransactionCost != null) {
      transactionCost = parseFloat(singleExpense.mpesaTransactionCost);
    }

    // Transaction Charges
    if (transactionChargesFrequency.get(dateAsString) == null) {
      transactionChargesFrequency.set(dateAsString, transactionCost);
    } else {
      transactionChargesFrequency.set(dateAsString, (transactionChargesFrequency.get(dateAsString) + transactionCost));
    }

    // Calculate total usage
    totalUsage += singleExpense.expenseCost;
    totalTransactonCharges += transactionCost;
  }

  for (var x = 0; x < categories.length; x++) {
    const singleCategory = categories[x];
    totalBudget += parseFloat(singleCategory.budgetedAmount);
  }

  // Template Graph
  var singleGraph = {
    title: "",
    chart_type: "VERTICAL_BAR_CHART",
    x: [],
    y: []
  }

  let dailyUsageChart = Object.assign({}, singleGraph);
  dailyUsageChart.title = "Daily Usage";
  dailyUsageChart.chart_type = "VERTICAL_BAR_CHART";
  dailyUsageChart.x = Array.from(dailyUsage.keys());
  dailyUsageChart.y = Array.from(dailyUsage.values());

  let totalUsageChart = Object.assign({}, singleGraph);
  totalUsageChart.title = "Usage vs Bugdet"
  totalUsageChart.chart_type = "VERTICAL_BAR_CHART";
  totalUsageChart.x = ["Usage", "Budget"];
  totalUsageChart.y = [totalUsage, totalBudget];

  let transactionChart = Object.assign({}, singleGraph);
  transactionChart.title = "Transaction Charges"
  transactionChart.chart_type = "SINGLE_VALUE";
  transactionChart.x = ["Transaction Charges",];
  transactionChart.y = [totalTransactonCharges];

  let dailyFrequencyChart = Object.assign({}, singleGraph);
  dailyFrequencyChart.title = "No. of Transactions Daily";
  dailyFrequencyChart.chart_type = "VERTICAL_BAR_CHART";
  dailyFrequencyChart.x = Array.from(dailyFrequency.keys());
  dailyFrequencyChart.y = Array.from(dailyFrequency.values());

  let transactionChargesChart = Object.assign({}, singleGraph);
  transactionChargesChart.title = "Transaction Costs Daily";
  transactionChargesChart.chart_type = "VERTICAL_BAR_CHART";
  transactionChargesChart.x = Array.from(transactionChargesFrequency.keys());
  transactionChargesChart.y = Array.from(transactionChargesFrequency.values());

  res.json([transactionChart, dailyUsageChart, transactionChargesChart, totalUsageChart, dailyFrequencyChart]);
}

exports.getStatistics = onRequest(
  async (req, res) => {
    cors(req, res, () => {
      doStuff(req, res);
    });
  });

exports.disableAccount = onRequest(
    async (req, res) => {
      cors(req, res, () => {
        const uuid = req.query.uuid;
        getAuth().updateUser(uuid, {
          disabled: true
        })
        res.json({'message': 'Account Disabled'});
      });
    });