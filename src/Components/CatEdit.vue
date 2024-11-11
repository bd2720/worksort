<script setup>
import { ref } from 'vue'
import { db_cats_update } from '../dbUtil'

const props = defineProps({
  selectedCat: Object
})

const emit = defineEmits([
  'cat_edit',
  'cancel_edit'
])

// input variables
const tempName = ref(props.selectedCat['name'])

function editCat() {
  const editedCat = {
    name: tempName.value,
    id: props.selectedCat['id']
  }
  // (failsafe) DO NOT TOUCH MAIN TABLE!
  if(editedCat['id'] != 1){
    // attempt update
    db_cats_update(editedCat)
  }
  emit('cat_edit', editedCat)
}

function cancelEdit(){
  emit('cancel_edit')
}
</script>

<template>
  <form class="input-wrapper">
    <input v-model="tempName" placeholder="Table Name">
    <div class="input-button-wrapper">
      <button @click="editCat">Rename Table</button>
      <button @click="cancelEdit">Cancel</button>
    </div>
  </form>
</template>