import BackgroundRemover, { OnProcessCompleteResult, BackgroundRemoverProps, ShowButtonsProps } from './components/BackgroundRemover';

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
      />
    </div>
  );
}

export default App;
