<script setup>
const props = defineProps({
  selectedJob: Object,
  jobs: Array
})

const emit = defineEmits([
  'job_delete'
])
// delete the job associated with the selectedJobID
function deleteJob() {
  // remove job with matching ID (in DB)
  emit('job_delete')
}
// call this upon creation
deleteJob()

</script>

<template>
<!-- empty for now. -->
</template>