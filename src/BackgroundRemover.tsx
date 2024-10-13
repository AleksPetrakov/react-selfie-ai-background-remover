import React, {
  useRef,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from 'react';
import * as bodySegmentation from '@tensorflow-models/body-segmentation';
import '@tensorflow/tfjs';

export interface OnProcessCompleteResult {
  originalImage: string;
  processedImage: string;
  maskImage: string;
}

export interface ShowButtonsProps {
  upload?: boolean;
  download?: boolean;
  downloadMask?: boolean;
  clear?: boolean;
}

export interface BackgroundRemoverProps {
  width?: number;
  height?: number;
  onProcessComplete?: (result: OnProcessCompleteResult) => void;
  onError?: (error: unknown) => void;
  allowDownload?: boolean;
  style?: React.CSSProperties;
  className?: string;
  uploadButton?: ReactNode;
  downloadButton?: ReactNode;
  downloadMaskButton?: ReactNode;
  clearButton?: ReactNode;
  showButtons?: ShowButtonsProps;
  hasSmoothEdges?: boolean;
  isInverted?: boolean;
  imageName?: string;
  maskImageName?: string;
}

const BackgroundRemover: React.FC<BackgroundRemoverProps> = ({
  width,
  height,
  onProcessComplete,
  onError,
  allowDownload = false,
  style = {},
  className = '',
  uploadButton,
  downloadButton,
  downloadMaskButton,
  clearButton,
  showButtons = {
    upload: true,
    download: true,
    downloadMask: true,
    clear: true,
  },
  hasSmoothEdges = true,
  isInverted = false,
  imageName = 'processed-image',
  maskImageName = 'mask-image',
}) => {
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [maskImage, setMaskImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Reference for storing the segmenter
  const segmenterRef = useRef<bodySegmentation.BodySegmenter | null>(null);

  // Load the model when the component mounts
  useEffect(() => {
    const loadModel = async () => {
      try {
        segmenterRef.current =
          await bodySegmentation.createSegmenter(
            bodySegmentation.SupportedModels.MediaPipeSelfieSegmentation,
            {
              runtime: 'tfjs',
            }
          );
      } catch (error) {
        if (onError) {
          onError(error);
        }
      }
    };
    loadModel();
  }, [onError]);

  const removeBackground = useCallback(
    async (img: HTMLImageElement) => {
      try {
        const segmenter = segmenterRef.current;

        if (!segmenter) return;

        const segmentation = await segmenter.segmentPeople(img, {
          multiSegmentation: false,
          segmentBodyParts: false,
        });

        const foreground = isInverted
          ? { r: 0, g: 0, b: 0, a: 0 }
          : { r: 255, g: 255, b: 255, a: 255 };
        const background = isInverted
          ? { r: 255, g: 255, b: 255, a: 255 }
          : { r: 0, g: 0, b: 0, a: 0 };

        const aiImageData: ImageData =
          await bodySegmentation.toBinaryMask(
            segmentation,
            foreground,
            background,
            hasSmoothEdges
          );

        // Create a canvas to generate the mask image
        const maskCanvas = document.createElement('canvas');
        maskCanvas.width = img.width;
        maskCanvas.height = img.height;
        const maskCtx = maskCanvas.getContext('2d');
        if (!maskCtx) return;
        maskCtx.putImageData(aiImageData, 0, 0);

        const maskDataUrl = maskCanvas.toDataURL('image/png');
        setMaskImage(maskDataUrl);

        // Create a canvas to apply the mask
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.drawImage(img, 0, 0);
        ctx.globalCompositeOperation = 'destination-in';
        ctx.drawImage(maskCanvas, 0, 0);
        ctx.globalCompositeOperation = 'source-over';

        const dataUrl = canvas.toDataURL('image/png');
        setProcessedImage(dataUrl);

        if (onProcessComplete) {
          onProcessComplete({
            originalImage: img.src,
            processedImage: dataUrl,
            maskImage: maskDataUrl,
          });
        }
      } catch (error) {
        if (onError) {
          onError(error);
        }
      }
    },
    [hasSmoothEdges, isInverted, onError, onProcessComplete]
  );

  const handleImageUpload = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        setLoading(true);
        const imgUrl = URL.createObjectURL(file);
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = imgUrl;
        img.onload = async () => {
          await removeBackground(img);
          setLoading(false);
        };
        img.onerror = (error) => {
          setLoading(false);
          if (onError) {
            onError(error);
          }
        };
      }
    },
    [onError, removeBackground]
  );

  const handleButtonClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const downloadImage = useCallback((imageFile: string, filename: string) => {
    if (imageFile) {
      const link = document.createElement('a');
      link.href = imageFile;
      link.download = `${filename}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }, []);

  const clearImages = useCallback(() => {
    setProcessedImage(null);
    setMaskImage(null);
  }, []);

  return (
    <div style={{ textAlign: 'center', ...style }} className={`ai-bg-remover ${className}`}>
      {loading && <p className="">Processing image...</p>}

      <input
        className="ai-bg-remover__file-input"
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleImageUpload}
      />


      {showButtons!.upload && !processedImage && (
        uploadButton ? React.cloneElement(uploadButton as any, {
          onClick: handleButtonClick,
          className: `ai-bg-remover__upload-button ${(uploadButton as any).props.className}`
        }) : <button
          type="button"
          className="ai-bg-remover__upload-button"
          onClick={handleButtonClick}
        >
          Upload Image
        </button>
      )}

      <canvas ref={canvasRef} style={{ display: 'none' }} className="ai-bg-remover__canvas" />

      {processedImage && (
        <img
          src={processedImage}
          alt="Processed"
          width={width}
          height={height}
          style={{ maxWidth: '100%', marginTop: '20px' }}
          className="ai-bg-remover__image"
        />
      )}

      {allowDownload && processedImage && (
        <div className="ai-bg-remover__download-buttons">
          {showButtons!.download && (
            downloadButton ? (
              // If a custom download button is provided, render it
              React.cloneElement(downloadButton as any, {
                onClick: () => downloadImage(processedImage!, imageName!),
                className: `ai-bg-remover__download-button ${(downloadButton as any).props.className}`
              })
            ) : (
              // Default download button
              <button
                className="ai-bg-remover__download-button"
                type="button"
                onClick={() =>
                  downloadImage(processedImage!, imageName!)
                }
              >
                Download Image
              </button>
            )
          )}

          {showButtons!.downloadMask && maskImage && (
            downloadMaskButton ? (
              // If a custom mask download button is provided, render it
              React.cloneElement(downloadMaskButton as any, {
                onClick: () => downloadImage(maskImage!, maskImageName!),
                className: `ai-bg-remover__download-mask-button ${(downloadMaskButton as any).props.className}`
              })
            ) : (
              // Default mask download button
              <button
                className="ai-bg-remover__download-mask-button"
                type="button"
                onClick={() =>
                  downloadImage(maskImage!, maskImageName!)
                }
              >
                Download Mask
              </button>
            )
          )}
        </div>
      )}

      {processedImage && (
        showButtons!.download && (
          clearButton ? (
            // If a custom download button is provided, render it
            React.cloneElement(clearButton as any, {
              onClick: clearImages,
              className: `ai-bg-remover__clear-button ${(clearButton as any).props.className}`
            })
          ) : (
            // Default download button
            <button
              className="ai-bg-remover__clear-button"
              type="button"
              onClick={clearImages}
            >
              Clear Image
            </button>
          )
        )
      )}
    </div>
  );
};

export default BackgroundRemover;
