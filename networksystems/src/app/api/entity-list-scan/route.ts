import { NextRequest, NextResponse } from 'next/server';
import { getEntityListScanner } from '@/services/entity-list-scanner-service';
import { getReportGenerator } from '@/services/compliance-report-generator';

// Store scan results in memory (in production, use database)
const scanResults = new Map<string, any>();

/**
 * POST /api/entity-list-scan
 * Upload supplier list and initiate compliance scan
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const file = formData.get('file') as File | null;
    const companyName = formData.get('companyName') as string | null;
    const email = formData.get('email') as string | null;

    if (!file) {
      return NextResponse.json({
        success: false,
        error: 'No file uploaded'
      }, { status: 400 });
    }

    if (!companyName || !email) {
      return NextResponse.json({
        success: false,
        error: 'Company name and email are required'
      }, { status: 400 });
    }

    // Read file content
    const fileContent = await file.text();
    const fileName = file.name;

    // Validate file type
    const fileExt = fileName.split('.').pop()?.toLowerCase();
    if (!['csv', 'txt', 'xlsx', 'xls'].includes(fileExt || '')) {
      return NextResponse.json({
        success: false,
        error: 'Unsupported file type. Please upload CSV, TXT, or Excel files.'
      }, { status: 400 });
    }

    // Perform scan
    const scanner = getEntityListScanner();
    const scanReport = await scanner.scanFile(fileContent, fileName, companyName);

    // Generate report
    const reportGenerator = getReportGenerator();
    const htmlReport = reportGenerator.generateReport(scanReport, {
      format: 'html',
      includeFullDetails: true
    });

    const textSummary = reportGenerator.generateTextSummary(scanReport);

    // Store results
    scanResults.set(scanReport.scanId, {
      report: scanReport,
      htmlReport,
      textSummary,
      email,
      createdAt: new Date().toISOString()
    });

    // In production, send email here
    // await sendEmailReport(email, htmlReport, scanReport);

    return NextResponse.json({
      success: true,
      scanId: scanReport.scanId,
      summary: {
        totalSuppliers: scanReport.summary.totalSuppliers,
        criticalSuppliers: scanReport.summary.criticalSuppliers,
        highRiskSuppliers: scanReport.summary.highRiskSuppliers,
        overallRiskLevel: scanReport.summary.overallRiskLevel,
        overallRiskScore: scanReport.summary.overallRiskScore,
        estimatedExposure: scanReport.summary.estimatedExposure
      },
      message: 'Compliance scan completed successfully. Report will be sent to ' + email
    });

  } catch (error) {
    console.error('Entity list scan error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Scan failed'
    }, { status: 500 });
  }
}

/**
 * GET /api/entity-list-scan?scanId=xxx
 * Retrieve scan report
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const scanId = searchParams.get('scanId');
    const format = searchParams.get('format') || 'json';

    if (!scanId) {
      return NextResponse.json({
        success: false,
        error: 'Scan ID is required'
      }, { status: 400 });
    }

    const result = scanResults.get(scanId);

    if (!result) {
      return NextResponse.json({
        success: false,
        error: 'Scan not found'
      }, { status: 404 });
    }

    if (format === 'html') {
      return new NextResponse(result.htmlReport, {
        headers: {
          'Content-Type': 'text/html',
          'Content-Disposition': `inline; filename="compliance-report-${scanId}.html"`
        }
      });
    }

    if (format === 'text') {
      return new NextResponse(result.textSummary, {
        headers: {
          'Content-Type': 'text/plain',
          'Content-Disposition': `inline; filename="compliance-report-${scanId}.txt"`
        }
      });
    }

    return NextResponse.json({
      success: true,
      report: result.report
    });

  } catch (error) {
    console.error('Scan retrieval error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Retrieval failed'
    }, { status: 500 });
  }
}
