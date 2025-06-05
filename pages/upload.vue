<template>
  <div>
    <h1>Upload Photo</h1>
    <input type="file" @change="handleFileChange" accept="image/*" />
    <button @click="uploadPhoto" :disabled="!selectedFile || uploading">
      {{ uploading ? 'Uploading...' : 'Upload' }}
    </button>
    <div v-if="uploadedUrl">
      <p>Photo uploaded successfully!</p>
      <img :src="uploadedUrl" alt="Uploaded Photo" style="max-width: 300px;" />
      <p>URL: {{ uploadedUrl }}</p>
    </div>
    <p v-if="error" style="color: red;">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const selectedFile = ref<File | null>(null);
const uploadedUrl = ref<string | null>(null);
const uploading = ref(false);
const error = ref<string | null>(null);

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    selectedFile.value = target.files[0];
    uploadedUrl.value = null;
    error.value = null;
  }
};

const uploadPhoto = async () => {
  if (!selectedFile.value) {
    error.value = 'Please select a file to upload.';
    return;
  }

  uploading.value = true;
  error.value = null;

  const formData = new FormData();
  formData.append('file', selectedFile.value); // 'file' matches the name expected in your API route

  try {
    const response = await $fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });
    uploadedUrl.value = response.url;
    selectedFile.value = null; // Clear the input
  } catch (err: any) {
    console.error('Upload failed:', err);
    error.value = err.data?.message || 'Failed to upload photo.';
  } finally {
    uploading.value = false;
  }
};
</script>