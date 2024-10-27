<script setup>
const props = defineProps({
  jobs: Array,
  enlargeAside: Boolean
})

const emit = defineEmits(['job_select'])

// guess favicon url (https://example.com/xyz/... => https://example.com/favicon.ico)
function getFavicon(url) {
  if(!url) return '#'
  // search for first '/' after '//'
  let offset = 0
  let shortUrl = url
  if (url.indexOf('http') == 0) {
    if (url[4] == 's') { // https
      shortUrl = url.slice(8)
      offset = 8
    } else { // http
      shortUrl = url.slice(7)
      offset = 7
    }
  }
  const slashIndex = shortUrl.indexOf('/')
  if (slashIndex == -1) {
    return url + '/favicon.ico'
  }
  return url.slice(0, offset + slashIndex) + '/favicon.ico'
}

// convert date to mm/dd/yy
function shortenDate(dateStr){
  if(!dateStr) return ""
  const y = dateStr[2] + dateStr[3]
  const m = dateStr[5] + dateStr[6]
  const d = dateStr[8] + dateStr[9]
  return `${m}/${d}/${y}`
}
</script>

<template>
  <div id="table-wrapper">
    <table v-if="jobs.length">
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
          <td>{{ shortenDate(job['date']) }}</td>
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