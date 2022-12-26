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
                <button :disabled="{'disabled' : createExpenseModel.savingExpense}">Save Expense</button>
            </div>
            <ul>
                <li v-for="(expense, index) in expenses" :key="index">
                    {{ expense.expense_description }} // {{ expense.expense_currency }} {{ expense.expense_ammount }}
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
                    console.log(response.data.data.accounts);
                    this.accounts = response.data.data.accounts;
                });
        },
        createDefaultExpenseAccount: function () {
            let baseUrl = 'http://localhost:8080';
            getAxios(baseUrl, this.authToken)
                .post('/v1/accounts', {
                })
                .then((response) => {
                    console.log(response.data.data.accounts);
                    this.accounts = response.data.data.accounts;
                });
        },
        pullExpenses: function () {
            let baseUrl = 'http://localhost:8080';
            getAxios(baseUrl, this.authToken)
                .get(this.getAccountBaseUrl(this.selectedAccoundId) + '/expenses')
                .then((response) => {
                    console.log(response.data.data.expenses);
                    this.accounts = response.data.data.expenses;
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