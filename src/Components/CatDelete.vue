<script setup>
import { db_cats_delete } from '../dbUtil'

const props = defineProps({
  selectedCatID: Number,
})

const emit = defineEmits([
  'cat_delete'
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
// call this upon creation
deleteCat()
</script>

<template>
<!-- empty for now. -->
</template>