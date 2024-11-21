<script setup>
import { ref } from 'vue'
import { db_cats_update, db_cats_query } from '../dbUtil'

const props = defineProps({
  selectedCat: Object
})

const emit = defineEmits([
  'cat_edit',
  'cancel_edit'
])

// need array of categories to check that new name is unique
const cats = db_cats_query()
// input variables
const tempName = ref(props.selectedCat['name'])
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

function editCat() {
  const editedCat = {
    name: tempName.value,
    id: props.selectedCat['id']
  }
  // (failsafe) DO NOT TOUCH MAIN TABLE!
  // only update if table name is unique
  if(editedCat['id'] != 1 && !detectDuplicate()){
    // attempt update
    db_cats_update(editedCat)
    // quit editing, and send App.vue the new category
    emit('cat_edit', editedCat)
  }
}

function cancelEdit(){
  emit('cancel_edit')
}
</script>

<template>
  <form class="input-wrapper" @submit.prevent="editCat">
    <label for="input_table"><span class="require">* </span>Table Name</label>
    <input v-model="tempName" id="input_name" maxlength="50" autocomplete="off" required ref="nameElement" @change="detectDuplicate">
    <div class="input-button-wrapper">
      <input type="submit" value="Save" />
      <button @click="cancelEdit">Cancel</button>
    </div>
  </form>
</template>

<style scoped>
@import '../assets/fields.css';
</style>