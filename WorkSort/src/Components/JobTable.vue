<script setup>
import { db_query } from '../dbUtil'
import { dateToShortStr, getFavicon } from '../util'

const props = defineProps({
  enlargeAside: Boolean
})

const emit = defineEmits(['job_select'])
// table of jobs, reactive from Dexie's liveQuery()
const jobs = db_query()
</script>

<template>
  <div id="table-wrapper">
    <table v-if="jobs && jobs.length">
      <thead>
        <tr>
          <th></th>
          <th>Title</th>
          <th>Company</th>
          <th>Date</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="job in jobs">
          <td>
            <img alt="-----" :src="getFavicon(job['url'])" height="32px" width="32px">
          </td>
          <td>{{ job['title'] }}</td>
          <td>{{ job['company'] }}</td>
          <td>{{ dateToShortStr(job['date']) }}</td>
          <td>
            <!-- disable view buttons if the aside is in focus -->
            <button @click="emit('job_select', job)" :disabled="enlargeAside">View</button>
          </td>
        </tr>
      </tbody>
    </table>
    <p v-else>
      You haven't added any jobs yet. Click <strong>New Job</strong> to start organizing!
    </p>
  </div>
</template>

<style scoped>
#table-wrapper {
  --table-col: #e7e7e7;
  --table-head-col: #c7c7c7;
  --table-alt-col: #d7d7d7;

  display: flex;
  justify-content: center;
  width: calc(100% - 60px);
  margin: 20px;
  background: var(--table-col);
  padding: 8px;
  border: 2px solid var(--border-col);
}

p {
  font-size: 24px;
}

table {
  width: 100%;
}

thead {
  transform: translateY(2px);
}

tr {
  display: grid;
  grid-template-columns: 54px 1fr 1fr 82px 46px;
  height: 50px;
  vertical-align: bottom;
}

th, td {
  border: 1px solid var(--border-col);
  padding: 12px 0 0 6px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

td:first-child {
  padding: 8px 0 0 0;
  text-align: center;
}

th {
  font-size: 140%;
  background: var(--table-head-col);
}

td {
  font-size: 120%;
}

th:nth-child(1), th:nth-child(5), th:nth-child(6) {
  background: none;
  border: none;
}

tr:nth-child(even) {
  background: var(--table-alt-col);
}

@media(width <=720px) {
  /* hide icon */
  tr {
    grid-template-columns: 1fr 1fr 82px 46px;
  }

  th:first-child, td:first-child {
    display: none;
  }
}
</style>