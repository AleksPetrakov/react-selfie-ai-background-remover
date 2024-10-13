# react-selfie-ai-background-remover

`react-selfie-ai-background-remover` is a React component that automatically removes the background from images using TensorFlow.js and the MediaPipe Selfie Segmentation model. It provides an easy-to-use interface for users to upload an image, process it to remove the background, and download the result.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Properties](#properties)
    - [Basic Properties](#basic-properties)
    - [Button Customization](#button-customization)
    - [Processing Options](#processing-options)
- [Styling Customization](#styling-customization)
    - [CSS Classes](#css-classes)
    - [Example Styling](#example-styling)
- [Events](#events)
    - [onProcessComplete](#onprocesscomplete)
    - [onError](#onerror)
- [Dependencies](#dependencies)
- [License](#license)
- [Author](#author)
- [Contribution](#contribution)
- [Support](#support)
- [Acknowledgements](#acknowledgements)
- [Links](#links)

## Features

- **Automatic Background Removal**: Utilizes the MediaPipe Selfie Segmentation model to remove backgrounds from images containing a single person.
- **Customizable Buttons**: Allows you to provide custom upload, download, mask download, and clear buttons.
- **Flexible Styling**: Offers CSS class names for extensive styling customization.
- **Configurable Properties**: Supports various properties to control behavior and appearance.

## Installation

Install the package via npm:

```bash
npm install react-selfie-ai-background-remover
```

or via yarn:

```bash
yarn add react-selfie-ai-background-remover
```

## Usage

Here's how to use the `BackgroundRemover` component and `OnProcessCompleteResult, BackgroundRemoverProps, ShowButtonsProps` interfaces in your React application:

```jsx
import React from 'react';
import BackgroundRemover, { OnProcessCompleteResult, BackgroundRemoverProps, ShowButtonsProps } from 'react-selfie-ai-background-remover';

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
      <h1>Example of usage React Selfie Background Remover</h1>
      <BackgroundRemover
        onProcessComplete={handleProcessComplete}
        onError={handleError}
        allowDownload={true}
      />
    </div>
  );
}

export default App;
```

## Properties

BackgroundRemoverProps is the interface for the properties of the BackgroundRemover component.


### Basic Properties

| Property              | Type                                                                                 | Default                     | Description                                                                                                                                                             |
|-----------------------|--------------------------------------------------------------------------------------|-----------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `width`               | `number`                                                                             | `undefined`                 | Width of the processed image displayed.                                                                                                                                 |
| `height`              | `number`                                                                             | `undefined`                 | Height of the processed image displayed.                                                                                                                                |
| `onProcessComplete`   | `(result: { originalImage: string; processedImage: string; maskImage: string; }) => void` | `undefined`                 | Callback function called when processing is complete. Receives an object containing URLs to the original image, processed image, and mask image. Implements `OnProcessCompleteResult` interface.                  |
| `onError`             | `(error: any) => void`                                                               | `undefined`                 | Callback function called when an error occurs during processing. Receives the error object.                                                                              |
| `allowDownload`       | `boolean`                                                                            | `false`                     | If `true`, enables the download buttons for the processed image and mask image.                                                                                         |
| `style`               | `React.CSSProperties`                                                                | `{}`                        | Inline styles applied to the root component.                                                                                                                            |
| `className`           | `string`                                                                             | `''`                        | Additional CSS class applied to the root component.                                                                                                                     |

### Button Customization

| Property               | Type          | Default | Description                                                                                                                                                                                                                          |
|------------------------|---------------|---------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `uploadButton`         | `ReactNode`   | `null`  | Custom element to replace the default upload button. If not provided, a default button with the text "Upload Image" is used.                                                                                                         |
| `downloadButton`       | `ReactNode`   | `null`  | Custom element to replace the default download button for the processed image. If not provided, a default button with the text "Download Image" is used.                                                                              |
| `downloadMaskButton`   | `ReactNode`   | `null`  | Custom element to replace the default download button for the mask image. If not provided, a default button with the text "Download Mask" is used.                                                                                    |
| `clearButton`          | `ReactNode`   | `null`  | Custom element to replace the default clear button to reset the component. If not provided, a default button with the text "Clear Image" is used.                                                                                     |
| `showButtons`          | `object`      | `{ upload: true, download: true, downloadMask: true, clear: true }` | Object to control the visibility of the buttons. Set `upload`, `download`, `downloadMask`, or `clear` to `false` to hide the respective button. Implements `ShowButtonsProps` interface.                                               |

### Processing Options

| Property         | Type      | Default             | Description                                                                                                                                                          |
|------------------|-----------|---------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `hasSmoothEdges` | `boolean` | `true`              | If `true`, applies smoothing to the edges of the processed image for a better visual result.                                                                          |
| `isInverted`     | `boolean` | `false`             | If `true`, inverts the mask, which can be useful if you want to remove the foreground instead of the background.                                                     |
| `imageName`      | `string`  | `'processed-image'` | The filename used when downloading the processed image.                                                                                                              |
| `maskImageName`  | `string`  | `'mask-image'`      | The filename used when downloading the mask image.                                                                                                                   |

## Styling Customization

### CSS Classes

You can customize the styles of the component by targeting the following CSS classes:

- `.ai-bg-remover`: Root element of the component.
- `.ai-bg-remover__file-input`: The hidden file input element.
- `.ai-bg-remover__upload-button`: The upload button wrapper.
- `.ai-bg-remover__canvas`: The hidden canvas element used for processing.
- `.ai-bg-remover__image`: The processed image element.
- `.ai-bg-remover__download-buttons`: Wrapper for the download buttons.
- `.ai-bg-remover__download-button`: The download processed image button.
- `.ai-bg-remover__download-mask-button`: The download mask image button.
- `.ai-bg-remover__clear-button`: The clear image button.

### Example Styling

```css
/* Custom styles for the BackgroundRemover component */

.ai-bg-remover {
  text-align: center;
  margin: 20px;
}

.ai-bg-remover__upload-button {
  cursor: pointer;
  margin-bottom: 20px;
}

.ai-bg-remover__image {
  max-width: 100%;
  margin-top: 20px;
}

.ai-bg-remover__download-buttons {
  margin-top: 20px;
}

.ai-bg-remover__download-button,
.ai-bg-remover__download-mask-button,
.ai-bg-remover__clear-button {
  margin: 5px;
}
```

## Events

### onProcessComplete

Called when the image processing is complete.

```jsx
const handleProcessComplete = ({ originalImage, processedImage, maskImage }) => {
  console.group('Process Complete');
  console.dir({ originalImage, processedImage, maskImage });
};

<BackgroundRemover
  onProcessComplete={handleProcessComplete}
/>
```

### onError

Called when an error occurs during image processing.

```jsx
const handleError = (error) => {
  console.error('Error: ', error);
};

<BackgroundRemover
  onError={handleError}
/>
```

## Dependencies

- **TensorFlow.js**: Uses `@tensorflow/tfjs` and `@tensorflow-models/body-segmentation` for processing images.
    - Specifically uses the [MediaPipe Selfie Segmentation model](https://github.com/tensorflow/tfjs-models/tree/master/body-segmentation) for background removal.
- **React**: Requires React 16.8 or higher for hooks support.

## License

This project is licensed under the MIT License.

## Author

- **GitHub**: [AleksPetrakov](https://github.com/AleksPetrakov)
- **LinkedIn**: [Aleksandr Petrakov](https://www.linkedin.com/in/agpetrakov/)

## Contribution

Contributions are welcome! Please open an issue or submit a pull request on GitHub.

## Support

If you encounter any issues or have questions, feel free to open an issue on the GitHub repository.

## Acknowledgements

- [TensorFlow.js](https://www.tensorflow.org/js) for providing the machine learning models.
- [MediaPipe Selfie Segmentation Model](https://github.com/tensorflow/tfjs-models/tree/master/body-segmentation) for the segmentation functionality.
- [React](https://reactjs.org/) for the UI framework.

## Links

- **GitHub Repository**: [https://github.com/AleksPetrakov/react-selfie-ai-background-remover](https://github.com/AleksPetrakov/react-selfie-ai-background-remover)
- **NPM Package**: [https://www.npmjs.com/package/react-selfie-ai-background-remover](https://www.npmjs.com/package/react-selfie-ai-background-remover)

---

Feel free to customize the component further and adapt it to your specific needs!
