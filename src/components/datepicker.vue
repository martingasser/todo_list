<template>
<div class="date-picker">
    <select class="custom-select" @change="editValue('months', $event)" ref="month">
        <option v-for='(month, index) in months' :value="index" :key='month'>
            {{ month }}
        </option>
    </select>
    <select class="custom-select" @change="editValue('date', $event)" ref="date">
        <option v-for="i in daysInMonth" :key="i" :value="i">
            {{ i }}
        </option>
    </select>
    <select class="custom-select" @change="editValue('year', $event)" ref="year">
        <option v-for="i in numberOfYears" :key="i" :value="startingYear + (i - 1)">
            {{ startingYear + (i - 1)}}
        </option>
    </select>
    <button class="reset-button" @click="today">T</button>
</div>
</template>

<script>
import {ref, onMounted} from 'vue'

import moment from 'moment'

export default {
    setup (props, context) {
        const dateValue = moment()
        const daysInMonth = ref(dateValue.daysInMonth())

        const month = ref(null)
        const date = ref(null)
        const year = ref(null)

        const updateElements = () => {
            month.value.value = dateValue.month()
            date.value.value = dateValue.date()
            year.value.value = dateValue.format('YYYY')
            context.emit('update', dateValue)
        }

        const editValue = (unit, evt) => {
            dateValue.set(unit, evt.target.value)
            daysInMonth.value = dateValue.daysInMonth()
            updateElements()
        }

        const today = () => {
            const now = moment()
            dateValue.year(now.year())
            dateValue.month(now.month())
            dateValue.date(now.date())
            updateElements()
        }

        onMounted(() => {
            updateElements()
        })

        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
        const startingYear = 2010
        const numberOfYears = 20

        return {
            month,
            date,
            year,
            editValue,
            daysInMonth,
            today,
            months,
            numberOfYears,
            startingYear
        }
    }
}
</script>

<style scoped>
.date-picker {
    display: flex;
    margin-left: 10px;
    margin-right: 10px;
}

.custom-select {
    background-color: #eee;
    float: left;
    position: relative;
    border: none;
    color: #333;
    display: block;
    font-size: 16px;
    height: 32px;
    padding: 5px 30px 5px 10px;
    outline: none;
    margin-right: 5px;
}

.reset-button {
    background-color: red;
    border: none;
    outline: none;
}

.custom-select:after {
    content: '\25bc';
    color: #aaa;
    font-size: 12px;
    position: absolute;
    right: 8px;
    top: 10px;
}
</style>