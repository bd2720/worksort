<script setup>
  import { ref, computed } from 'vue'
  // JSON array of job objects
  const jobs = ref([])
  // begin jobIDs at 1
  const nextID = ref(1)

  // input variables
  const tempTitle = ref("")
  const tempCompany = ref("")
  const tempDate = ref("")
  const tempURL = ref("")

  // show input fields if adding jobs or editing a specific job
  const showInputs = computed(() => {
    return addingJobs.value || selectedJobID.value
  })

  // show functional buttons (Add, Edit, Delete)
  const showFunctions = computed(() => {
    return !addingJobs.value && !editingJobs.value && !deletingJobs.value
  })

  const addingJobs = ref(false)
  function startNewJob(){
    addingJobs.value = true
  }

  const editingJobs = ref(false)
  function startEditJob(){
    editingJobs.value = true
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

  // needed for storing selected job while editing; null means unselected
  const selectedJobID = ref(null)
  // begin editing job information
  function selectJob(jobID){
    // save the selected job id
    selectedJobID.value = jobID
  }

  function editJob(){
    // save new information to the currently selected job
    jobs.value = jobs.value.filter((job) => {
      // edit nonempty fields of selected job
      if(job['id'] == selectedJobID.value){
        if(tempTitle.value) job['title'] = tempTitle.value
        if(tempCompany.value) job['company'] = tempCompany.value
        if(tempDate.value) job['date'] = tempDate.value
        if(tempURL.value) job['url'] = tempURL.value
      }
      return true // include all jobs in list
    })
    // deselect the job after updating list
    selectedJobID.value = null
  }

  // when "Cancel" is pressed while editing a specific job
  function deselectJob(){
    selectedJobID.value = null
  }

  // exit editing mode
  function finalizeEditJob(){
    editingJobs.value = false
  }

  // delete the job associated with the given jobID
  function deleteJob(jobID){
    // remove job with matching ID
    jobs.value = jobs.value.filter((job) => job['id'] != jobID)
  }

  // exit deletingJobs mode
  function finalizeDeleteJob(){
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
    <div class="function-wrapper" v-if="showFunctions">
      <button @click="startNewJob()">New Job</button>
      <button @click="startEditJob()">Edit Job</button>
      <button @click="startDeleteJob()">Delete Job</button>
    </div>
    <button @click="finalizeEditJob()" v-if="editingJobs && !selectedJobID">Done</button>
    <button @click="finalizeDeleteJob()" v-if="deletingJobs">Done</button>
    <form v-if="showInputs">
      <input v-model="tempTitle" placeholder="Title">
      <input v-model="tempCompany" placeholder="Company">
      <input type="date" v-model="tempDate" placeholder="Date Applied">
      <input type="url" v-model="tempURL" placeholder="Link">
      <button @click="finalizeNewJob()" v-if="addingJobs">Add Job</button>
      <button @click="abortNewJob()" v-if="addingJobs">Cancel</button>
      <button @click="editJob()" v-if="editingJobs">Save</button>
      <button @click="deselectJob()" v-if="editingJobs">Cancel</button>
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
        </tr>
      </thead>
      <tbody>
        <tr v-for="job in jobsDisplayed">
          <!--<td>{{ job['id'] }}</td>-->
          <td><img alt="" :src="getFavicon(job['url'])" height="16px" width="16px"></td>
          <td>{{ job['title'] }}</td>
          <td>{{ job['company'] }}</td>
          <td>{{ job['date'] }}</td>
          <td><a :href="job['url']">Visit</a></td>
          <td v-if="editingJobs"><button @click="selectJob(job['id'])">Edit</button></td>
          <td v-if="deletingJobs"><button @click="deleteJob(job['id'])">Delete</button></td>
        </tr>
      </tbody>
    </table>
  </main>
</template>

<style scoped>

</style>
