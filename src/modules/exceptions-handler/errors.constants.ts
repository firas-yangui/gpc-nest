export const ERRORS = Object.freeze({
  MISSING: Object.freeze({
    CODE: 1,
    TYPE: 'Value is missing',
    DESCRIPTION: 'One or more values are missing',
  }),
  NOTFOUND: Object.freeze({
    CODE: 2,
    TYPE: 'Not Found',
    DESCRIPTION: 'Not Found',
  }),
  PERCENTAGE_KO: Object.freeze({
    CODE: 3,
    TYPE: 'PERCENTAGE KO',
    DESCRIPTION: 'THE SUM OF PERCENTAGES OF PARTNERS SHOULD BE UP TO 100',
  }),
  DATES_KO: Object.freeze({
    CODE: 4,
    TYPE: 'DATES KO',
    DESCRIPTION: 'END DATE SHOULD BE AFTER THAN START DATE',
  }),
  ACTIVITY_NOT_FOUND: Object.freeze({
    CODE: 4,
    TYPE: 'ACTIVITY NOT FOUND',
    DESCRIPTION: 'ACTIVITY NOT FOUND FOR THIS ACTIVITY CODE',
  }),
  THIRDPARTY_NOT_FOUND: Object.freeze({
    CODE: 5,
    TYPE: 'THIRDPARTY NOT FOUND',
    DESCRIPTION: 'THIRDPARTY NOT FOUND',
  }),
});
