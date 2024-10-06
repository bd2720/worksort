<script setup>
  import { ref, computed } from 'vue'
  // JSON array of job objects
  const jobs = ref([])

  const nextID = ref(0)

  // input variables
  const tempTitle = ref("")
  const tempCompany = ref("")
  const tempDate = ref("")
  const tempURL = ref("")

  // show input fields if addJobs
  const showInputs = computed(() => {
    return addingJobs.value
  })

  const addingJobs = ref(false)
  function startNewJob(){
    addingJobs.value = true
  }

  const deletingJobs = ref(false)
  function startDeleteJob(){
    deletingJobs.value = true
  }

  // computes which jobs are currently displayed
  const jobsDisplayed = computed(() => {
    return jobs.value
  })

  // add filled-out job object to jobs
  function finalizeNewJob(){
    // add new job object
    jobs.value.push({
      id: nextID.value++,
      title: tempTitle.value,
      company: tempCompany.value,
      date: tempDate.value,
      url: tempURL.value,
    })
    // no longer adding jobs
    addingJobs.value = false
    // clear input fields
    tempTitle.value = ""
    tempCompany.value = ""
    tempDate.value = ""
    tempURL.value = ""
  }

  function abortNewJob(){
    addingJobs.value = false
  }

  function finalizeDeleteJob(jobID){
    // remove job with matching ID
    jobs.value = jobs.value.filter((job) => job['id'] != jobID)
    // no longer deleting jobs
    deletingJobs.value = false
  }

  // guess favicon url (https://example.com/xyz/... => https://example.com/favicon.ico)
  function getFavicon(url){
    // search for first '/' after '//'
    let offset = 0
    let shortUrl = url
    if(url.indexOf('http') == 0){
      if(url[4] == 's'){ // https
        shortUrl = url.slice(8)
        offset = 8
      } else { // http
        shortUrl = url.slice(7)
        offset = 7
      }
    }
    const slashIndex = shortUrl.indexOf('/')
    if(slashIndex == -1){
      return url + '/favicon.ico'
    }
    return url.slice(0, offset + slashIndex) + '/favicon.ico'
  }

</script>

<template>
  <header>
    <h1>WorkSort</h1>
    <h2>Organize your job applications</h2>
  </header>
  <aside>
    <button @click="startNewJob()" v-if="!addingJobs">New Job</button>
    <button @click="startDeleteJob()" v-if="!deletingJobs">Delete Job</button>
    <button @click="finalizeDeleteJob()" v-if="deletingJobs">Done</button>
    <form v-if="showInputs">
      <input v-model="tempTitle" placeholder="Title">
      <input v-model="tempCompany" placeholder="Company">
      <input type="date" v-model="tempDate" placeholder="Date Applied">
      <input type="url" v-model="tempURL" placeholder="Link">
      <button @click="finalizeNewJob()">Add Job</button>
      <button @click="abortNewJob()">Cancel</button>
    </form>
  </aside>
  <main>
    <table>
      <thead>
        <tr>
          <th>(Icon)</th>
          <th>Title</th>
          <th>Company</th>
          <th>Date Applied</th>
          <th>Link</th>
          <th v-if="deletingJobs">Delete</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="job in jobsDisplayed">
          <td>{{ job['id'] }}</td>
          <td><img alt="" :src="getFavicon(job['url'])" height="16px" width="16px"></td>
          <td>{{ job['title'] }}</td>
          <td>{{ job['company'] }}</td>
          <td>{{ job['date'] }}</td>
          <td><a :href="job['url']">Visit</a></td>
          <td v-if="deletingJobs"><button @click="finalizeDeleteJob(job['id'])">X</button></td>
        </tr>
      </tbody>
    </table>
  </main>
</template>

<style scoped>

</style>
