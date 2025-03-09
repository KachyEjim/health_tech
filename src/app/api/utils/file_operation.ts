import { File as FormidableFile } from 'formidable';
import fs from 'fs/promises';
import path from 'path';

// Export this for Next.js Pages Router only - in App Router this should be in route.ts
export const config = {
  api: {
    bodyParser: false,
  },
};

const allowedExtensions = ['.png', '.jpg', '.jpeg', '.pdf', '.docx'];
const maxFileSize = 5 * 1024 * 1024; // 5MB

// Enhanced save file function that works with both File and formidable File
export const saveFile = async (
  file: FormidableFile | File,
): Promise<string | false> => {
  try {
    // Handle both FormidableFile and standard File objects
    const isFormidableFile = 'filepath' in file && 'originalFilename' in file;

    // Get filename
    const filename = isFormidableFile
      ? (file as FormidableFile).originalFilename
      : (file as File).name;

    if (!filename) return false;

    // Get file extension and validate
    const fileExt = path.extname(filename).toLowerCase();
    if (!allowedExtensions.includes(fileExt)) {
      console.warn(
        `File type not allowed: ${fileExt}. Allowed types: ${allowedExtensions.join(
          ', ',
        )}`,
      );
      return false;
    }

    // Get file size and validate
    const fileSize = isFormidableFile
      ? (file as FormidableFile).size
      : (file as File).size;

    if (fileSize > maxFileSize) {
      console.warn(
        `File too large: ${fileSize} bytes. Max allowed: ${maxFileSize} bytes`,
      );
      return false;
    }

    // Create directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), 'public/uploads');
    await fs.mkdir(uploadDir, { recursive: true });

    // Create a safe filename with timestamp
    const safeFilename = `${Date.now()}-${filename.replace(
      /[^a-zA-Z0-9.-]/g,
      '_',
    )}`;
    const filePath = path.join(uploadDir, safeFilename);

    // Read and write the file based on type
    if (isFormidableFile) {
      await fs.writeFile(
        filePath,
        await fs.readFile((file as FormidableFile).filepath),
      );
    } else {
      const arrayBuffer = await (file as File).arrayBuffer();
      await fs.writeFile(filePath, Buffer.from(arrayBuffer));
    }

    return `/uploads/${safeFilename}`; // Return browser-accessible path
  } catch (error) {
    console.error(
      `Error saving file: ${error instanceof Error ? error.message : error}`,
    );
    return false;
  }
};
