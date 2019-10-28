const rpn = require('./index');


describe("basic stack functionality", () => {
  let res = rpn('10 0x20 -20.23 -1.1e3'.split(" "),{fullStack:true});

  it('returns an array', () => {
    expect(Array.isArray(res)).toBe(true);
  });

  it('is of the correct length', () => {
    expect(res.length)
      .toBe(4);
  });

  it('understands decimal number', () => {
    expect(res[3])
      .toBe(10);
  });

  it('understands hexadecimal number', () => {
    expect(res[2])
      .toBe(32);
  });

  it('understands floating negative notation', () => {
    expect(res[1])
      .toBe(-20.23);
  });

  it('understands scientific notation', () => {
    expect(res[0])
      .toBe(-1100);
  });

  it('accepts an string and splits it', () => {
    expect(rpn("1 2 +")).toBe(3);
  });
});

describe("simple operands", () => {
  let res = rpn(['P','0','c','1','2','+'],{fullStack:true});
  it('handles non-operand operators', () => {
    expect(res[2]).toBeCloseTo(3.141592,4);
  });
  it('handles one-operand operators', () => {
    expect(res[1]).toBe(1);
  });
  it('handles two-operand operators', () => {
    expect(res[0]).toBe(3);
  });  
});
describe("stack manipulation", () => {
  let res = rpn("2 = 1 x",{fullStack:true});
  it('handles enter', () => {
    expect(res.length).toBe(3);
  });
  it('handles exchange', () => {
    expect(res[2]).toBe(2);
  });
});
describe("value store", () => {
  let res = rpn("2 1 S 3 1 R");
  it('handles store and recall', () => {
    expect(res).toBe(2);
  });
});

describe("basic factory", () => {
  let calc = rpn();
  it('returns a calculator object', () => {
    expect(typeof (calc)).toBe("object");
  });
  it('contains an stack', () => {
    expect(Array.isArray(calc.stack)).toBe(true);
  });

  it('permits calculations', () => {
    expect(calc.calculate('100 1 2 + 3 +')).toBe(6);
  });

  it('permits chaining calculations', () => {
    expect(calc.calculate('4 +')).toBe(10);
  });
});
