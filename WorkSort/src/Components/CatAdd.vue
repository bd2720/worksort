<script setup>
import { ref } from 'vue'
import { db_cats_insert } from '../dbUtil'

const emit = defineEmits([
  'cat_add',
  'cancel_add'
])

// input variables
const tempName = ref("")

function addCat() {
  const newCat = {

  }
  // insert into DB
  db_cats_insert(newCat)
  emit('cat_add')
}

function cancelAdd(){
  emit('cancel_add')
}
</script>

<template>
  <form class="input-wrapper">
    <input v-model="tempName" placeholder="Table Name">
    <div class="input-button-wrapper">
      <button @click="addCat">Add Table</button>
      <button @click="cancelAdd">Cancel</button>
    </div>
  </form>
</template>