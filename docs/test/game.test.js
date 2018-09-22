'use strict';

// import {assert} from 'chai';
// import {countingPoints, INITIAL_GAME, setLives, changeLevel} from './game.js';

// describe(`Calculate points game`, () => {
//   it(`test answer < 10: return -1`, () => {
//     let arrayUserAnswers = [{answer: true, elapsedTime: 0}];
//     let lives = 3;

//     assert.equal(countingPoints(arrayUserAnswers, lives, INITIAL_GAME).points, -1);
//   });

//   it(`test fast answer: return 1650`, () => {
//     let arrayUserAnswers = [{answer: true, elapsedTime: 0}, {answer: true, elapsedTime: 0}, {answer: true, elapsedTime: 0}, {answer: true, elapsedTime: 0}, {answer: true, elapsedTime: 0}, {answer: true, elapsedTime: 0}, {answer: true, elapsedTime: 0}, {answer: true, elapsedTime: 0}, {answer: true, elapsedTime: 0}, {answer: true, elapsedTime: 0}];
//     let lives = 3;

//     assert.equal(countingPoints(arrayUserAnswers, lives, INITIAL_GAME).points, 1650);
//   });

//   it(`test normal answer: return 1150`, () => {
//     let arrayUserAnswers = [{answer: true, elapsedTime: 15}, {answer: true, elapsedTime: 15}, {answer: true, elapsedTime: 15}, {answer: true, elapsedTime: 15}, {answer: true, elapsedTime: 15}, {answer: true, elapsedTime: 15}, {answer: true, elapsedTime: 15}, {answer: true, elapsedTime: 15}, {answer: true, elapsedTime: 15}, {answer: true, elapsedTime: 15}];
//     let lives = 3;

//     assert.equal(countingPoints(arrayUserAnswers, lives, INITIAL_GAME).points, 1150);
//   });

//   it(`test slow answer: return 650`, () => {
//     let arrayUserAnswers = [{answer: true, elapsedTime: 25}, {answer: true, elapsedTime: 25}, {answer: true, elapsedTime: 25}, {answer: true, elapsedTime: 25}, {answer: true, elapsedTime: 25}, {answer: true, elapsedTime: 25}, {answer: true, elapsedTime: 25}, {answer: true, elapsedTime: 25}, {answer: true, elapsedTime: 25}, {answer: true, elapsedTime: 25}];
//     let lives = 3;

//     assert.equal(countingPoints(arrayUserAnswers, lives, INITIAL_GAME).points, 650);
//   });

//   it(`test slow answer and 1 lives: return 550`, () => {
//     let arrayUserAnswers = [{answer: true, elapsedTime: 25}, {answer: true, elapsedTime: 25}, {answer: true, elapsedTime: 25}, {answer: true, elapsedTime: 25}, {answer: true, elapsedTime: 25}, {answer: true, elapsedTime: 25}, {answer: true, elapsedTime: 25}, {answer: true, elapsedTime: 25}, {answer: true, elapsedTime: 25}, {answer: true, elapsedTime: 25}];
//     let lives = 1;

//     assert.equal(countingPoints(arrayUserAnswers, lives, INITIAL_GAME).points, 550);
//   });
// });


// describe(`Change lives`, () => {
//   it(`minus 1 lives`, () => {
//     assert.equal(setLives(INITIAL_GAME).lives, 2);
//   });

//   it(`minus 1 lives in new data`, () => {
//     let data = {
//       lives: 2
//     };

//     assert.equal(setLives(data).lives, 1);
//   });

//   it(`return 0`, () => {
//     let data = {
//       lives: 0
//     };

//     assert.equal(setLives(data).lives, 0);
//   });
// });

// describe(`Change level`, () => {
//   it(`plus 1 level`, () => {
//     assert.equal(changeLevel(INITIAL_GAME).level, 1);
//   });

//   it(`plus 1 level in new data`, () => {
//     let data = {
//       level: 2
//     };

//     assert.equal(changeLevel(data).level, 3);
//   });
// });
