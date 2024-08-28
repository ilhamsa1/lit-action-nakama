// src/bundled/encrypted-root-key/esbuild-shims.ts
globalThis.require = (name) => {
  if (name === "ethers") {
    return ethers;
  }
  throw new Error("unknown module " + name);
};

// https://esm.sh/v135/@noble/hashes@1.4.0/denonext/_assert.js
function r(e) {
  if (!Number.isSafeInteger(e) || e < 0) throw new Error(`positive integer expected, not ${e}`);
}
function f(e) {
  return e instanceof Uint8Array || e != null && typeof e == "object" && e.constructor.name === "Uint8Array";
}
function n(e, ...t) {
  if (!f(e)) throw new Error("Uint8Array expected");
  if (t.length > 0 && !t.includes(e.length)) throw new Error(`Uint8Array expected of length ${t}, not of length=${e.length}`);
}
function s(e) {
  if (typeof e != "function" || typeof e.create != "function") throw new Error("Hash should be wrapped by utils.wrapConstructor");
  r(e.outputLen), r(e.blockLen);
}
function u(e, t = true) {
  if (e.destroyed) throw new Error("Hash instance has been destroyed");
  if (t && e.finished) throw new Error("Hash#digest() has already been called");
}
function c(e, t) {
  n(e);
  let o3 = t.outputLen;
  if (e.length < o3) throw new Error(`digestInto() expects output buffer of length at least ${o3}`);
}

// https://esm.sh/v135/@noble/hashes@1.4.0/denonext/crypto.js
var o = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;

// https://esm.sh/v135/@noble/hashes@1.4.0/denonext/utils.js
var B = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength);
var E = (t, e) => t << 32 - e | t >>> e;
var d = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
var w = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
var b = async () => {
};
async function D(t, e, o3) {
  let n2 = Date.now();
  for (let r2 = 0; r2 < t; r2++) {
    o3(r2);
    let c2 = Date.now() - n2;
    c2 >= 0 && c2 < e || (await b(), n2 += c2);
  }
}
function m(t) {
  if (typeof t != "string") throw new Error(`utf8ToBytes expected string, got ${typeof t}`);
  return new Uint8Array(new TextEncoder().encode(t));
}
function s2(t) {
  return typeof t == "string" && (t = m(t)), n(t), t;
}
var y = class {
  clone() {
    return this._cloneInto();
  }
};
var L = {}.toString;
function R(t, e) {
  if (e !== void 0 && L.call(e) !== "[object Object]") throw new Error("Options should be object or undefined");
  return Object.assign(t, e);
}
function C(t) {
  let e = (n2) => t().update(s2(n2)).digest(), o3 = t();
  return e.outputLen = o3.outputLen, e.blockLen = o3.blockLen, e.create = () => t(), e;
}

// https://esm.sh/v135/@noble/hashes@1.4.0/denonext/hmac.js
var o2 = class extends y {
  constructor(t, i) {
    super(), this.finished = false, this.destroyed = false, s(t);
    let h2 = s2(i);
    if (this.iHash = t.create(), typeof this.iHash.update != "function") throw new Error("Expected instance of class which extends utils.Hash");
    this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
    let a = this.blockLen, s5 = new Uint8Array(a);
    s5.set(h2.length > a ? t.create().update(h2).digest() : h2);
    for (let e = 0; e < s5.length; e++) s5[e] ^= 54;
    this.iHash.update(s5), this.oHash = t.create();
    for (let e = 0; e < s5.length; e++) s5[e] ^= 106;
    this.oHash.update(s5), s5.fill(0);
  }
  update(t) {
    return u(this), this.iHash.update(t), this;
  }
  digestInto(t) {
    u(this), n(t, this.outputLen), this.finished = true, this.iHash.digestInto(t), this.oHash.update(t), this.oHash.digestInto(t), this.destroy();
  }
  digest() {
    let t = new Uint8Array(this.oHash.outputLen);
    return this.digestInto(t), t;
  }
  _cloneInto(t) {
    t || (t = Object.create(Object.getPrototypeOf(this), {}));
    let { oHash: i, iHash: h2, finished: a, destroyed: s5, blockLen: e, outputLen: d3 } = this;
    return t = t, t.finished = a, t.destroyed = s5, t.blockLen = e, t.outputLen = d3, t.oHash = i._cloneInto(t.oHash), t.iHash = h2._cloneInto(t.iHash), t;
  }
  destroy() {
    this.destroyed = true, this.oHash.destroy(), this.iHash.destroy();
  }
};
var l = (n2, t, i) => new o2(n2, t).update(i).digest();
l.create = (n2, t) => new o2(n2, t);

// https://esm.sh/v135/@noble/hashes@1.4.0/denonext/hkdf.js
function w2(t, o3, e) {
  return s(t), e === void 0 && (e = new Uint8Array(t.outputLen)), l(t, s2(e), s2(o3));
}
var s3 = new Uint8Array([0]);
var m2 = new Uint8Array();
function A(t, o3, e, n2 = 32) {
  if (s(t), r(n2), n2 > 255 * t.outputLen) throw new Error("Length should be <= 255*HashLen");
  let u2 = Math.ceil(n2 / t.outputLen);
  e === void 0 && (e = m2);
  let d3 = new Uint8Array(u2 * t.outputLen), c2 = l.create(t, o3), p = c2._cloneInto(), i = new Uint8Array(c2.outputLen);
  for (let r2 = 0; r2 < u2; r2++) s3[0] = r2 + 1, p.update(r2 === 0 ? m2 : i).update(e).update(s3).digestInto(i), d3.set(i, t.outputLen * r2), c2._cloneInto(p);
  return c2.destroy(), p.destroy(), i.fill(0), s3.fill(0), d3.slice(0, n2);
}
var H = (t, o3, e, n2, u2) => A(t, w2(t, o3, e), n2, u2);

// https://esm.sh/v135/@noble/hashes@1.4.0/denonext/pbkdf2.js
function m3(u2, l2, d3, i) {
  s(u2);
  let f2 = R({ dkLen: 32, asyncTick: 10 }, i), { c: y3, dkLen: p, asyncTick: t } = f2;
  if (r(y3), r(p), r(t), y3 < 1) throw new Error("PBKDF2: iterations (c) should be >= 1");
  let n2 = s2(l2), o3 = s2(d3), r2 = new Uint8Array(p), k2 = l.create(u2, n2), e = k2._cloneInto().update(o3);
  return { c: y3, dkLen: p, asyncTick: t, DK: r2, PRF: k2, PRFSalt: e };
}
function g(u2, l2, d3, i, f2) {
  return u2.destroy(), l2.destroy(), i && i.destroy(), f2.fill(0), d3;
}
async function K(u2, l2, d3, i) {
  let { c: f2, dkLen: y3, asyncTick: p, DK: t, PRF: n2, PRFSalt: o3 } = m3(u2, l2, d3, i), r2, k2 = new Uint8Array(4), e = B(k2), s5 = new Uint8Array(n2.outputLen);
  for (let w3 = 1, c2 = 0; c2 < y3; w3++, c2 += n2.outputLen) {
    let I = t.subarray(c2, c2 + n2.outputLen);
    e.setInt32(0, w3, false), (r2 = o3._cloneInto(r2)).update(k2).digestInto(s5), I.set(s5.subarray(0, I.length)), await D(f2 - 1, p, () => {
      n2._cloneInto(r2).update(s5).digestInto(s5);
      for (let a = 0; a < I.length; a++) I[a] ^= s5[a];
    });
  }
  return g(n2, o3, t, r2, s5);
}

// https://esm.sh/v135/@noble/hashes@1.4.0/denonext/_md.js
function m4(o3, t, s5, i) {
  if (typeof o3.setBigUint64 == "function") return o3.setBigUint64(t, s5, i);
  let n2 = BigInt(32), h2 = BigInt(4294967295), e = Number(s5 >> n2 & h2), r2 = Number(s5 & h2), c2 = i ? 4 : 0, u2 = i ? 0 : 4;
  o3.setUint32(t + c2, e, i), o3.setUint32(t + u2, r2, i);
}
var B2 = (o3, t, s5) => o3 & t ^ ~o3 & s5;
var L2 = (o3, t, s5) => o3 & t ^ o3 & s5 ^ t & s5;
var d2 = class extends y {
  constructor(t, s5, i, n2) {
    super(), this.blockLen = t, this.outputLen = s5, this.padOffset = i, this.isLE = n2, this.finished = false, this.length = 0, this.pos = 0, this.destroyed = false, this.buffer = new Uint8Array(t), this.view = B(this.buffer);
  }
  update(t) {
    u(this);
    let { view: s5, buffer: i, blockLen: n2 } = this;
    t = s2(t);
    let h2 = t.length;
    for (let e = 0; e < h2; ) {
      let r2 = Math.min(n2 - this.pos, h2 - e);
      if (r2 === n2) {
        let c2 = B(t);
        for (; n2 <= h2 - e; e += n2) this.process(c2, e);
        continue;
      }
      i.set(t.subarray(e, e + r2), this.pos), this.pos += r2, e += r2, this.pos === n2 && (this.process(s5, 0), this.pos = 0);
    }
    return this.length += t.length, this.roundClean(), this;
  }
  digestInto(t) {
    u(this), c(t, this), this.finished = true;
    let { buffer: s5, view: i, blockLen: n2, isLE: h2 } = this, { pos: e } = this;
    s5[e++] = 128, this.buffer.subarray(e).fill(0), this.padOffset > n2 - e && (this.process(i, 0), e = 0);
    for (let f2 = e; f2 < n2; f2++) s5[f2] = 0;
    m4(i, n2 - 8, BigInt(this.length * 8), h2), this.process(i, 0);
    let r2 = B(t), c2 = this.outputLen;
    if (c2 % 4) throw new Error("_sha2: outputLen should be aligned to 32bit");
    let u2 = c2 / 4, l2 = this.get();
    if (u2 > l2.length) throw new Error("_sha2: outputLen bigger than state");
    for (let f2 = 0; f2 < u2; f2++) r2.setUint32(4 * f2, l2[f2], h2);
  }
  digest() {
    let { buffer: t, outputLen: s5 } = this;
    this.digestInto(t);
    let i = t.slice(0, s5);
    return this.destroy(), i;
  }
  _cloneInto(t) {
    t || (t = new this.constructor()), t.set(...this.get());
    let { blockLen: s5, buffer: i, length: n2, finished: h2, destroyed: e, pos: r2 } = this;
    return t.length = n2, t.pos = r2, t.finished = h2, t.destroyed = e, n2 % s5 && t.buffer.set(i), t;
  }
};

// https://esm.sh/v135/@noble/hashes@1.4.0/denonext/sha512.js
var U = BigInt(4294967295);
var N = BigInt(32);
function k(t, c2 = false) {
  return c2 ? { h: Number(t & U), l: Number(t >> N & U) } : { h: Number(t >> N & U) | 0, l: Number(t & U) | 0 };
}
function z(t, c2 = false) {
  let h2 = new Uint32Array(t.length), e = new Uint32Array(t.length);
  for (let a = 0; a < t.length; a++) {
    let { h: b3, l: f2 } = k(t[a], c2);
    [h2[a], e[a]] = [b3, f2];
  }
  return [h2, e];
}
var O = (t, c2) => BigInt(t >>> 0) << N | BigInt(c2 >>> 0);
var P = (t, c2, h2) => t >>> h2;
var Q = (t, c2, h2) => t << 32 - h2 | c2 >>> h2;
var R2 = (t, c2, h2) => t >>> h2 | c2 << 32 - h2;
var V = (t, c2, h2) => t << 32 - h2 | c2 >>> h2;
var X = (t, c2, h2) => t << 64 - h2 | c2 >>> h2 - 32;
var Y = (t, c2, h2) => t >>> h2 - 32 | c2 << 64 - h2;
var Z = (t, c2) => c2;
var $ = (t, c2) => t;
var v = (t, c2, h2) => t << h2 | c2 >>> 32 - h2;
var t0 = (t, c2, h2) => c2 << h2 | t >>> 32 - h2;
var h0 = (t, c2, h2) => c2 << h2 - 32 | t >>> 64 - h2;
var c0 = (t, c2, h2) => t << h2 - 32 | c2 >>> 64 - h2;
function s0(t, c2, h2, e) {
  let a = (c2 >>> 0) + (e >>> 0);
  return { h: t + h2 + (a / 2 ** 32 | 0) | 0, l: a | 0 };
}
var e0 = (t, c2, h2) => (t >>> 0) + (c2 >>> 0) + (h2 >>> 0);
var a0 = (t, c2, h2, e) => c2 + h2 + e + (t / 2 ** 32 | 0) | 0;
var x0 = (t, c2, h2, e) => (t >>> 0) + (c2 >>> 0) + (h2 >>> 0) + (e >>> 0);
var d0 = (t, c2, h2, e, a) => c2 + h2 + e + a + (t / 2 ** 32 | 0) | 0;
var i0 = (t, c2, h2, e, a) => (t >>> 0) + (c2 >>> 0) + (h2 >>> 0) + (e >>> 0) + (a >>> 0);
var b0 = (t, c2, h2, e, a, b3) => c2 + h2 + e + a + b3 + (t / 2 ** 32 | 0) | 0;
var f0 = { fromBig: k, split: z, toBig: O, shrSH: P, shrSL: Q, rotrSH: R2, rotrSL: V, rotrBH: X, rotrBL: Y, rotr32H: Z, rotr32L: $, rotlSH: v, rotlSL: t0, rotlBH: h0, rotlBL: c0, add: s0, add3L: e0, add3H: a0, add4L: x0, add4H: d0, add5H: b0, add5L: i0 };
var s4 = f0;
var [r0, o0] = s4.split(["0x428a2f98d728ae22", "0x7137449123ef65cd", "0xb5c0fbcfec4d3b2f", "0xe9b5dba58189dbbc", "0x3956c25bf348b538", "0x59f111f1b605d019", "0x923f82a4af194f9b", "0xab1c5ed5da6d8118", "0xd807aa98a3030242", "0x12835b0145706fbe", "0x243185be4ee4b28c", "0x550c7dc3d5ffb4e2", "0x72be5d74f27b896f", "0x80deb1fe3b1696b1", "0x9bdc06a725c71235", "0xc19bf174cf692694", "0xe49b69c19ef14ad2", "0xefbe4786384f25e3", "0x0fc19dc68b8cd5b5", "0x240ca1cc77ac9c65", "0x2de92c6f592b0275", "0x4a7484aa6ea6e483", "0x5cb0a9dcbd41fbd4", "0x76f988da831153b5", "0x983e5152ee66dfab", "0xa831c66d2db43210", "0xb00327c898fb213f", "0xbf597fc7beef0ee4", "0xc6e00bf33da88fc2", "0xd5a79147930aa725", "0x06ca6351e003826f", "0x142929670a0e6e70", "0x27b70a8546d22ffc", "0x2e1b21385c26c926", "0x4d2c6dfc5ac42aed", "0x53380d139d95b3df", "0x650a73548baf63de", "0x766a0abb3c77b2a8", "0x81c2c92e47edaee6", "0x92722c851482353b", "0xa2bfe8a14cf10364", "0xa81a664bbc423001", "0xc24b8b70d0f89791", "0xc76c51a30654be30", "0xd192e819d6ef5218", "0xd69906245565a910", "0xf40e35855771202a", "0x106aa07032bbd1b8", "0x19a4c116b8d2d0c8", "0x1e376c085141ab53", "0x2748774cdf8eeb99", "0x34b0bcb5e19b48a8", "0x391c0cb3c5c95a63", "0x4ed8aa4ae3418acb", "0x5b9cca4f7763e373", "0x682e6ff3d6b2b8a3", "0x748f82ee5defb2fc", "0x78a5636f43172f60", "0x84c87814a1f0ab72", "0x8cc702081a6439ec", "0x90befffa23631e28", "0xa4506cebde82bde9", "0xbef9a3f7b2c67915", "0xc67178f2e372532b", "0xca273eceea26619c", "0xd186b8c721c0c207", "0xeada7dd6cde0eb1e", "0xf57d4f7fee6ed178", "0x06f067aa72176fba", "0x0a637dc5a2c898a6", "0x113f9804bef90dae", "0x1b710b35131c471b", "0x28db77f523047d84", "0x32caab7b40c72493", "0x3c9ebe0a15c9bebc", "0x431d67c49c100d4c", "0x4cc5d4becb3e42b6", "0x597f299cfc657e2a", "0x5fcb6fab3ad6faec", "0x6c44198c4a475817"].map((t) => BigInt(t)));
var g2 = new Uint32Array(80);
var D2 = new Uint32Array(80);
var m5 = class extends d2 {
  constructor() {
    super(128, 64, 16, false), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  get() {
    let { Ah: c2, Al: h2, Bh: e, Bl: a, Ch: b3, Cl: f2, Dh: l2, Dl: r2, Eh: u2, El: L3, Fh: d3, Fl: i, Gh: o3, Gl: n2, Hh: H2, Hl: B3 } = this;
    return [c2, h2, e, a, b3, f2, l2, r2, u2, L3, d3, i, o3, n2, H2, B3];
  }
  set(c2, h2, e, a, b3, f2, l2, r2, u2, L3, d3, i, o3, n2, H2, B3) {
    this.Ah = c2 | 0, this.Al = h2 | 0, this.Bh = e | 0, this.Bl = a | 0, this.Ch = b3 | 0, this.Cl = f2 | 0, this.Dh = l2 | 0, this.Dl = r2 | 0, this.Eh = u2 | 0, this.El = L3 | 0, this.Fh = d3 | 0, this.Fl = i | 0, this.Gh = o3 | 0, this.Gl = n2 | 0, this.Hh = H2 | 0, this.Hl = B3 | 0;
  }
  process(c2, h2) {
    for (let x = 0; x < 16; x++, h2 += 4) g2[x] = c2.getUint32(h2), D2[x] = c2.getUint32(h2 += 4);
    for (let x = 16; x < 80; x++) {
      let p = g2[x - 15] | 0, C3 = D2[x - 15] | 0, I = s4.rotrSH(p, C3, 1) ^ s4.rotrSH(p, C3, 8) ^ s4.shrSH(p, C3, 7), M = s4.rotrSL(p, C3, 1) ^ s4.rotrSL(p, C3, 8) ^ s4.shrSL(p, C3, 7), A3 = g2[x - 2] | 0, S = D2[x - 2] | 0, G = s4.rotrSH(A3, S, 19) ^ s4.rotrBH(A3, S, 61) ^ s4.shrSH(A3, S, 6), W = s4.rotrSL(A3, S, 19) ^ s4.rotrBL(A3, S, 61) ^ s4.shrSL(A3, S, 6), _ = s4.add4L(M, W, D2[x - 7], D2[x - 16]), y3 = s4.add4H(_, I, G, g2[x - 7], g2[x - 16]);
      g2[x] = y3 | 0, D2[x] = _ | 0;
    }
    let { Ah: e, Al: a, Bh: b3, Bl: f2, Ch: l2, Cl: r2, Dh: u2, Dl: L3, Eh: d3, El: i, Fh: o3, Fl: n2, Gh: H2, Gl: B3, Hh: E2, Hl: F2 } = this;
    for (let x = 0; x < 80; x++) {
      let p = s4.rotrSH(d3, i, 14) ^ s4.rotrSH(d3, i, 18) ^ s4.rotrBH(d3, i, 41), C3 = s4.rotrSL(d3, i, 14) ^ s4.rotrSL(d3, i, 18) ^ s4.rotrBL(d3, i, 41), I = d3 & o3 ^ ~d3 & H2, M = i & n2 ^ ~i & B3, A3 = s4.add5L(F2, C3, M, o0[x], D2[x]), S = s4.add5H(A3, E2, p, I, r0[x], g2[x]), G = A3 | 0, W = s4.rotrSH(e, a, 28) ^ s4.rotrBH(e, a, 34) ^ s4.rotrBH(e, a, 39), _ = s4.rotrSL(e, a, 28) ^ s4.rotrBL(e, a, 34) ^ s4.rotrBL(e, a, 39), y3 = e & b3 ^ e & l2 ^ b3 & l2, q = a & f2 ^ a & r2 ^ f2 & r2;
      E2 = H2 | 0, F2 = B3 | 0, H2 = o3 | 0, B3 = n2 | 0, o3 = d3 | 0, n2 = i | 0, { h: d3, l: i } = s4.add(u2 | 0, L3 | 0, S | 0, G | 0), u2 = l2 | 0, L3 = r2 | 0, l2 = b3 | 0, r2 = f2 | 0, b3 = e | 0, f2 = a | 0;
      let j = s4.add3L(G, _, q);
      e = s4.add3H(j, S, W, y3), a = j | 0;
    }
    ({ h: e, l: a } = s4.add(this.Ah | 0, this.Al | 0, e | 0, a | 0)), { h: b3, l: f2 } = s4.add(this.Bh | 0, this.Bl | 0, b3 | 0, f2 | 0), { h: l2, l: r2 } = s4.add(this.Ch | 0, this.Cl | 0, l2 | 0, r2 | 0), { h: u2, l: L3 } = s4.add(this.Dh | 0, this.Dl | 0, u2 | 0, L3 | 0), { h: d3, l: i } = s4.add(this.Eh | 0, this.El | 0, d3 | 0, i | 0), { h: o3, l: n2 } = s4.add(this.Fh | 0, this.Fl | 0, o3 | 0, n2 | 0), { h: H2, l: B3 } = s4.add(this.Gh | 0, this.Gl | 0, H2 | 0, B3 | 0), { h: E2, l: F2 } = s4.add(this.Hh | 0, this.Hl | 0, E2 | 0, F2 | 0), this.set(e, a, b3, f2, l2, r2, u2, L3, d3, i, o3, n2, H2, B3, E2, F2);
  }
  roundClean() {
    g2.fill(0), D2.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
};
var K2 = class extends m5 {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
};
var T = class extends m5 {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
};
var J = class extends m5 {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
var L0 = C(() => new m5());
var A0 = C(() => new K2());
var S0 = C(() => new T());
var p0 = C(() => new J());

// https://esm.sh/v135/@noble/hashes@1.4.0/denonext/sha256.js
var F = new Uint32Array([1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993, 2453635748, 2870763221, 3624381080, 310598401, 607225278, 1426881987, 1925078388, 2162078206, 2614888103, 3248222580, 3835390401, 4022224774, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986, 2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711, 113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, 2177026350, 2456956037, 2730485921, 2820302411, 3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344, 430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779, 1955562222, 2024104815, 2227730452, 2361852424, 2428436474, 2756734187, 3204031479, 3329325298]);
var b2 = new Uint32Array([1779033703, 3144134277, 1013904242, 2773480762, 1359893119, 2600822924, 528734635, 1541459225]);
var h = new Uint32Array(64);
var A2 = class extends d2 {
  constructor() {
    super(64, 32, 8, false), this.A = b2[0] | 0, this.B = b2[1] | 0, this.C = b2[2] | 0, this.D = b2[3] | 0, this.E = b2[4] | 0, this.F = b2[5] | 0, this.G = b2[6] | 0, this.H = b2[7] | 0;
  }
  get() {
    let { A: d3, B: o3, C: t, D: c2, E: e, F: f2, G: s5, H: a } = this;
    return [d3, o3, t, c2, e, f2, s5, a];
  }
  set(d3, o3, t, c2, e, f2, s5, a) {
    this.A = d3 | 0, this.B = o3 | 0, this.C = t | 0, this.D = c2 | 0, this.E = e | 0, this.F = f2 | 0, this.G = s5 | 0, this.H = a | 0;
  }
  process(d3, o3) {
    for (let x = 0; x < 16; x++, o3 += 4) h[x] = d3.getUint32(o3, false);
    for (let x = 16; x < 64; x++) {
      let u2 = h[x - 15], r2 = h[x - 2], H2 = E(u2, 7) ^ E(u2, 18) ^ u2 >>> 3, p = E(r2, 17) ^ E(r2, 19) ^ r2 >>> 10;
      h[x] = p + h[x - 7] + H2 + h[x - 16] | 0;
    }
    let { A: t, B: c2, C: e, D: f2, E: s5, F: a, G: n2, H: l2 } = this;
    for (let x = 0; x < 64; x++) {
      let u2 = E(s5, 6) ^ E(s5, 11) ^ E(s5, 25), r2 = l2 + u2 + B2(s5, a, n2) + F[x] + h[x] | 0, p = (E(t, 2) ^ E(t, 13) ^ E(t, 22)) + L2(t, c2, e) | 0;
      l2 = n2, n2 = a, a = s5, s5 = f2 + r2 | 0, f2 = e, e = c2, c2 = t, t = r2 + p | 0;
    }
    t = t + this.A | 0, c2 = c2 + this.B | 0, e = e + this.C | 0, f2 = f2 + this.D | 0, s5 = s5 + this.E | 0, a = a + this.F | 0, n2 = n2 + this.G | 0, l2 = l2 + this.H | 0, this.set(t, c2, e, f2, s5, a, n2, l2);
  }
  roundClean() {
    h.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
};
var C2 = class extends A2 {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
var y2 = C(() => new A2());
var U2 = C(() => new C2());

// src/bundled/encrypted-root-key/toBundle.ts
var go = async () => {
  const randomEntropy = await crypto.getRandomValues(new Uint8Array(32));
  const entropies = await Lit.Actions.broadcastAndCollect({
    name: "seeds",
    value: ethers.utils.hexlify(randomEntropy)
  });
  const entropyHex = entropies.reduce((acc, s5, idx) => acc + s5.slice(2), "0x");
  const entropy = H(y2, ethers.utils.arrayify(entropyHex), new Uint8Array(32), "seed", 32);
  const password = "";
  const encoder = new TextEncoder();
  const salt = encoder.encode("mnemonic" + password);
  const seed = await K(L0, entropy, salt, { c: 2048, dkLen: 64 });
  const rootHDNode = ethers.utils.HDNode.fromSeed(seed);
  const { extendedKey: bip32RootKey } = rootHDNode;
  const path = "m/44'/60'/0'/0";
  const networkHDNode = rootHDNode.derivePath(path);
  const { extendedKey: bip32ExtendedPrivateKey } = networkHDNode;
  const firstAddressHDNode = rootHDNode.derivePath("m/44'/60'/0'/0/0");
  const firstWallet = new ethers.Wallet(firstAddressHDNode);
  const { address: firstAddress, publicKey: firstAddressPubKey } = firstWallet;
  const response = JSON.stringify({
    entropy: ethers.utils.hexlify(entropy),
    bip39Seed: ethers.utils.hexlify(seed),
    bip32RootKey,
    bip32ExtendedPrivateKey,
    firstAddress,
    firstAddressPubKey,
    firstAddressPubKeyShort: firstAddressHDNode.publicKey
  });
  Lit.Actions.setResponse({ response });
};
go();
/*! Bundled license information:

@noble/hashes/esm/utils.js:
  (*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) *)
*/
