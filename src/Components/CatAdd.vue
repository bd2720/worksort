<script setup>
import { ref } from 'vue'
import { db_cats_insert, db_cats_query } from '../dbUtil'

const emit = defineEmits([
  'cat_add',
  'cancel_add'
])

// input variables
const tempName = ref("")
const cats = db_cats_query()

// detect category with given name
function catExists(catName){
  return cats.value.find((cat) => cat['name'] == catName)
}

function addCat() {
  const newCat = {
    name: tempName.value
  }
  // don't insert if name already exists
  if(!catExists(newCat['name'])){
    // attempt to insert into DB
    db_cats_insert(newCat)
  }
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