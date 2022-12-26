<template>
    <div class="main-content">
        <h1>Home</h1>
        <div v-if="!hasAtLeastOneAccount">
            <button @click="createDefaultExpenseAccount">Create Expense Account</button>
        </div>
        <div v-if="hasAtLeastOneAccount">
            <ol>
                <li v-for="(account, index) in accounts" :key="index">
                    <span>{{ account.account_name }} // {{ account.account_uuid }}</span>
                    <button @click="chooseAccount(account.account_uuid)">Select Account</button>
                </li>
            </ol>
        </div>
        <div v-if="selectedAccoundId">
            <h1>Expenses</h1>
            <div class="create-expense">
                <b-field label="Expense Description">
                    <b-input type="text" v-model="createExpenseModel.expenseDescription" placeholder="Your Expense" required></b-input>
                </b-field>
                <b-field label="Expense Amount">
                    {{ createExpenseModel.expenseCurrency }} : <b-input type="number" v-model="createExpenseModel.expenseAmount" placeholder="How much did you spend?" required></b-input>
                </b-field>
                <button @click="saveNewExpense">Save Expense</button>
            </div>
            <ul>
                <li v-for="(expense, index) in expenses" :key="index">
                    {{ expense.created_date }} // {{ expense.expense_description }} // {{ expense.expense_currency }} {{ expense.expense_amount }}
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import { store } from '@/store'
import { getAxios } from '@/network'

export default {
    data() {
        return {
            accounts: [],
            expenses: [],
            createExpenseModel: {
                savingExpense: false,
                expenseDescription: null,
                expenseCurrency: 'KES',
                expenseAmount: null,
            },
            selectedAccoundId: null
        };
    },
    mounted() {
        this.pullAccounts();
    },
    computed: {
        authToken: function () {
            return store.getters.getToken;
        },
        hasAtLeastOneAccount: function () {
            return (this.accounts.length > 0);
        }
    },
    methods: {
        pullAccounts: function () {
            let baseUrl = 'http://localhost:8080';
            getAxios(baseUrl, this.authToken)
                .get('/v1/accounts')
                .then((response) => {
                    console.log(response.data);
                    this.accounts = response.data.data.accounts;
                });
        },
        createDefaultExpenseAccount: function () {
            let baseUrl = 'http://localhost:8080';
            getAxios(baseUrl, this.authToken)
                .post('/v1/accounts', {
                })
                .then((response) => {
                    console.log(response.data);
                    this.accounts = response.data.data.accounts;
                });
        },
        pullExpenses: function () {
            let baseUrl = 'http://localhost:8080';
            getAxios(baseUrl, this.authToken)
                .get(this.getAccountBaseUrl(this.selectedAccoundId) + '/expenses')
                .then((response) => {
                    console.log(response.data);
                    this.expenses = response.data.data.expenses;
                });
        },
        saveNewExpense: function () {
            let baseUrl = 'http://localhost:8080';
            let createExpensePayload = {
                "expense_description": this.createExpenseModel.expenseDescription,
                "expense_amount": this.createExpenseModel.expenseAmount,
                "expense_currency": this.createExpenseModel.expenseCurrency,
            };

            getAxios(baseUrl, this.authToken)
                .post(this.getAccountBaseUrl(this.selectedAccoundId) + '/expenses', createExpensePayload)
                .then((response) => {
                    console.log(response.data);
                    this.pullExpenses();
                    // Reset create object
                    this.createExpenseModel.expenseDescription = "";
                    this.createExpenseModel.expenseAmount = 0;
                });
        },
        getAccountBaseUrl: function (accountUuid) {
            return `/v1/account/${accountUuid}`
        },
        chooseAccount: function (accountUuid) {
            this.selectedAccoundId = accountUuid;
            this.pullExpenses();
        }
    }
}
</script>