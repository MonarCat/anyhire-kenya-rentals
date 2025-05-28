import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import {
  resizeAndCompressImage,
  cropImageToSquare
} from '@/utils/imageUtils';

interface ProfilePictureUploadProps {
  currentImageUrl?: string;
  userName: string;
}

const ProfilePictureUpload: React.FC<ProfilePictureUploadProps> = ({
  currentImageUrl,
  userName
}) => {
  const [uploading, setUploading] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const { toast } = useToast();
  const { user, updateProfile } = useAuth();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const uploadImage = async (file: File) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to upload a profile picture",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    try {
      if (!file.type.startsWith('image/')) {
        throw new Error('Please upload an image file');
      }

      if (file.size > 10 * 1024 * 1024) {
        throw new Error('File size must be less than 10MB');
      }

      console.log('Processing image...', { originalSize: file.size });

      let processedFile = await cropImageToSquare(file);
      processedFile = await resizeAndCompressImage(processedFile, 400, 400, 0.8);

      console.log('Image processed:', {
        originalSize: file.size,
        processedSize: processedFile.size,
        compressionRatio: ((file.size - processedFile.size) / file.size * 100).toFixed(1) + '%'
      });

      const fileName = `${user.id}/avatar-${Date.now()}.jpg`;

      try {
        const { data: existingFiles } = await supabase.storage
          .from('avatars')
          .list(user.id);

        if (existingFiles && existingFiles.length > 0) {
          const filesToDelete = existingFiles.map(file => `${user.id}/${file.name}`);
          await supabase.storage
            .from('avatars')
            .remove(filesToDelete);
          console.log('Removed old avatars');
        }
      } catch (cleanupError) {
        console.log('No old files to clean up or cleanup failed:', cleanupError);
      }

      const { error: uploadError, data } = await supabase.storage
        .from('avatars')
        .upload(fileName, processedFile, {
          cacheControl: '3600',
          upsert: true,
          contentType: 'image/jpeg'
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw new Error(`Upload failed: ${uploadError.message}`);
      }

      const { publicUrl } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      const finalUrl = `${publicUrl}?t=${Date.now()}`;
      console.log('Image uploaded successfully:', finalUrl);

      await updateProfile({ avatar_url: finalUrl });

      toast({
        title: "Success!",
        description: "Profile picture updated successfully.",
      });
    } catch (error: any) {
      console.error('Error uploading image:', error);
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload profile picture",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const startCamera = async () => {
    try {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 640 },
          height: { ideal: 640 }
        },
        audio: false
      });

      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setShowCamera(true);
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast({
        title: "Camera access denied",
        description: "Please allow camera access to take a selfie.",
        variant: "destructive",
      });
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setShowCamera(false);
  };

  const capturePhoto = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    const size = Math.min(video.videoWidth, video.videoHeight);
    canvas.width = size;
    canvas.height = size;

    const offsetX = (video.videoWidth - size) / 2;
    const offsetY = (video.videoHeight - size) / 2;

    context.drawImage(video, offsetX, offsetY, size, size, 0, 0, size, size);

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob((b) => resolve(b), 'image/jpeg', 0.8)
    );

    if (blob) {
      const file = new File([blob], 'selfie.jpg', { type: 'image/jpeg' });
      await uploadImage(file);
      stopCamera();
    }
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    await uploadImage(file);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="relative inline-block">
      <Avatar className="w-24 h-24">
        <AvatarImage src={currentImageUrl} alt={userName} />
        <AvatarFallback className="text-2xl bg-blue-100 text-blue-600">
          {userName.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>

      <div className="absolute bottom-0 right-0 flex space-x-1">
        <Dialog>
          <DialogTrigger asChild>
            <Button
              size="sm"
              className="rounded-full w-8 h-8 p-0 bg-blue-600 hover:bg-blue-700"
              disabled={uploading}
            >
              <Camera className="w-4 h-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Take a Selfie</DialogTitle>
              <DialogDescription>
                Take a clear selfie for your profile picture.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {showCamera && (
                <>
                  <div className="relative">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className="w-full rounded-lg"
                    />
                    <div className="absolute inset-0 border-2 border-white border-dashed rounded-lg pointer-events-none" />
                  </div>
                  <canvas ref={canvasRef} className="hidden" />
                  <div className="flex justify-center space-x-4">
                    <Button onClick={capturePhoto} disabled={uploading}>
                      <Camera className="w-4 h-4 mr-2" />
                      {uploading ? 'Processing...' : 'Capture Photo'}
                    </Button>
                    <Button variant="outline" onClick={stopCamera}>
                      Cancel
                    </Button>
                  </div>
                </>
              )}
              {!showCamera && (
                <Button onClick={startCamera} className="w-full">
                  Start Camera
                </Button>
              )}
            </div>
          </DialogContent>
        </Dialog>

        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <Button
            size="sm"
            className="rounded-full w-8 h-8 p-0 bg-green-600 hover:bg-green-700"
            disabled={uploading}
            onClick={handleFileSelect}
          >
            {uploading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Upload className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      {!currentImageUrl && (
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
          <div className="bg-red-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
            <User className="w-3 h-3 mr-1" />
            <span>Add Photo</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePictureUpload;
