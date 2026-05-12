# Max. Epochen

„Max Epochs“ ist die maximale Anzahl vollständiger **Trainingsdurchläufe**. In einer Epoche verarbeitet das Modell den gesamten Trainingsdatensatz einmal und passt seine unbekannten Parameter anhand dessen an, was es gelernt hat. Mehr Epochen geben dem Modell mehr Möglichkeiten, sich zu verbessern, aber zu viele können dazu führen, dass es sich zu stark an die Trainingsdaten anpasst (sogenanntes **_Overfitting_**).

# Lernrate

Die Learning Rate steuert, wie stark das Modell seine unbekannten Parameter in jeder Epoche verändert. Eine höhere Learning Rate führt zu größeren Änderungen und kann das Training beschleunigen, kann das Lernen aber auch instabil machen. Eine niedrigere Learning Rate führt zu kleineren Änderungen und sorgt meist für ein vorsichtigeres Lernen, dafür kann das Training länger dauern.

# Early Stopping

Early Stopping ist eine Methode, die das Training automatisch beendet, wenn sich das Modell nicht mehr ausreichend verbessert. Das spart Zeit und verhindert **_Overfitting_**.
