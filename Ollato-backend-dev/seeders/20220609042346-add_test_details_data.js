'use strict'
const { randomStr } = require('../helper/utilities.services')
const config = require('../config/config-file')

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    const { sequelize } = queryInterface
    try {
      await sequelize.transaction(async (transaction) => {
        const options = { transaction }
        await sequelize.query('SET FOREIGN_KEY_CHECKS = 0', options)
        await sequelize.query('TRUNCATE TABLE test_details', options)
        await sequelize.query('SET FOREIGN_KEY_CHECKS = 1', options)
      })
    } catch (error) {
      console.log(error)
    }
    await queryInterface.bulkInsert('test_details', [
      {
        custom_id: randomStr(8, 'string'),
        test_id: 1,
        title: 'Verbal Reasoning',
        sub_test_abb: 'VR',
        no_of_questions: 20,
        no_options: 5,
        meaning: 'The Verbal Reasoning test assesses your ability to comprehend words and sentences and deduce meaningful relationships from them. It is important for any work involving communication of ideas or the interpretation of written information.',
        synopsis: 'You are able to comprehend and analytically work through problems, concepts or situations expressed in words mainly in the form of analogies.',
        description: `<section class="insrt-section">
                      <div class="page-title"><div class="page-header"><h1>Verbal Reasoning</h1></div></div>
                      <div class="page-content">
                          <h2>Instructions</h2>
                          <div class="text-box">
                              <p>This test assesses the ability to reason with words. Each statement has two words missing – the first word and the last word. There are five options given; a, b, c, d and e. Each option has a pair of words that is related to the sentence in some way. The first word of the pair should fit at the beginning of the sentence and second word should fit at the end of the sentence. Select the option a, b, c, d, or e indicating the answer you want to choose. Please note, there is only one correct answer for each question.</p>
                          </div>
                          <p>Look at Example A
                          </p>
                          <p>E.g. A __________is to Madhya Pradesh as U.S. is to__________</p>
                          <ul class="ullist">
                              <li data-title="a)">U.P. - New York</li>
                              <li data-title="b)">P.B. - Norway</li>
                              <li data-title="c)">M.P. - United States</li>
                              <li data-title="d)">U.K. - Uzbekistan</li>
                              <li data-title="e)">R.T. - United Kingdom</li>
                          </ul>
                          <div class="text-box">
                              <p>In order to choose the correct answer for example A, look carefully at each pair of words. Only one pair of words will complete the sentence so that the first two words are related to each other in the same way as the last two words.
                              </p>
                              <p>The answer is option C because Madhya Pradesh and U.S. are related in the same way as M.P. and United States. i.e., the abbreviation of Madhya Pradesh is M.P. and United States is U.S.</p>
                          </div>
                          <p>Look at Example B</p>
                          <p>E.g. B __________is to meow as dog is to__________</p>
                          <ul class="ullist">
                              <li data-title="a)">Cat - Bark</li>
                              <li data-title="b)">Bark - Cat</li>
                              <li data-title="c)">Scratch - Bite</li>
                              <li data-title="d)">Kitten - Puppy</li>
                              <li data-title="e)">Purr - Bark
                              </li>
                          </ul>
                          <div class="text-box">
                              <p>In order to choose the correct answer for example B, look carefully at each pair of words. Only one pair of words will complete the sentence so that the first two words are related to each other in the same way as the last two words.
                              </p>
                              <p>The answer is option A because meow and dog are related in the same way as cat and bark i.e., a cat makes 'meow' sound and a dog makes 'barking' sound.</p>
                          </div>
                      </div>
                  </section>`,
        is_active: 'y',
        sort_order: 1,
        created_at: new Date(),
        updated_at: new Date(),
        created_by: 'admin',
        updated_by: 'admin'
      },
      {
        custom_id: randomStr(8, 'string'),
        test_id: 1,
        title: 'Numerical Reasoning',
        sub_test_abb: 'NR',
        no_of_questions: 25,
        no_options: 5,
        meaning: 'The Numerical Reasoning test assesses your ability to grasp mathematical concepts and use them to analyze and solve mathematical problems. It measures your ability to interpret, analyze and draw logical conclusions based on numerical data.',
        synopsis: 'You are able to use numerical data in order to interpret, analyse and draw reasoned logical conclusions.',
        description: `<section class="insrt-section">
              <div class="page-title"><div class="page-header"><h1>Numerical Reasoning</h1></div></div>
              <div class="page-content">
                  <h2>Instructions</h2>
                  <div class="text-box">
                      <p>This test assesses the ability to reason with numbers. Read each problem carefully. There are five options given; a, b, c, d and e. Look at the options listed and decide which is the correct answer. Use of calculator/s is not allowed. If necessary, work out your answer on a rough paper. Select the option a, b, c, d or e indicating the answer you want to choose. Some of the problems have no correct answer listed; if so, select the option 'e' next to 'None of the above'.
                      </p>
                  </div>
                  <p>Look at Example A
                  </p>
                  <p>E.g. A What number should replace P in this addition example?
                  </p>
                  <p class="math-text"><span>&nbsp;&nbsp;6P</span><span>+ 02</span><span class="divider"></span><span>&nbsp;&nbsp;66</span></p>
                  <ul class="ullist">
                      <li data-title="a)">01</li>
                      <li data-title="b)">02</li>
                      <li data-title="c)">03</li>
                      <li data-title="d)">04</li>
                      <li data-title="e)">None of the above</li>
                  </ul>
                  <div class="text-box">
                      <p>In Example A, 6P + 02 equals 66, and only 4 can replace the letter P for the equation to add upto 66. Since 4 is not listed among the choices given, the answer is option e, 'None of the above'.
                      </p>
                  </div>
                  <p>Look at Example B</p>
                  <p>E.g. A What is the answer to this equation?</p>
                  <p>7 - 13 = ?</p>
                  <ul class="ullist">
                      <li data-title="a)">-13 +7</li>
                      <li data-title="b)">13 - 7</li>
                      <li data-title="c)">-(7 - 13)</li>
                      <li data-title="d)">-(13+7) </li>
                      <li data-title="e)">None of the above
                      </li>
                  </ul>
                  <div class="text-box">
                      <p>In Example B, the correct answer is option A because 7-13 equals to -6 & -13 + 7  also equals to -6.
                      </p>
                  </div>
              </div>
          </section>`,
        is_active: 'y',
        sort_order: 2,
        created_at: new Date(),
        updated_at: new Date(),
        created_by: 'admin',
        updated_by: 'admin'
      },
      {
        custom_id: randomStr(8, 'string'),
        test_id: 1,
        title: 'Abstract Reasoning',
        sub_test_abb: 'AR',
        no_of_questions: 19,
        no_options: 5,
        meaning: 'The Abstract Reasoning test assesses your ability to work with new concepts and abstract ideas. Perceiving patterns among complex elements, identifying relation between them and using this information to solve problems is a measure of abstract ability.',
        synopsis: 'You are able to analyse information, detect patterns and associations, and resolve problems given in geometric figures or design format.',
        description: `<section class="insrt-section">
                        <div class="page-title"><div class="page-header"><h1>Abstract Reasoning</h1></div></div>
                        <div class="page-content">
                            <h2>Instructions</h2>
                            <div class="text-box">
                                <p>This test assesses the ability to reason with figures or designs. Each question has four Problem Figures (on the left-hand side) and five Answer Figures (on the right-hand side). The four Problem Figures follow a logical rule to form a series. There are five options given; a, b, c, d and e. You have to select one option (a, b, c, d or e) from the Answer Figures that would be next in the series (or the fifth one in the series).
                                </p>
                            </div>
                            <p>Look at Example A
                            </p>
                            <p>E.g. A </p>
                            <img src="${config.DEPLOY_HOST_URL}/uploads/ollato-images/abs-img-1.png
                            " alt="">
                            <div class="text-box">
                                <p>In example A you can see that the arrow is moving 90° clockwise. So which answer figure would be the next figure (or the 5th one) in this series? The answer is option D because the next position for the arrow should be 90° to the right of the 4th figure. 
                                </p>
                            </div>
                            <p>Look at Example B</p>
                            <p>B E.g. B
                            </p>
                            <img src="${config.DEPLOY_HOST_URL}/uploads/ollato-images/abs-img-2.png
                            " alt="">
                            <div class="text-box">
                                <p>In example B you can see that the shaded plus sign is alternating with the non-shaded cross sign. So which answer figure would be the next figure (or the 5th one) in this series? The answer is option B because the next sign should be the shaded plus sign.
                                </p>
                            </div>
                        </div>
                    </section>`,
        is_active: 'y',
        sort_order: 3,
        created_at: new Date(),
        updated_at: new Date(),
        created_by: 'admin',
        updated_by: 'admin'
      },
      {
        custom_id: randomStr(8, 'string'),
        test_id: 1,
        title: 'Perceptual Speed & Accuracy 1',
        sub_test_abb: 'PsA1',
        no_of_questions: 50,
        no_options: 5,
        meaning: 'The Perceptual Speed and Accuracy test assesses your ability to concentrate, pay attention to detail and process information quickly. It measures how accurately and quickly can you compare similarities and differences among sets of pictures, patterns, objects, letters or numbers.',
        synopsis: 'You are efficiently able to compare different sets of information with speed and accuracy.',
        description: `<section class="insrt-section">
                        <div class="page-title"><div class="page-header"><h1>Perceptual Speed and Accuracy</h1></div></div>
                        <div class="page-content">
                            <h2>Instructions</h2>
                            <div class="text-box">
                                <p>This test assesses speed and accuracy by analysing how quickly and correctly one can compare letter/number combinations. There are two parts to this test, Part 1 and Part 2. The problems will appear on the left side of the screen. Each problem contains 5 letter/number combinations of which one is underlined. These 5 combinations also appear on the right side of your screen but in a different order. Your task is to look at the underlined combination on the left, then find and select the same combination on the right.
                                </p>
                            </div>
                            <p>Look at the examples. These examples have been marked correctly on your answer sheet. 
                            </p>
                            <img src="${config.DEPLOY_HOST_URL}/uploads/ollato-images/p-s-a-img.png
                            " alt="">
                            <div class="text-box">
                                <p>You will have 1 minute 30 seconds for each part of this test. Work as quickly and as accurately as you can. Remember, the letter/number combination that you select must be exactly the same as the one that is underlined on the left side of your screen.
                                </p>
                            </div>
                        </div>
                    </section>`,
        is_active: 'y',
        sort_order: 4,
        created_at: new Date(),
        updated_at: new Date(),
        created_by: 'admin',
        updated_by: 'admin'
      },
      {
        custom_id: randomStr(8, 'string'),
        test_id: 1,
        title: 'Perceptual Speed & Accuracy 2',
        sub_test_abb: 'PsA2',
        no_of_questions: 50,
        no_options: 5,
        meaning: 'The Perceptual Speed and Accuracy test assesses your ability to concentrate, pay attention to detail and process information quickly. It measures how accurately and quickly can you compare similarities and differences among sets of pictures, patterns, objects, letters or numbers.',
        synopsis: 'You are efficiently able to compare different sets of information with speed and accuracy.',
        description: `<section class="insrt-section">
                      <div class="page-title"><div class="page-header"><h1>Perceptual Speed and Accuracy</h1></div></div>
                      <div class="page-content">
                          <h2>Instructions</h2>
                          <div class="text-box">
                              <p>This test assesses speed and accuracy by analysing how quickly and correctly one can compare letter/number combinations. There are two parts to this test, Part 1 and Part 2. The problems will appear on the left side of the screen. Each problem contains 5 letter/number combinations of which one is underlined. These 5 combinations also appear on the right side of your screen but in a different order. Your task is to look at the underlined combination on the left, then find and select the same combination on the right.
                              </p>
                          </div>
                          <p>Look at the examples. These examples have been marked correctly on your answer sheet. 
                          </p>
                          <img src="${config.DEPLOY_HOST_URL}/uploads/ollato-images/p-s-a-img.png
                          " alt="">
                          <div class="text-box">
                              <p>You will have 1 minute 30 seconds for each part of this test. Work as quickly and as accurately as you can. Remember, the letter/number combination that you select must be exactly the same as the one that is underlined on the left side of your screen.
                              </p>
                          </div>
                      </div>
                  </section>`,
        is_active: 'y',
        sort_order: 5,
        created_at: new Date(),
        updated_at: new Date(),
        created_by: 'admin',
        updated_by: 'admin'
      },
      {
        custom_id: randomStr(8, 'string'),
        test_id: 1,
        title: 'Mechanical Reasoning',
        sub_test_abb: 'MR',
        no_of_questions: 15,
        no_options: 3,
        meaning: 'The Mechanical Reasoning test assesses your ability to understand basic mechanical principles of machinery, tools and motion. It measures your ability to understand and apply mechanical concepts and principles to solve problems.',
        synopsis: 'You are able to understand and apply mechanical and physical principles to solve problems.',
        description: `<section class="insrt-section">
                      <div class="page-title"><div class="page-header"><h1>Mechanical Reasoning</h1></div></div>
                      <div class="page-content">
                          <h2>Instructions</h2>
                          <div class="text-box">
                              <p>This test assesses one's understanding of physical and mechanical concepts. In this test you have to read each question and look at the accompanying figure/s carefully. There are three options given; A, B and C. You must select one of the three options (A, B or C) that you think is correct.
                              </p>
                          </div>
                          <p>Look at example A
                          </p>
                          <p>E.g. A Which ball will reach the ground first?
                          </p>
                          <img src="${config.DEPLOY_HOST_URL}/uploads/ollato-images/m-img-1.png
                          " alt="">
                          <ul class="ullist">
                              <li data-title="A">A</li>
                              <li data-title="B">B</li>
                              <li data-title="C">Equal Time</li>
                          </ul>
                          <div class="text-box">
                              <p>Example A shows two pictures that look similar. However, one detail is different. In picture A the slope is steeper compared to the picture B. Steeper the slope higher the acceleration, hence ball A will reach the ground first. So circle option A.
                              </p>
                          </div>
                          <p>Look at Example B</p>
                          <p>E.g. B Which weighs more?
                          </p>
                          <img src="${config.DEPLOY_HOST_URL}/uploads/ollato-images/m-img-2.png
                          " alt="">
                          <ul class="ullist">
                              <li data-title="A">A</li>
                              <li data-title="B">B</li>
                              <li data-title="C">Equal Time</li>
                          </ul>
                          <div class="text-box">
                              <p>Example B asks which weighs more? As the scale is perfectly balanced A and B must weigh the same. So, circle option C (equal).
                              </p>
                          </div>
                      </div>
                  </section>`,
        is_active: 'y',
        sort_order: 6,
        created_at: new Date(),
        updated_at: new Date(),
        created_by: 'admin',
        updated_by: 'admin'
      },
      {
        custom_id: randomStr(8, 'string'),
        test_id: 1,
        title: 'Space Relations',
        sub_test_abb: 'SR',
        no_of_questions: 21,
        no_options: 4,
        meaning: 'The Space Relations test assesses the ability to manipulate shapes in 2-dimension or to visualize a 3-dimensional object from 2-dimensional pattern if rotated at different angles in space.',
        synopsis: 'You are able to understand complex plans and shapes, while being able to manipulate two and three dimensional shapes and spotting patterns or relationships between them.',
        description: `<section class="insrt-section">
                      <div class="page-title"><div class="page-header"><h1>Space Relations</h1></div></div>
                      <div class="page-content">
                          <h2>Instructions</h2>
                          <div class="text-box">
                              <p>This test assesses the ability to understand and manipulate 3 dimensional (3D) figures. It consists of patterns with shading or design on them. These patterns can be folded to make 3D figures. Each problem shows one pattern, followed by four 3D figures. Please note, the pattern always shows the outside surface of the completed figure. The answer could also be obtained by veiwing the completed figure from any angle. There are four options given; A, B, C and D. You have to select the option (A, B, C, D) indicating the a correct figure that can be made from the pattern. There is only one correct answer for each question.
                              </p>
                          </div>
                          <p>Look at Example A
                          </p>
                          <p>E.g. A</p>
                          <img src="${config.DEPLOY_HOST_URL}/uploads/ollato-images/s-img-1.png
                          " alt="">
                          <P>In Example A, the pattern will form a drum.
                          </P>   
                          <div class="text-box">
                              <p>Look at the options A, B, C, and D. Only one of these figures can be made from the pattern. Option B is incorrect because sides of the drum are too long and the direction of the arrow is incorrect. Option C is incorrect because the sides of the drum are enlongated  and option D is incorrect because the direction of the arrow is incorrect. The correct answer is A because of the accurate size and the accurate direction of the arrow once the drum has been turned.
                              </p>
                          </div>
                          <p>Look at Example B</p>
                          <p>B E.g. B
                          </p>
                          <img src="${config.DEPLOY_HOST_URL}/uploads/ollato-images/s-img-2.png
                          " alt="">
                          <div class="text-box">
                              <p>In Example B, the pattern will make an object like a cylinder. Notice that one side of the pattern has a cross and the other side of the drum has a stripe.
                              </p>
                              <p>Look at the options A, B, C, and D. Only one of these can be made from the pattern. Option A is wrong because the stripe and the cross are on the same side. Option B is wrong because of the same reason and option D is wrong because there is no stripe  in the pattern. The correct answer is Option C because one side of the cylinder has the cross and the other side has the stripe.</p>
                          </div>
                      </div>
                  </section>`,
        is_active: 'y',
        sort_order: 7,
        created_at: new Date(),
        updated_at: new Date(),
        created_by: 'admin',
        updated_by: 'admin'
      },
      {
        custom_id: randomStr(8, 'string'),
        test_id: 1,
        title: 'Spelling',
        sub_test_abb: 'SP',
        no_of_questions: 24,
        no_options: 4,
        meaning: 'The Spellings test assesses your ability to differentiate between correct and incorrect spellings. It measures the command you have over correct spellings and vocabulary in English language.',
        synopsis: 'You are able to differentiate between correct & incorrect spellings, along with the command over vocabulary in English language',
        description: `<section class="insrt-section">
                      <div class="page-title"><div class="page-header"><h1>Spelling</h1></div></div>
                      <div class="page-content">
                          <h2>Instructions</h2>
                          <div class="text-box">
                              <p>This test assesses one's proficiency with spellings. Read each group of  four words, in which one of the word is spelled incorrectly. Identify the incorrectly spelled word and select the option A, B, C, or D indicating the answer you want to choose.
                              </p>
                          </div>
                          <p>Look at Example A
                          </p>
                          <p>E.g. A
                          </p>
                          <ul class="ullist">
                              <li data-title="A">Simultaneous</li>
                              <li data-title="B">Contagious</li>
                              <li data-title="C">Luxurious</li>
                              <li data-title="D">Begining</li>
                          </ul>
                          <div class="text-box">
                              <p>In example A, under option D 'Begning' is spelled incorrectly. The correct spelling is 'Beginning'.</p>

                          </div>
                          <p>Look at Example B</p>
                          <p>E.g. B</p>
                          <ul class="ullist">
                              <li data-title="A">Reciept</li>
                              <li data-title="B">Quarrel</li>
                              <li data-title="C">Sincerely</li>
                              <li data-title="D">Succeed</li>
                          </ul>
                          <div class="text-box">
                              <p>In example B, under option A 'Reciept' is spelled incorrectly. The correct spelling is  'Receipt'.</p>
                          </div>
                      </div>
                  </section>`,
        is_active: 'y',
        sort_order: 8,
        created_at: new Date(),
        updated_at: new Date(),
        created_by: 'admin',
        updated_by: 'admin'
      },
      {
        custom_id: randomStr(8, 'string'),
        test_id: 1,
        title: 'Language Usage',
        sub_test_abb: 'LU',
        no_of_questions: 24,
        no_options: 5,
        meaning: 'The Language Usage test assesses your ability to detect errors in grammar, punctuation and capitalization to produce meaningful novel sentences by applying the rules and structure of English language.',
        synopsis: 'You are able to follow language rules and detect errors in grammar, punctuation and capitalization.',
        description: `<section class="insrt-section">
                    <div class="page-title"><div class="page-header"><h1>Language Usage</h1></div></div>
                    <div class="page-content">
                        <h2>Instructions</h2>
                        <div class="text-box">
                            <p>This test assesses one's understanding of basic rules of language. It consists of sentences that are divided into four parts A, B, C & D. In many of the sentences, one of the four parts contains an error in either punctuation, capitalization, or grammar. You are to decide which one of the four parts, if any, contains the error. Select the option A, B, C, or D indicating the answer you want to choose.  If there is no error in the sentence, select the option E indicating 'No Error'.
                            </p>
                        </div>
                        <p>Look at Example A
                        </p>
                        <p>E.g. A    The burglar /was taken/ to the nearer /police station.</p>
                        <ul class="ullist">
                            <li data-title="A">A</li>
                            <li data-title="B">B</li>
                            <li data-title="C">C</li>
                            <li data-title="D">D</li>
                            <li data-title="E">No error
                            </li>
                        </ul>
                        <div class="text-box">
                            <p>In example A, option C contains the error, instead of the word nearer the word 'nearest' must be used.
                            </p>
                            <p>Please circle option C, as that is the part that contains the error.</p>
                        </div>
                        <p>Look at Example B</p>
                        <p>E.g. B    I thought/ you were through/ doing your/ work already.</p>
                        <ul class="ullist">
                            <li data-title="A">A</li>
                            <li data-title="B">B</li>
                            <li data-title="C">C</li>
                            <li data-title="D">D</li>
                            <li data-title="E">No error
                            </li>
                        </ul>
                        <div class="text-box">
                            <p>In example B there is no error, the sentence is correct.</p>
                            <p>Please circle option E, as it indicates no error.</p>
                        </div>
                    </div>
                </section>`,
        is_active: 'y',
        sort_order: 9,
        created_at: new Date(),
        updated_at: new Date(),
        created_by: 'admin',
        updated_by: 'admin'
      },
      {
        custom_id: randomStr(8, 'string'),
        test_id: 2,
        title: 'Realistic',
        sub_test_abb: 'R',
        no_of_questions: 14,
        no_options: 2,
        meaning: '',
        synopsis: '',
        description: 'Practicality,Productivity,Structure,Independence,Physical Skill;Realistic,Sensible,Mechanical,Traditional,Down-to-earth,Shy,Frank,Conforming,Honest,Persistent',
        is_active: 'y',
        sort_order: 1,
        created_at: new Date(),
        updated_at: new Date(),
        created_by: 'admin',
        updated_by: 'admin'
      },
      {
        custom_id: randomStr(8, 'string'),
        test_id: 2,
        title: 'Investigative',
        sub_test_abb: 'I',
        no_of_questions: 13,
        no_options: 2,
        meaning: '',
        synopsis: '',
        description: 'Discovery,Understanding,Logic,Independence,Intellect;Intellectual,Curious,Logical,Analytical,Scholarly,Cautious,Precise,Modest,Rational',
        is_active: 'y',
        sort_order: 2,
        created_at: new Date(),
        updated_at: new Date(),
        created_by: 'admin',
        updated_by: 'admin'
      },
      {
        custom_id: randomStr(8, 'string'),
        test_id: 2,
        title: 'Artistic',
        sub_test_abb: 'A',
        no_of_questions: 15,
        no_options: 2,
        meaning: '',
        synopsis: '',
        description: 'Originality,Creativity,Freedom,Individuality,Flexibility;Independent,Intuitive,Sensitive,Imaginative,Spontaneous,Creative,Open,Original',
        is_active: 'y',
        sort_order: 3,
        created_at: new Date(),
        updated_at: new Date(),
        created_by: 'admin',
        updated_by: 'admin'
      },
      {
        custom_id: randomStr(8, 'string'),
        test_id: 2,
        title: 'Social',
        sub_test_abb: 'S',
        no_of_questions: 16,
        no_options: 2,
        meaning: '',
        synopsis: '',
        description: 'Cooperation,Service,Altruism,Connection,Empathy;Compassionate,Patient,Helpful,Friendly,Generous,Tactful,Responsible',
        is_active: 'y',
        sort_order: 4,
        created_at: new Date(),
        updated_at: new Date(),
        created_by: 'admin',
        updated_by: 'admin'
      },
      {
        custom_id: randomStr(8, 'string'),
        test_id: 2,
        title: 'Enterprising',
        sub_test_abb: 'E',
        no_of_questions: 16,
        no_options: 2,
        meaning: '',
        synopsis: '',
        description: 'Influence,Leadership,Risk-Taking,Achievement,Initiative;Assertive,Energetic,Confident,Ambitious,Adventurous,Sociable,Agreeable',
        is_active: 'y',
        sort_order: 5,
        created_at: new Date(),
        updated_at: new Date(),
        created_by: 'admin',
        updated_by: 'admin'
      },
      {
        custom_id: randomStr(8, 'string'),
        test_id: 2,
        title: 'Conventional',
        sub_test_abb: 'C',
        no_of_questions: 16,
        no_options: 2,
        meaning: '',
        synopsis: '',
        description: 'Structure,Order,Clarity,Precision,Attention to Detail;Orderly,Precise,Detail-Oriented,Conservative,Thorough,Obedient,Practical',
        is_active: 'y',
        sort_order: 6,
        created_at: new Date(),
        updated_at: new Date(),
        created_by: 'admin',
        updated_by: 'admin'
      }
    ], {})
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('test_details', null, {})
  }
}
