<script setup>
import { db_jobs_delete } from '../dbUtil'

const props = defineProps({
  selectedJobID: Number,
})

const emit = defineEmits([
  'job_delete'
])

// delete the job associated with selectedJobID
function deleteJob() {
  // remove job with matching ID (in DB)
  db_jobs_delete(props.selectedJobID)
  emit('job_delete')
}
// call this upon creation
deleteJob()
</script>

<template>
<!-- empty for now. -->
</template>