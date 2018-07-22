import { Storage } from "aws-amplify";

// Convenience method to upload to S3 that takes a file object as a parameter
export async function s3Upload(file) {
    // Create a unique file name using the current timestamp
    const filename = `${Date.now()}-${file.name}`;
    // Upload the file to the user's private folder in S3
    const stored = await Storage.vault.put(filename, file, {
        contentType: file.type
    });
    // Return the stored object's key
    return stored.key;
}

// Convenience method to delete a file from S3
export async function s3Delete(key) {
    await Storage.vault.remove(key)
}