import { isNumber, includes } from 'lodash';
import { Logger } from '@nestjs/common';
import { Unit } from './../interfaces/common-interfaces';
import { GLOBAL_CONST } from './../../constants';

export const AMOUNT_UNITS = ['mandays', 'keuros', 'keurossales', 'klocalcurrency'];

export const multiply = (value, multiplier) => {
  if (isNumber(value) && isNumber(multiplier)) {
    return value * multiplier;
  }
  return 0;
};

export const divide = (value: number, divider: number) => {
  if (isNumber(value) && isNumber(divider) && divider !== 0) {
    return value / divider;
  }
  return 0;
};

export const validateUnitInput = (unit: string) => {
  if (!includes(AMOUNT_UNITS, unit)) {
    Logger.error('Invalid unit');
    return false;
  }
  return true;
};

export const convertKLCToKEuros = (klc: number, rate: number) => {
  return multiply(klc, rate);
};

export const convertKLCToKEurosSales = (kEuros, price, sellPrice) => {
  if (!isNumber(price)) price = 0;
  if (!isNumber(sellPrice)) sellPrice = 0;
  if (sellPrice && !price) price = 1;
  if (price == 0 && sellPrice == 0) return 0;

  const multiplier = divide(sellPrice, price);
  return multiply(kEuros, multiplier);
};

export const convertKEurosToKLC = (kEuros, rate) => {
  return divide(kEuros, rate);
};

export const convertKEurosToManDays = (kEuros, price) => {
  return divide(kEuros, price);
};

export const convertManDaysToKEuros = (manDays, price) => {
  return multiply(manDays, price);
};

export const convertManDaysToKEurosSales = (manDays, sellPrice) => {
  return multiply(manDays, sellPrice);
};

export const convertKEurosSalesToManDays = (kEuros, sellPrice) => {
  return divide(kEuros, sellPrice);
};

export const convertFromUnitAToUnitB = (value: number, unitA: string, unitB: string, rate: number, price: number, sellPrice: number) => {
  let valueInKEuro: number, valueInKEuroSales: number, valueInKLC: number, valueInManDay: number;

  if (!validateUnitInput(unitA) || validateUnitInput(unitB)) {
    return;
  }

  if (!isNumber(value)) {
    Logger.error('Expecting number, received ' + typeof value);
    return;
  }

  switch (unitA) {
    case unitB:
      return value;
    case GLOBAL_CONST.AMOUNT_UNITS.KLC:
      valueInKEuro = convertKLCToKEuros(value, rate);
      if (unitB === GLOBAL_CONST.AMOUNT_UNITS.KEURO_SALES) {
        return convertKLCToKEurosSales(valueInKEuro, price, sellPrice);
      }
      return convertFromUnitAToUnitB(valueInKEuro, GLOBAL_CONST.AMOUNT_UNITS.KEURO, unitB, rate, price, sellPrice);
    case GLOBAL_CONST.AMOUNT_UNITS.KEURO:
      valueInManDay = convertKEurosToManDays(value, price);
      return convertFromUnitAToUnitB(valueInManDay, GLOBAL_CONST.AMOUNT_UNITS.MD, unitB, rate, price, sellPrice);
    case GLOBAL_CONST.AMOUNT_UNITS.MD:
      valueInKEuroSales = convertManDaysToKEurosSales(value, sellPrice);
      return convertFromUnitAToUnitB(valueInKEuroSales, GLOBAL_CONST.AMOUNT_UNITS.KEURO_SALES, unitB, rate, price, sellPrice);
    case GLOBAL_CONST.AMOUNT_UNITS.KEURO_SALES:
      valueInManDay = convertKEurosSalesToManDays(value, sellPrice);
      valueInKEuro = convertManDaysToKEuros(valueInManDay, price);
      valueInKLC = convertKEurosToKLC(valueInKEuro, rate);
      return convertFromUnitAToUnitB(valueInKLC, GLOBAL_CONST.AMOUNT_UNITS.KLC, unitB, rate, price, sellPrice);
    default:
      Logger.error('Invalid recursion in price');
  }
};

export const createAmountEntity = (value: number, unit: string, rate: number, price: string, sellPrice: string) => {
  if (!validateUnitInput(unit)) return;
  if (!isNumber(value)) {
    Logger.error(`Expecting number, received ${typeof value}`);
    return;
  }

  const amount = {};
  amount[unit] = value;

  // for (const unitFromModel of GLOBAL_CONST.AMOUNT_UNITS)
  //   unless unitFromModel is unit
  //     amount[unitFromModel] = Amount.convertFromUnitAToUnitB value, unit, unitFromModel, rate, price, sellPrice

  return amount;
};
