import { NextRequest, NextResponse } from 'next/server';

interface RouteParams {
  params: { id: string };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  return NextResponse.json({ message: `Product ${params.id} API endpoint` });
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  return NextResponse.json({ message: `Product ${params.id} API endpoint` });
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  return NextResponse.json({ message: `Product ${params.id} API endpoint` });
}