import BackgroundRemover, { OnProcessCompleteResult, BackgroundRemoverProps, ShowButtonsProps } from './BackgroundRemover';

function App() {
  const handleProcessComplete = ({ originalImage, processedImage, maskImage }: OnProcessCompleteResult) => {
    console.group('Process Complete')
    console.dir({ originalImage, processedImage, maskImage })
  };

  const handleError = (error: unknown) => {
    console.error('Error: ', error);
  };

  return (
    <div className="wrapper">
      <h1>React Selfie Background Remover</h1>
      <BackgroundRemover
        onProcessComplete={handleProcessComplete}
        onError={handleError}
        allowDownload={true}
        uploadButton={<button className="custom-class-name-1">Custom Upload Image</button>}
        downloadButton={<button className="custom-class-name-2">Custom Download Image</button>}
        downloadMaskButton={<button className="custom-class-name-3">Custom Download Mask</button>}
        clearButton={<button className="custom-class-name-4">Custom Clear</button>}
      />
    </div>
  );
}

export default App;
