<script setup>
import { dateToStr } from '../util'

const props = defineProps({
  selectedJob: Object
})

const emit = defineEmits([
  'job_deselect',
  'job_edit',
  'job_delete'
])
</script>

<template>
  <div class="info-wrapper">
    <div class="info-item">
      <h3>Job Title</h3>
      <p>
        {{ selectedJob['title'] }}
      </p>
    </div>
    <div class="info-item">
      <h3>Company Name</h3>
      <p>
        {{ selectedJob['company'] }}
      </p>
    </div>
    <div class="info-item">
      <h3>Date Applied</h3>
      <p>
        {{ dateToStr(selectedJob['date']) }}
      </p>
    </div>
    <div class="info-item">
      <h3>Link</h3>
      <p id="info-link">
        <a :href="selectedJob['url']">{{ selectedJob['url'] }}</a>
      </p>
    </div>
    <div class="info-item">
      <h3>Notes</h3>
      <p id="info-notes">
        {{ selectedJob['notes'] }}
      </p>
    </div>
    <div class="info-item">
      <h3>Table</h3>
      <p>
        (cat. name here)
      </p>
    </div>
  </div>
  <div class="info-option-wrapper">
    <button @click="emit('job_deselect')">Close</button>
    <button @click="emit('job_edit')">Edit</button>
    <button @click="emit('job_delete')">Delete</button>
  </div>
</template>

<style scoped>

.info-wrapper {
  --info-col: #e7e7e7;
}

.info-item {
  padding: 4px 0;
}

.info-item h3 {
  padding-left: 2px;
}

.info-item p {
  min-height: 28px;
  width: 300px;
  font-size: 24px;
  background: var(--info-col);
  border: 1px solid var(--border-col); 
  margin-top: 4px;
  padding: 1px 4px;
}

/* display link, wrap if necessary */
#info-link {
  word-wrap: break-word;
}

/* make notes field display taller */
#info-notes {
  min-height: 84px;
  word-wrap: break-word;
}

button {
  font-size: 18px;
}

.info-option-wrapper {
  width: 300px;
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  margin: 10px 0;
}
</style>