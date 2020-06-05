import { DiagnosisResults } from "types/rules";

export default {
  score: 5,
  diagnose: (message: string): DiagnosisResults => {
    const valid = message.length < 50;
    return {
      valid,
      data: {},
    };
  },
};
