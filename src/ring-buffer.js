
const debug = require('debug')('RingBuffer');
import defaults from './defaults';

export default class RingBuffer {

  constructor(size = defaults.size) {
    this.buf = new Buffer(size);
    this.size = size;
    this.r = 0;
    this.w = 0;
  }

  // Read pending number of bytes.
  used() {
    return this.w - this.r;
  }

  // Free space in bytes.
  free() {
    return this.size - this.used();
  }

  roff() {
    return this.r % this.size;
  }

  woff() {
    return this.w % this.size;
  }

  // Returns [len-end, len-beg, len-other] tuple where:
  // - len-end - 1st chunk's length to write until the end of internal buffer.
  // - len-beg - 2nd chunk's length to write from the beginning of internal buffer.
  // - len-other - 3rd chunk's length to write to other buffer (out of space in this buffer).
  wtuple(length) {
    let n = length;
    let a = Math.min(n, this.free(), this.size - this.woff());
    n -= a;
    let b = Math.min(n, this.free() - a);
    n -= b;
    // debug('wtuple', [a, b, n]);
    return [a, b, n];
  }

  rtuple(length) {
    let n = length;
    let a = Math.min(n, this.used(), this.size - this.roff());
    n -= a;
    let b = Math.min(n, this.used() - a);
    n -= b;
    // debug('rtuple', [a, b, n]);
    return [a, b, n];
  }

  write(input, encoding = 'utf8') {
    const length = Buffer.byteLength(input, encoding);
    const [a, b, c] = this.wtuple(length);
    this.buf.write(input, this.woff(), a);
    // debug('write a', [ this.woff(), a ]);
    this.buf.write(input, 0, b);
    // debug('write b', [ 0, b ]);
    this.w += a + b;
    // debug('write c', c);
    return c;
  }

  read(output, offset = 0, length = this.used()) {
    const [a, b, c] = this.rtuple(length);
    this.buf.copy(output, offset, this.roff(), this.roff() + a);
    // debug('read a', [ this.roff(), this.roff() + a ]);
    this.buf.copy(output, offset + a, 0, b);
    // debug('read b', [ 0, b ]);
    this.r += a + b;
    // debug('read c', c);
    return c;
  }

  // new Buffer(array)
  // new Buffer(buffer)
  // new Buffer(size)
  // new Buffer(str[, encoding])
  // Class Method: Buffer.byteLength(string[, encoding])
  // Class Method: Buffer.compare(buf1, buf2)
  // Class Method: Buffer.concat(list[, totalLength])
  // Class Method: Buffer.isBuffer(obj)
  // Class Method: Buffer.isEncoding(encoding)
  // buffer.entries()
  // buffer.keys()
  // buffer.values()
  // buf[index]
  // buf.compare(otherBuffer)
  // buf.copy(targetBuffer[, targetStart][, sourceStart][, sourceEnd])
  // buf.equals(otherBuffer)
  // buf.fill(value[, offset][, end])
  // buf.indexOf(value[, byteOffset])
  // buf.length
  // buf.readDoubleBE(offset[, noAssert])
  // buf.readDoubleLE(offset[, noAssert])
  // buf.readFloatBE(offset[, noAssert])
  // buf.readFloatLE(offset[, noAssert])
  // buf.readInt8(offset[, noAssert])
  // buf.readInt16BE(offset[, noAssert])
  // buf.readInt16LE(offset[, noAssert])
  // buf.readInt32BE(offset[, noAssert])
  // buf.readInt32LE(offset[, noAssert])
  // buf.readIntBE(offset, byteLength[, noAssert])
  // buf.readIntLE(offset, byteLength[, noAssert])
  // buf.readUInt8(offset[, noAssert])
  // buf.readUInt16BE(offset[, noAssert])
  // buf.readUInt16LE(offset[, noAssert])
  // buf.readUInt32BE(offset[, noAssert])
  // buf.readUInt32LE(offset[, noAssert])
  // buf.readUIntBE(offset, byteLength[, noAssert])
  // buf.readUIntLE(offset, byteLength[, noAssert])
  // buf.slice([start[, end]])
  // buf.toString([encoding][, start][, end])
  // buf.toJSON()
  // buf.write(string[, offset][, length][, encoding])
  // buf.writeDoubleBE(value, offset[, noAssert])
  // buf.writeDoubleLE(value, offset[, noAssert])
  // buf.writeFloatBE(value, offset[, noAssert])
  // buf.writeFloatLE(value, offset[, noAssert])
  // buf.writeInt8(value, offset[, noAssert])
  // buf.writeInt16BE(value, offset[, noAssert])
  // buf.writeInt16LE(value, offset[, noAssert])
  // buf.writeInt32BE(value, offset[, noAssert])
  // buf.writeInt32LE(value, offset[, noAssert])
  // buf.writeIntBE(value, offset, byteLength[, noAssert])
  // buf.writeIntLE(value, offset, byteLength[, noAssert])
  // buf.writeUInt8(value, offset[, noAssert])
  // buf.writeUInt16BE(value, offset[, noAssert])
  // buf.writeUInt16LE(value, offset[, noAssert])
  // buf.writeUInt32BE(value, offset[, noAssert])
  // buf.writeUInt32LE(value, offset[, noAssert])
  // buf.writeUIntBE(value, offset, byteLength[, noAssert])
  // buf.writeUIntLE(value, offset, byteLength[, noAssert])

}
