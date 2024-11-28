export const phyphoxInit = {
  kind: "block",
  type: "sensebox_phyphox_init",
};

export const phyphoxExperiment = {
  kind: "block",
  type: "sensebox_phyphox_experiment",
  inputs: {
    view: {
      block: {
        kind: "block",
        type: "sensebox_phyphox_graph",
        inputs: {
          channel0: {
            block: {
              kind: "block",
              type: "sensebox_phyphox_timestamp",
            },
          },
          channel1: {
            block: {
              kind: "block",
              type: "sensebox_phyphox_channel",
            },
          },
        },
      },
    },
  },
};

export const phyphoxExperimentSend = {
  kind: "block",
  type: "sensebox_phyphox_experiment_send",
  inputs: {
    sendValues: {
      block: {
        kind: "block",
        type: "sensebox_phyphox_sendchannel",
      },
    },
  },
};

export const phyphoxGraph = {
  kind: "block",
  type: "sensebox_phyphox_graph",
};

export const phyphoxTimestamp = {
  kind: "block",
  type: "sensebox_phyphox_timestamp",
};

export const phyphoxChannel = {
  kind: "block",
  type: "sensebox_phyphox_channel",
};

export const phyphoxSendChannel = {
  kind: "block",
  type: "sensebox_phyphox_sendchannel",
};

export default {
  mcu: [
    phyphoxInit,
    phyphoxExperiment,
    phyphoxExperimentSend,
    phyphoxGraph,
    phyphoxTimestamp,
    phyphoxChannel,
    phyphoxSendChannel,
  ],
  mini: [
    phyphoxInit,
    phyphoxExperiment,
    phyphoxExperimentSend,
    phyphoxGraph,
    phyphoxTimestamp,
    phyphoxChannel,
    phyphoxSendChannel,
  ],
  esp32: [
    phyphoxInit,
    phyphoxExperiment,
    phyphoxExperimentSend,
    phyphoxGraph,
    phyphoxTimestamp,
    phyphoxChannel,
    phyphoxSendChannel,
  ],
};
