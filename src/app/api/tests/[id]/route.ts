/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import { ZodError } from 'zod';
import prisma from '../../lib/prisma';
import { saveFile } from '../../utils/file_operation';
import logger from '../../utils/logger';
import { diagnosticTestSchema } from '../../utils/validation';

export const dynamic = 'force-dynamic';

// GET a single test result
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  try {
    const { id } = await params;

    const test = await prisma.diagnosticTest.findUnique({
      where: { id },
    });
    if (!test) {
      return NextResponse.json({ error: 'Test not found' }, { status: 404 });
    }
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
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  try {
    const { id } = await params;
    const contentType = request.headers.get('content-type') || '';
    let updatedData: any = {};

    if (contentType.includes('multipart/form-data')) {
      try {
        const formData = await request.formData();
        // Process form fields
        for (const [key, value] of formData.entries()) {
          if (key !== 'files') {
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
        // Format testDate for Prisma
        if (updatedData.testDate && typeof updatedData.testDate === 'string') {
          if (!updatedData.testDate.includes('T')) {
            updatedData.testDate = new Date(
              `${updatedData.testDate}T00:00:00.000Z`,
            ).toISOString();
          }
        }
        // Validate data
        updatedData = diagnosticTestSchema.partial().parse(updatedData);
      } catch (error) {
        logger.error(`Error processing multipart form: ${error}`);
        return NextResponse.json(
          { error: 'Failed to process form data' },
          { status: 400 },
        );
      }
    } else {
      const body = await request.json();
      updatedData = diagnosticTestSchema.partial().parse(body);
    }

    // Handle existing files if provided
    const existingFilesData = updatedData.existingFiles;
    if (existingFilesData) {
      delete updatedData.existingFiles;
      if (!updatedData.result) updatedData.result = {};
      updatedData.result.files = Array.isArray(existingFilesData)
        ? existingFilesData
        : [existingFilesData];
    }

    // Remove old files if new ones are provided
    if (updatedData.result && updatedData.result.files && !existingFilesData) {
      const existingTest = await prisma.diagnosticTest.findUnique({
        where: { id },
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

    const updatedTest = await prisma.diagnosticTest.update({
      where: { id },
      data: updatedData,
    });

    logger.info(`Test result ${id} updated successfully`);
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
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  try {
    const { id } = await params;
    const test = await prisma.diagnosticTest.findUnique({
      where: { id },
    });
    if (!test) {
      return NextResponse.json({ error: 'Test not found' }, { status: 404 });
    }
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
      where: { id },
    });
    logger.info(`Test result ${id} deleted successfully`);
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
