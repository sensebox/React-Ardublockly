// src/components/Pages/TeachableSensebox/translations/en.js
export const teachableSenseboxTranslations_en = {
  landing: {
    title: "Machine Learning",
    sections: {
      topic: "Topic",
      hardware: "Hardware",
      context: "Context",
      examples: "For example:",
    },
    imageCard: {
      title: "Images",
      topic:
        "Supervised learning (training, testing), compression and deployment",
      hardware: "Camera of the senseBox MCU Eye or your own Webcam",
      context:
        "Image classification is an established field of computer science and is used in many ways in everyday life.",
      contextExamples: {
        selfDrivingCar:
          "Self-driving cars recognise pedestrians, crosswalks and traffic signs.",
        faceRecognition: "Smartphones are unlocked using face recognition.",
        textRecognition: "Mail sorting machines read handwritten addresses.",
      },
      button: "Get Started",
    },
    accelerationCard: {
      title: "Spells",
      topic: "Convolutional Neural Networks",
      hardware: "Acceleration sensor of the senseBox MCU Eye",
      context:
        "While recognising 'spells' is an unusual use case, it essentially belongs to the broad field of classifying movements or activities.",
      contextExamples: {
        smartwatch:
          "Smartwatches recognise whether you are walking, running or cycling.",
      },
      button: "Get Started",
    },
    orientationCard: {
      title: "Orientations",
      topic: "Decision trees and neural networks",
      hardware: "Acceleration sensor of the senseBox MCU Eye",
      context:
        "Recognising orientations and alignments can be used, for example, to determine whether a parcel was stored the right way up.",
      contextImageAlt: "Parcel with a “This side up” label",
      contextAfterImage:
        "This does not necessarily require a machine learning model, but since both the sensor data and the possible orientations are simple, they are well suited for teaching about basic model structures.",
      button: "Get Started",
    },
    tutorials: {
      title: "Tutorials",
      viewTutorial: "View Tutorial",
    },
  },
};
