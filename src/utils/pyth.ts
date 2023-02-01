import { PublicKey } from '@solana/web3.js';
import {
  ProductData,
  PriceData,
  Price,
  PriceComponent
} from '@pythnetwork/client';

function writePublicKeyBuffer(buf: Buffer, offset: number, key: PublicKey) {
  if (key) {
    buf.write(key.toBuffer().toString('binary'), offset, 'binary');
  }
}

export function writeProductBuffer(
  buf: Buffer,
  offset: number,
  productData: ProductData
) {
  let accountSize = productData.size;
  if (!accountSize) {
    accountSize = 48;
    for (const attrKey in productData.product) {
      if (productData.product[attrKey]) {
        accountSize += 1 + attrKey.length;
        accountSize += 1 + productData.product[attrKey].length;
      }
    }
  }

  buf.writeUint32LE(productData.magic, offset + 0);
  buf.writeUint32LE(productData.version, offset + 4);
  buf.writeUint32LE(productData.type, offset + 8);
  buf.writeUint32LE(accountSize, offset + 12);
  writePublicKeyBuffer(buf, offset + 16, productData.priceAccountKey);

  let pos = offset + 48;
  for (const attrKey in productData.product) {
    const attrValue = productData.product[attrKey];
    if (attrValue) {
      buf.writeUInt8(attrKey.length, pos);
      buf.write(attrKey, pos + 1);

      pos += 1 + attrKey.length;

      buf.writeUInt8(attrValue.length, pos);
      buf.write(attrValue, pos + 1);
    }
  }
}

export function writePriceInfoBuffer(
  buf: Buffer,
  offset: number,
  price: Price
) {
  buf.writeBigInt64LE(price.priceComponent, offset + 0);
  buf.writeBigUInt64LE(price.confidenceComponent, offset + 8);
  buf.writeUInt32LE(price.status, offset + 16);
  buf.writeUInt32LE(price.corporateAction, offset + 20);
  buf.writeBigUInt64LE(BigInt(price.publishSlot), offset + 24);
}

function writePriceComponentBuffer(
  buf: Buffer,
  offset: number,
  component: PriceComponent
) {
  component.publisher.toBuffer().copy(buf, offset);
  writePriceInfoBuffer(buf, offset + 32, component.aggregate);
  writePriceInfoBuffer(buf, offset + 64, component.latest);
}

export function writePriceBuffer(
  buf: Buffer,
  offset: number,
  priceData: PriceData
) {
  buf.writeUInt32LE(priceData.magic, offset + 0);
  buf.writeUInt32LE(priceData.version, offset + 4);
  buf.writeUInt32LE(priceData.type, offset + 8);
  buf.writeUInt32LE(priceData.size, offset + 12);
  buf.writeUInt32LE(priceData.priceType, offset + 16);
  buf.writeInt32LE(priceData.exponent, offset + 20);
  buf.writeUInt32LE(priceData.numComponentPrices, offset + 24);
  buf.writeUInt32LE(priceData.numQuoters, offset + 28);
  buf.writeBigUInt64LE(priceData.lastSlot, offset + 32);
  buf.writeBigUInt64LE(priceData.validSlot, offset + 40);
  buf.writeBigUInt64LE(priceData.emaPrice.valueComponent, offset + 48);
  buf.writeBigUInt64LE(priceData.emaPrice.numerator, offset + 56);
  buf.writeBigUInt64LE(priceData.emaPrice.denominator, offset + 64);
  buf.writeBigUInt64LE(priceData.emaConfidence.valueComponent, offset + 72);
  buf.writeBigUInt64LE(priceData.emaConfidence.numerator, offset + 80);
  buf.writeBigUInt64LE(priceData.emaConfidence.denominator, offset + 88);
  buf.writeBigInt64LE(priceData.timestamp, offset + 96);
  buf.writeUInt8(priceData.minPublishers, offset + 104);
  buf.writeInt8(priceData.drv2, offset + 105);
  buf.writeInt16LE(priceData.drv3, offset + 106);
  buf.writeInt32LE(priceData.drv3, offset + 108);
  writePublicKeyBuffer(buf, offset + 112, priceData.productAccountKey);
  writePublicKeyBuffer(buf, offset + 144, priceData.nextPriceAccountKey);
  buf.writeBigUInt64LE(priceData.previousSlot, offset + 176);
  buf.writeBigUInt64LE(priceData.previousPriceComponent, offset + 184);
  buf.writeBigUInt64LE(priceData.previousConfidenceComponent, offset + 192);
  buf.writeBigInt64LE(priceData.previousTimestamp, offset + 200);
  writePriceInfoBuffer(buf, offset + 208, priceData.aggregate);

  let pos = offset + 240;
  for (const comp of priceData.priceComponents) {
    if (comp.publisher) {
      writePriceComponentBuffer(buf, pos, comp);
      pos += 96;
    } else {
      break;
    }
  }
}
