<script setup>
import { ref, watch } from 'vue'
import { db_cats_query } from '../dbUtil.js'
import { dateToStr } from '../util'
import VueTagsInput from '@sipec/vue3-tags-input'

const props = defineProps({
  selectedJob: Object,
  deletingJob: Boolean,
  searchingJobs: Boolean
})

const emit = defineEmits([
  'job_deselect',
  'job_edit',
  'job_delete'
])

// have to find category manually, since selectedCat may not match
const cats = db_cats_query()
const selectedCat = ref(undefined)
watch(cats, (newCats) => {
  if(newCats) selectedCat.value = newCats.find((cat) => cat['id'] === props.selectedJob['catID']) 
})

const tag = ref('')

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
        <a :href="selectedJob['url']" target="_blank">{{ selectedJob['url'] }}</a>
      </p>
    </div>
    <div class="info-item">
      <h3>Notes</h3>
      <p id="info-notes">
        {{ selectedJob['notes'] }}
      </p>
    </div>
    <div class="info-item">
      <h3>Tags</h3>
      <VueTagsInput id="info-tags" v-model="tag" :tags="selectedJob['tags']" :max-tags="20" :maxlength="42" :disabled="true" :placeholder="''"/>
    </div>
    <div class="info-item">
      <h3>Table</h3>
      <p>
        <span v-if="selectedCat">
          {{ selectedCat['name'] }}
        </span>
      </p>
    </div>
  </div>
  <div v-if="!deletingJob" class="info-option-wrapper">
    <button @click="emit('job_deselect')">Close</button>
    <button v-if="!searchingJobs" @click="emit('job_edit')">Edit</button>
    <button v-if="!searchingJobs" @click="emit('job_delete')">Delete</button>
  </div>
</template>

<style>
@import '../assets/fields.css';

.info-wrapper {
  --info-col: #f9f9f9;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 10px;
}

.info-item {
  padding: 4px 0;
  width: 80%;
}

.info-item h3 {
  padding-left: 2px;
  margin-bottom: 4px;
}

.info-item p {
  min-height: 28px;
  width: 100%;
  font-size: 24px;
  background: var(--info-col);
  border: 1px solid var(--border-col); 
  margin-top: 4px;
  padding: 1px 4px;
  word-wrap: break-word;
}

.info-item .vue-tags-input {
  width: calc(100% + 10px);
  border: var(--border-col);
}

/* make notes field display taller */
#info-notes {
  min-height: 84px;
  word-wrap: break-word;
}

.info-option-wrapper button {
  font-size: 18px;
}

.info-option-wrapper {
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  margin: 10px 20px;
}

.info-item .vue-tags-input {
  background: var(--info-col) !important;
}

.info-item .vue-tags-input .ti-actions {
  display: none !important;
}

@media(width <= 720px) {
  .info-wrapper {
    width: 80%;
    margin: 10px 10% 0;
  }

  .info-item {
    width: 100%;
  }

  .info-item p {
    width: 100%;
  }

  .info-item .vue-tags-input {
    width: calc(100% + 10px) !important;
  }
}

</style>