import * as Blockly from 'blockly/core';


export const FaqQuestions = () => {
  return (
    [
      {
        question: `${Blockly.Msg.faq_q1_question}`,
        answer: `${Blockly.Msg.faq_q1_answer}`,
      },
      {
        question: `${Blockly.Msg.faq_q2_question}`,
        answer: `${Blockly.Msg.faq_q2_answer}`,
      },
      {
        question: `${Blockly.Msg.faq_q3_question}`,
        answer: `${Blockly.Msg.faq_q3_answer}`,
      },

    ])
}