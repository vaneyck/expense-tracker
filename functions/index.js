const { onRequest } = require("firebase-functions/v2/https");
const { logger } = require("firebase-functions");
const { initializeApp } = require("firebase-admin/app");
const { getFirestore, Timestamp } = require("firebase-admin/firestore");
const moment = require("moment");

initializeApp();

exports.getStatistics = onRequest(
  async (req, res) => {
    const uuid = req.query.uuid;
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
    
    var totalUsage = 0;
    var totalBudget = 0;

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

      // Calculate total usage
      totalUsage += singleExpense.expenseCost;
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

    let dailyFrequencyChart = Object.assign({}, singleGraph);
    dailyFrequencyChart.title = "No. of Transactions Per Day";
    dailyFrequencyChart.chart_type = "VERTICAL_BAR_CHART";
    dailyFrequencyChart.x = Array.from(dailyFrequency.keys());
    dailyFrequencyChart.y = Array.from(dailyFrequency.values());

    res.json([dailyUsageChart, totalUsageChart, dailyFrequencyChart]);
  });