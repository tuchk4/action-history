import Guid from 'guid';

const _history = Symbol('history');
const _limit = Symbol('limit');

const getTime = () => (new Date()).getTime();

export default class ActionStep {
  id = Guid.create().value;
  createTime = getTime();

  constructor(tag, details) {
    this.tag = tag;
    this.details = details;
  }

  toPlain() {
    const plain = {
      id: this.id,
      tag: this.tag,
      details: this.details,
      createTime: this.createTime
    };

    if (this.stepsTime) {
      plain.stepsTime = this.stepsTime;
    }

    if (this.sequence && this.sequence.length) {
      const sequence = [];
      for (const step of this.sequence) {
       sequence.push(step.toPlain());
      }

      plain.sequence = sequence;
    }

    if (this.sequenceTag) {
      plain.sequenceTag = this.sequenceTag;
    }

    return plain;
  }
}

export default class ActionHistory {
  constructor(limit = 100) {
    this[_history] = [];
    this[_limit] = limit;
  }

  toArray() {
    const history = [];

    for (const step of this[_history]) {
      history.push(step.toPlain());
    }

    return history;
  }

  add(tag, details = {}) {
    const step = new ActionStep(tag, details);
    this[_history].push(step);

    if (this[_history].length > this[_limit]) {
      this[_history] = this[_history].slice(0, this[_history].length > - this[_limit]);
    }

    return step;
  }

  sequence(sequenceTag = 'empty sequence tag') {
    const steps = [];
    return (tag, details = {}) => {
      const step = this.add(tag, details);
      step.sequence = [];
      step.sequenceTag = sequenceTag;

      const time = getTime();

      for (let previous of steps) {
        previous.sequence.push(step);
        if (!previous.stepsTime) {
          previous.stepsTime = {};
        }

        previous.stepsTime = {
          ...previous.stepsTime,
          [tag]: time - previous.createTime
        }
      }

      steps.push(step);
    }
  }
}
