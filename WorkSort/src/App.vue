<script setup>
  import { ref, computed } from 'vue'
  // JSON array of job objects
  const jobs = ref([])

  // input variables
  const tempTitle = ref("")
  const tempCompany = ref("")
  const tempDate = ref("")
  const tempURL = ref("")

  // whether input fields are visible (true when inputting new job)
  const showInputs = ref(false)

  // enable dummy job for input
  function startNewJob(){
    showInputs.value = true
  }

  // computes which jobs are currently displayed
  const jobsDisplayed = computed(() => {
    return jobs.value
  })

  // add filled-out job object to jobs
  function finalizeJob(){
    // add new job object
    jobs.value.push({
      title: tempTitle.value,
      company: tempCompany.value,
      date: tempDate.value,
      url: tempURL.value,
    })
    // hide input fields
    showInputs.value = false
    // clear input fields
    tempTitle.value = ""
    tempCompany.value = ""
    tempDate.value = ""
    tempURL.value = ""
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
    <button @click="startNewJob()" v-if="!showInputs">New Job</button>
    <form v-else>
      <input v-model="tempTitle" placeholder="Title">
      <input v-model="tempCompany" placeholder="Company">
      <input type="date" v-model="tempDate" placeholder="Date Applied">
      <input type="url" v-model="tempURL" placeholder="Link">
      <button @click="finalizeJob()">Add Job</button>
    </form>
  </aside>
  <main>
    <ul>
      <li v-for="job in jobsDisplayed">
        <img :src="getFavicon(job['url'])" height="32px" width="32px"> Title: {{ job['title'] }} | Company: {{ job['company'] }} | Date Applied: {{ job['date'] }} | <a :href="job['url']">Link</a>
      </li>
    </ul>
  </main>
</template>

<style scoped>

</style>
