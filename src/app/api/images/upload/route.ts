import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { imageUploadService } from '../../../_shared/core/image-upload-global.service';
import { authOptions } from '../../../_shared/core/auth-global.service';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    const uploadResult = await imageUploadService.uploadToFal(file);

    return NextResponse.json({
      success: true,
      data: uploadResult,
    });

  } catch (error) {
    console.error('Image upload error:', error);
    
    return NextResponse.json(
      { 
        error: 'Image upload failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}