<script setup>
import { db_delete } from '../dbUtil'

const props = defineProps({
  selectedJob: Object,
})

const emit = defineEmits([
  'job_delete'
])
// delete the job associated with the selectedJobID
function deleteJob() {
  // remove job with matching ID (in DB)
  db_delete(props.selectedJob['id'])
  emit('job_delete')
}
// call this upon creation
deleteJob()
</script>

<template>
<!-- empty for now. -->
</template>