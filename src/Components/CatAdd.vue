<script setup>
import { ref } from 'vue'
import { db_cats_insert, db_cats_query } from '../dbUtil'

const emit = defineEmits([
  'cat_add',
  'cancel_add'
])

const cats = db_cats_query()
// input variable
const tempName = ref("")
// !TEMPLATE REF! to the #input_name element
const nameElement = ref(null)

// detect duplicate table name AND set validity message
function detectDuplicate(){
  // double-value, since (ref -> element -> text content)
  const nameVal = nameElement.value.value
  // if duplicate name detected, set validity
  const found = cats.value.find((cat) => cat['name'] === nameVal)
  nameElement.value.setCustomValidity(found ? 'Please choose a unique table name.' : '')
  // trigger validity update
  nameElement.value.reportValidity()
  return Boolean(found)
}

function addCat(){
  // create new category object
  const newCat = {
    name: tempName.value
  }
  // don't insert if name already exists
  if(detectDuplicate()) return
  // attempt to insert into DB
  db_cats_insert(newCat)
  emit('cat_add')
}

function cancelAdd(){
  emit('cancel_add')
}
</script>

<template>
  <form class="input-wrapper" @submit.prevent="addCat">
    <label for="input_table"><span class="require">* </span>Table Name</label>
    <input v-model="tempName" id="input_name" maxlength="50" autocomplete="off" required ref="nameElement" @change="detectDuplicate">
    <div class="input-button-wrapper">
      <input type="submit" value="Add Table" />
      <button @click="cancelAdd">Cancel</button>
    </div>
  </form>
</template>