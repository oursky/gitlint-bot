import { DiagnosisResults } from "types/rules";

export default {
  name: "header-max-length",
  score: 5,
  diagnose: (message: string): DiagnosisResults => {
    const valid = message.length < 50;
    return {
      valid,
      data: {},
    };
  },
};
