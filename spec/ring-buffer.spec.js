
import { RingBuffer } from '../lib';
import { expect } from 'chai';

describe('RingBuffer', function () {

  it('should work with simple write and read', function () {
    let buf = new RingBuffer(8);
    expect(buf.write('123')).to.eq(0);
    expect(buf.write('4')).to.eq(0);
    expect(buf.write('56789')).to.eq(1);
    expect(buf.buf.toString()).to.eq('12345678');
    let out = new Buffer(8);
    out.fill('0');
    expect(buf.read(out, 0, 4)).to.eq(0);
    expect(out.toString()).to.eq('12340000');
    expect(buf.read(out, 4, 5)).to.eq(1);
    expect(out.toString()).to.eq('12345678');
    expect(buf.write('123')).to.eq(0);
    out.fill('0');
    expect(buf.read(out, 0, 4)).to.eq(1);
    expect(out.toString()).to.eq('12300000');
  });

});
