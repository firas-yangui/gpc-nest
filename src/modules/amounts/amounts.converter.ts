import { isNumber, includes } from 'lodash';
import { Logger, Injectable } from '@nestjs/common';
import { Unit } from '../interfaces/common-interfaces';
import { ConstantService } from '../constants/constants';
import { Amount } from './amount.entity';

@Injectable()
export class AmountConverter {
  AMOUNT_UNITS = ['mandays', 'keuros', 'keurossales', 'klocalcurrency'];

  constructor(private readonly constantService: ConstantService) {}

  multiply = (value, multiplier) => {
    if (isNumber(value) && isNumber(multiplier)) {
      return value * multiplier;
    }
    return 0;
  };

  divide = (value: number, divider: number) => {
    if (isNumber(value) && isNumber(divider) && divider !== 0) {
      return value / divider;
    }
    return 0;
  };

  validateUnitInput = (unit: string) => {
    const units = Object.values(this.constantService.GLOBAL_CONST.AMOUNT_UNITS);
    if (!includes(units, unit)) {
      Logger.error('Invalid unit: ', unit);
      return false;
    }
    return true;
  };

  convertKLCToKEuros = (klc: number, rate: number) => {
    return this.multiply(klc, rate);
  };

  convertKLCToKEurosSales = (kEuros, price, sellPrice) => {
    if (!isNumber(price)) price = 0;
    if (!isNumber(sellPrice)) sellPrice = 0;
    if (sellPrice && !price) price = 1;
    if (price == 0 && sellPrice == 0) return 0;

    const multiplier = this.divide(sellPrice, price);
    return this.multiply(kEuros, multiplier);
  };

  convertKEurosToKLC = (kEuros, rate) => {
    return this.divide(kEuros, rate);
  };

  convertKEurosToManDays = (kEuros, price) => {
    return this.divide(kEuros, price);
  };

  convertManDaysToKEuros = (manDays, price) => {
    return this.multiply(manDays, price);
  };

  convertManDaysToKEurosSales = (manDays, sellPrice) => {
    return this.multiply(manDays, sellPrice);
  };

  convertKEurosSalesToManDays = (kEuros, sellPrice) => {
    return this.divide(kEuros, sellPrice);
  };

  convertFromUnitAToUnitB = (value: number, unitA: string, unitB: string, rate: number, price: number, sellPrice: number) => {
    let valueInKEuro: number, valueInKEuroSales: number, valueInKLC: number, valueInManDay: number;
    const AMOUNT_UNITS = this.constantService.GLOBAL_CONST.AMOUNT_UNITS;

    if (!this.validateUnitInput(unitA) || !this.validateUnitInput(unitB)) {
      Logger.error('units are not valid');
      return;
    }

    if (!isNumber(value)) {
      Logger.error('Expecting number, received ' + typeof value);
      return;
    }

    switch (unitA) {
      case unitB:
        return value;
      case AMOUNT_UNITS.KLC:
        valueInKEuro = this.convertKLCToKEuros(value, rate);
        if (unitB === AMOUNT_UNITS.KEURO_SALES) {
          return this.convertKLCToKEurosSales(valueInKEuro, price, sellPrice);
        }
        return this.convertFromUnitAToUnitB(valueInKEuro, AMOUNT_UNITS.KEURO, unitB, rate, price, sellPrice);
      case AMOUNT_UNITS.KEURO:
        valueInManDay = this.convertKEurosToManDays(value, price);
        return this.convertFromUnitAToUnitB(valueInManDay, AMOUNT_UNITS.MD, unitB, rate, price, sellPrice);
      case AMOUNT_UNITS.MD:
        valueInKEuroSales = this.convertManDaysToKEurosSales(value, sellPrice);
        return this.convertFromUnitAToUnitB(valueInKEuroSales, AMOUNT_UNITS.KEURO_SALES, unitB, rate, price, sellPrice);
      case AMOUNT_UNITS.KEURO_SALES:
        valueInManDay = this.convertKEurosSalesToManDays(value, sellPrice);
        valueInKEuro = this.convertManDaysToKEuros(valueInManDay, price);
        valueInKLC = this.convertKEurosToKLC(valueInKEuro, rate);
        return this.convertFromUnitAToUnitB(valueInKLC, AMOUNT_UNITS.KLC, unitB, rate, price, sellPrice);
      default:
        Logger.error('Invalid recursion in price');
    }
  };

  createAmountEntity = (value: number, unit: string, rate: number, price: number, sellPrice: number): any => {
    const AMOUNT_UNITS = this.constantService.GLOBAL_CONST.AMOUNT_UNITS;
    if (!this.validateUnitInput(unit)) return;
    if (!isNumber(value)) {
      Logger.error(`Expecting number, received ${typeof value}`);
      return;
    }

    const amount = {};
    amount[unit] = value;

    Object.values(AMOUNT_UNITS).forEach(unitFromModel => {
      if (unitFromModel !== unit) {
        amount[unitFromModel] = this.convertFromUnitAToUnitB(value, unit, unitFromModel, rate, price, sellPrice);
      }
    });

    return amount;
  };
}
