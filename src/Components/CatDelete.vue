<script setup>
import { db_cats_delete } from '../dbUtil'

const props = defineProps({
  selectedCatID: Number,
  deletingCat: Boolean
})

const emit = defineEmits([
  'cat_delete', 'cancel_delete'
])

// delete the category associated with selectedCatID
function deleteCat() {
  // (failsafe) DO NOT TOUCH MAIN TABLE!
  if(props.selectedCatID != 1){
    // remove cat with matching ID
    db_cats_delete(props.selectedCatID)
  }
  emit('cat_delete')
}

// abandon deleting category, exit Delete mode
function cancelDelete(){
  emit('cancel_delete')
}
</script>

<template>
  <h3>WARNING:</h3>
  <p>
    Are you sure you want to delete this table?
  </p>
  <div class="delete-buttons">
    <button @click="deleteCat">Yes</button>
    <button @click="cancelDelete">No</button>
  </div>
</template>

<style scoped>
h3 {
  font-size: 24px;
  text-align: center;
  margin: 8px 0;
}
p {
  font-size: 20px;
  text-align: center;
  margin-bottom: 12px;
}
.delete-buttons {
  display: flex;
  justify-content: space-evenly;
}
button {
  font-size: 24px;
  width: 60px;
}
</style>