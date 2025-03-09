import fs from 'fs/promises';
import { NextResponse } from 'next/server';
import path from 'path';
import { ZodError } from 'zod';
import prisma from '../../lib/prisma';
import { saveFile } from '../../utils/file_operation';
import logger from '../../utils/logger';
import { diagnosticTestSchema } from '../../utils/validation';

// Essential for proper functioning with multipart/form-data in App Router
export const dynamic = 'force-dynamic';

// Get a single test result
export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const test = await prisma.diagnosticTest.findUnique({
      where: { id: params.id },
    });

    if (!test)
      return NextResponse.json({ error: 'Test not found' }, { status: 404 });

    return NextResponse.json(test);
  } catch (error) {
    logger.error(`Error fetching test result: ${error}`);
    return NextResponse.json(
      { error: 'Failed to fetch test result' },
      { status: 500 },
    );
  }
}

// Update a test result
export async function PUT(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const contentType = req.headers.get('content-type') || '';
    let updatedData: any = {};

    if (contentType.includes('multipart/form-data')) {
      try {
        // Use native FormData parsing for App Router
        const formData = await req.formData();

        // Processing form data
        for (const [key, value] of formData.entries()) {
          if (key !== 'files') {
            // Handle nested fields using dot notation (e.g., result.value)
            if (key.includes('.')) {
              const [parent, child] = key.split('.');
              updatedData[parent] = updatedData[parent] || {};
              updatedData[parent][child] = value;
            } else {
              updatedData[key] = value;
            }
          }
        }

        // Process files
        const fileEntries = formData.getAll('files');
        if (fileEntries.length > 0) {
          const savedFiles = [];

          for (const fileEntry of fileEntries) {
            if (fileEntry instanceof File) {
              const savedPath = await saveFile(fileEntry);
              if (savedPath) savedFiles.push(savedPath);
            }
          }

          if (savedFiles.length > 0) {
            updatedData.result = updatedData.result || {};
            updatedData.result.files = savedFiles;
          }
        }
        // Format the date properly for Prisma
        if (updatedData.testDate && typeof updatedData.testDate === 'string') {
          if (!updatedData.testDate.includes('T')) {
            // Convert YYYY-MM-DD to YYYY-MM-DDT00:00:00.000Z
            updatedData.testDate = new Date(
              `${updatedData.testDate}T00:00:00.000Z`,
            ).toISOString();
          }
        }
        // Validate the data
        updatedData = diagnosticTestSchema.partial().parse(updatedData);
      } catch (error) {
        logger.error(`Error processing multipart form: ${error}`);
        return NextResponse.json(
          { error: 'Failed to process form data' },
          { status: 400 },
        );
      }
    } else {
      // Handle JSON requests
      const body = await req.json();
      updatedData = diagnosticTestSchema.partial().parse(body);
    }

    // Handle existing files if needed
    const existingFilesData = updatedData.existingFiles;
    if (existingFilesData) {
      // Keep existing files if specified
      delete updatedData.existingFiles;

      if (!updatedData.result) updatedData.result = {};
      updatedData.result.files = Array.isArray(existingFilesData)
        ? existingFilesData
        : [existingFilesData];
    }

    // If files are being updated and no existing files specified, remove old ones
    if (updatedData.result && updatedData.result.files && !existingFilesData) {
      const existingTest = await prisma.diagnosticTest.findUnique({
        where: { id: params.id },
      });

      if (
        existingTest?.result &&
        typeof existingTest.result === 'object' &&
        existingTest.result !== null &&
        'files' in existingTest.result
      ) {
        const oldFiles = Array.isArray(existingTest.result.files)
          ? existingTest.result.files
          : [existingTest.result.files];

        for (const filePath of oldFiles) {
          if (filePath) {
            const fullPath = path.join(
              process.cwd(),
              'public',
              filePath.toString(),
            );
            try {
              await fs.unlink(fullPath);
            } catch (err) {
              logger.error(`Error deleting old file ${fullPath}: ${err}`);
            }
          }
        }
      }
    }

    // Update the database
    const updatedTest = await prisma.diagnosticTest.update({
      where: { id: params.id },
      data: updatedData,
    });

    logger.info(`Test result ${params.id} updated successfully`);
    return NextResponse.json(updatedTest);
  } catch (error) {
    logger.error(`Error updating test result: ${error}`);
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: error.errors.map((err) => ({
            message: err.message,
            path: err.path,
          })),
        },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 400 },
    );
  }
}

// Delete a test result
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const test = await prisma.diagnosticTest.findUnique({
      where: { id: params.id },
    });

    if (!test) {
      return NextResponse.json({ error: 'Test not found' }, { status: 404 });
    }

    // Remove file(s) from disk if they exist
    if (
      test.result &&
      typeof test.result === 'object' &&
      test.result !== null &&
      'files' in test.result
    ) {
      const filesToDelete = Array.isArray(test.result.files)
        ? test.result.files
        : [test.result.files];

      for (const filePath of filesToDelete) {
        if (filePath) {
          const fullPath = path.join(
            process.cwd(),
            'public',
            filePath.toString(),
          );
          try {
            await fs.unlink(fullPath);
          } catch (err) {
            logger.error(`Error deleting file ${fullPath}: ${err}`);
          }
        }
      }
    }

    await prisma.diagnosticTest.delete({
      where: { id: params.id },
    });

    logger.info(`Test result ${params.id} deleted successfully`);
    return NextResponse.json(
      { message: 'Test result deleted' },
      { status: 200 },
    );
  } catch (error) {
    logger.error(`Error deleting test result: ${error}`);
    return NextResponse.json(
      { error: 'Failed to delete test result' },
      { status: 500 },
    );
  }
}
