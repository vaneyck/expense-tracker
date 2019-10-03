<template>
    <div>
        <EditExpense :expenseId="expenseId" />
    </div>
</template>

<script>
import EditExpense from '@/components/EditExpense';

export default {
    props: ['expenseId'],
    components: {
        EditExpense
    }
}
</script>