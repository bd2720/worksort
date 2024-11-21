<script setup>
import { db_jobs_delete } from '../dbUtil'

const props = defineProps({
  selectedJobID: Number,
})

const emit = defineEmits([
  'job_delete', 'cancel_delete'
])

// delete the job associated with selectedJobID, exit Delete mode
function deleteJob() {
  // remove job with matching ID (in DB)
  db_jobs_delete(props.selectedJobID)
  emit('job_delete')
}

// exit Delete mode without deleting job.
function cancelDelete() {
  emit('cancel_delete')
}

</script>

<template>
  <h3>WARNING:</h3>
  <p>
    Are you sure you want to delete this job?
  </p>
  <div class="delete-buttons">
    <button @click="deleteJob">Yes</button>
    <button @click="cancelDelete">No</button>
  </div>
</template>

<style scoped>
@import '../assets/delete.css';
</style>