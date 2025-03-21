// grpcClient.js
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

// Lade die Compile-Proto-Datei (Pfad anpassen)
const packageDefinition = protoLoader.loadSync("protos/compile.proto", {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);
// Navigiere in der Proto-Hierarchie; passe den Namespace an, wie in der Dokumentation beschrieben.
const ArduinoCoreService =
  protoDescriptor.cc.arduino.cli.commands.v1.ArduinoCoreService;

// Erstelle einen Client, der mit dem gRPC-Dienst kommuniziert (Adresse ggf. anpassen)
const client = new ArduinoCoreService(
  "localhost:50051",
  grpc.credentials.createInsecure(),
);

module.exports = client;
