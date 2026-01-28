# Teachable Machine Integration

This feature allows users to train their own machine learning models using Google's Teachable Machine approach and integrate them into their senseBox projects.

## Features

### 1. Model Training (`ModelTrainer.jsx`)
- **Camera Integration**: Access device camera for image capture
- **Class Management**: Create and manage different classes for classification
- **Sample Collection**: Capture multiple images per class for training
- **Model Training**: Train a CNN model using TensorFlow.js
- **Real-time Feedback**: Progress indicators and training status

### 2. Model Testing (`ModelTester.jsx`)
- **Live Prediction**: Real-time predictions using the trained model
- **Confidence Scores**: Display prediction confidence for each class
- **Visual Feedback**: Live camera feed with prediction overlay

### 3. Blockly Integration (`BlocklyIntegration.jsx`)
- **Model Export**: Save trained models for use in Blockly
- **Block Generation**: Generate custom Blockly blocks for the model
- **Code Integration**: Seamless integration with existing senseBox workflows

## Blockly Blocks

The integration provides several custom blocks:

1. **Setup Teachable Machine**: Initialize a model for predictions
2. **Camera Capture**: Capture images from the camera
3. **Make Prediction**: Get classification results from the model
4. **Get Confidence**: Retrieve confidence scores for specific classes

## Technical Implementation

### Dependencies
- **TensorFlow.js**: For machine learning model training and inference
- **Material-UI**: For user interface components
- **Blockly**: For visual programming integration

### Model Architecture
- Convolutional Neural Network (CNN)
- Input: 224x224x3 images
- Architecture: Conv2D → MaxPool → Conv2D → MaxPool → Dense → Dropout → Output
- Training: Adam optimizer, categorical crossentropy loss

### Browser Compatibility
- Requires modern browser with WebRTC support for camera access
- WebGL support recommended for optimal TensorFlow.js performance

## Usage Flow

1. **Training Phase**:
   - Add classes (e.g., "Apple", "Orange")
   - Capture sample images for each class
   - Train the model with collected data

2. **Testing Phase**:
   - Test model accuracy with live camera feed
   - Verify predictions and confidence scores

3. **Integration Phase**:
   - Save model for Blockly use
   - Generate corresponding blocks
   - Use in senseBox projects

## File Structure

```
TeachableMachine/
├── TeachableMachine.jsx      # Main component
├── ModelTrainer.jsx          # Training interface
├── ModelTester.jsx           # Testing interface
├── BlocklyIntegration.jsx    # Blockly integration
├── TeachableMachine.css      # Styling
└── README.md                 # Documentation
```

## Future Enhancements

- Support for different model architectures
- Pre-trained model templates
- Cloud model storage and sharing
- Advanced training parameters
- Mobile device optimization