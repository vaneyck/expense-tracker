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

    // Compute Daily Usage
    var dailyUsage = new Map();
    for (var x = 0; x < expenses.length; x++) {
      const singleExpense = expenses[x];
      var dateAsString = moment(singleExpense.dateCreated._seconds * 1000).format("MM/DD/YYYY");

      if (dailyUsage.get(dateAsString) == null) {
        dailyUsage.set(dateAsString, singleExpense.expenseCost);
      } else {
        dailyUsage.set(dateAsString, (dailyUsage.get(dateAsString) + singleExpense.expenseCost));
      }
    }

    // Template Graph
    var singleGraph = {
      title: "",
      chart_type: "BAR_CHART",
      x: [],
      y: []
    }

    let clone = Object.assign({}, singleGraph);
    clone.title = "Daily Usage";
    clone.chart_type = "BAR_CHART";
    clone.x = Array.from(dailyUsage.keys());
    clone.y = Array.from(dailyUsage.values());

    res.json([clone]);
  });