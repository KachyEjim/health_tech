import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import prisma from '../lib/prisma';
import { saveFile } from '../utils/file_operation';
import logger from '../utils/logger';
import { diagnosticTestSchema } from '../utils/validation';

// Essential for proper functioning with multipart/form-data in App Router
export const dynamic = 'force-dynamic';

// Create a test result
export async function POST(req: Request) {
  try {
    const contentType = req.headers.get('content-type') || '';

    if (contentType.includes('multipart/form-data')) {
      try {
        const formData = await req.formData();
        const testData: any = { result: {} };

        // Process form fields (including userId)
        for (const [key, value] of formData.entries()) {
          if (key !== 'files') {
            if (key.includes('.')) {
              const [parent, child] = key.split('.');
              testData[parent] = testData[parent] || {};
              testData[parent][child] = value;
            } else {
              testData[key] = value;
            }
          }
        }

        // Process file uploads
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
            testData.result = testData.result || {};
            testData.result.files = savedFiles;
          }
        }

        // Ensure the test date is properly formatted
        if (testData.testDate && typeof testData.testDate === 'string') {
          if (!testData.testDate.includes('T')) {
            testData.testDate = new Date(
              `${testData.testDate}T00:00:00.000Z`,
            ).toISOString();
          }
        }

        // Validate data (ensure userId is part of the payload)
        const validatedData = diagnosticTestSchema.parse(testData);

        // Create the diagnostic test record with the linked userId
        const test = await prisma.diagnosticTest.create({
          data: validatedData,
        });

        return NextResponse.json(test, { status: 201 });
      } catch (error) {
        logger.error(`Error processing form data: ${error}`);
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
          { error: 'Failed to process form data' },
          { status: 400 },
        );
      }
    } else {
      // Fallback for JSON requests
      const body = await req.json();
      const validatedData = diagnosticTestSchema.parse(body);
      const test = await prisma.diagnosticTest.create({
        data: validatedData,
      });
      return NextResponse.json(test, { status: 201 });
    }
  } catch (error) {
    logger.error(`Error creating test: ${error}`);
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
      {
        error: error instanceof Error ? error.message : 'Failed to create test',
      },
      { status: 400 },
    );
  }
}
// Get all test results
export async function GET() {
  try {
    const tests = await prisma.diagnosticTest.findMany();
    return NextResponse.json(tests);
  } catch (error) {
    logger.error(`Error fetching test results: ${error}`);
    return NextResponse.json(
      { error: 'Failed to fetch test results' },
      { status: 500 },
    );
  }
}
