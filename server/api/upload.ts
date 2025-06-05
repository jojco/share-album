import { put } from '@vercel/blob';
import { defineEventHandler, readMultipartFormData } from 'h3';

export default defineEventHandler(async (event) => {
  const formData = await readMultipartFormData(event);
  const file = formData?.find(item => item.name === 'file')?.data; // Assuming your input field is named 'file'
  const filename = formData?.find(item => item.name === 'file')?.filename;

  if (!file || !filename) {
    throw createError({
      statusCode: 400,
      statusMessage: 'No file or filename provided.',
    });
  }

  try {
    const blob = await put(filename, file, {
      access: 'public', // Set to 'public' if you want the images to be publicly accessible
      addRandomSuffix: true, // Add a random suffix to the filename to prevent collisions
      token: process.env.BLOB_READ_WRITE_TOKEN, // Use the environment variable
    });

    return {
      url: blob.url,
      pathname: blob.pathname,
    };
  } catch (error) {
    console.error('Error uploading to Vercel Blob:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to upload file to Vercel Blob.',
    });
  }
});