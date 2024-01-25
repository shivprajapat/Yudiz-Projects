import React, { useState } from 'react'
import { Container } from 'react-bootstrap'
import Accordion from 'react-bootstrap/Accordion'
import './index.scss'

const Faq = () => {
  const [selectedQuestion, setSelectedQuestion] = useState(null)
  const faqSample = [
    {
      question: 'What other solutions have you considered?',
      answer: 'Use this question not only to gain information about who you are competing with for the sale but also as a springboard to differentiate your product or service from others by bringing up your solution’s unique selling points.'
    },
    {
      question: 'Does our solution meet your needs?',
      answer: 'Pitching a product or service to a prospect who can’t use it is just wasting everyone’s time. Sometimes potential customers will respond to this question by saying your solution doesn’t include this or that feature when, in fact, it does. This gives you the chance to clear up any misunderstandings.'
    },
    {
      question: 'What other solutions have you considered?',
      answer: 'Use this question not only to gain information about who you are competing with for the sale but also as a springboard to differentiate your product or service from others by bringing up your solution’s unique selling points.'
    },
    {
      question: 'Who will be involved in making the decision?',
      answer: 'Are you talking with the decision maker who can actually buy what you are selling? You better be, or you are wasting your time. Asking this question clues you in on the person you really should be talking with at the company.'
    },
    {
      question: 'What is the best way to include everyone involved in the decision making process?',
      answer: 'Dealing with multiple decision makers complicates closing a sale for everyone. Discussing with your contact person the best way to engage everyone at the same time can speed up the sales process.'
    },
    {
      question: 'What’s your budget?',
      answer: 'Money matters, and if the cost of your solution is more than the company’s budget, you may just be banging your head against the wall. Understanding the amount of money a business can spend as early as possible in the sales funnel lets you either bow out gracefully or concentrate on showing why your prospect can’t afford not to buy from you.'
    },
    {
      question: 'What factors will you use to make your decision?',
      answer: 'Finding out the criteria used to make buying decisions will give a leg up when it comes to making the sale. Once you know the guidelines the company uses for making purchases, you can create sales presentations to address them all.'
    },
    {
      question: 'What is your timeline for implementation?',
      answer: 'Finding out the criteria used to make buying decisions will give a leg up when it comes to making the sale. Once you know the guidelines the company uses for making purchases, you can create sales presentations to address them all.'
    },
    {
      question: 'What factors will you use to make your decision?',
      answer: 'How soon after making a purchase does the company need to implement your solution?  If your prospect needs an immediate solution, talk to him about how your solution can help to meet this deadline.'
    },
    {
      question: 'When will you be making a decision?',
      answer: 'Is your potential customer looking to buy immediately, or are they just gathering information to make a purchase sometime in the future? Prospects who want to buy now should take priority over those who are ‘just looking.'
    },
    {
      question: 'Is there anything else we need to discuss?',
      answer: `Sale talks can stall when a prospect has concerns or questions, but fails to address them. When you ask this question, you are giving a prospect permission to bring up anything he is thinking about.
      What are the next steps?
      
      Always make sure you know what your prospect will do next so you will have a higher chance of closing a sale. Why take a guess at your potential customer’s next move when you can simply ask?
      
      With these ten questions in your back pocket to pull out whenever a sales discussion slows down, you will close more deals than ever before. Learn more about SOCO Academy which provides the e-learning training needed to move a sale forward. `
    }
  ]

  return (
    <div className="faq-main-page">
      <div className="heading">
        <h3>FAQ</h3>
      </div>
      <Container fluid activeKey={selectedQuestion} className='px-4'>
        <Accordion flush>
          {
            faqSample.map((item, key) => {
              return (
                <Accordion.Item eventKey={key} key={key} onClick={() => setSelectedQuestion(key)}>
                  <Accordion.Header bsPrefix='faq-header'>
                    {item.question}
                  </Accordion.Header>
                  <Accordion.Body>
                    {item.answer}
                  </Accordion.Body>
                </Accordion.Item>
              )
            })
          }
        </Accordion>
      </Container>
    </div>
  )
}

export default Faq
