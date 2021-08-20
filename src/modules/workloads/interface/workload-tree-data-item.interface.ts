export interface WorkloadTreeDataItem {
  /* Portofolio View Section*/

  stasPlanName: string;
  stasId: number;

  ssName: string; // ss as Sub Service
  ssCode: string;
  ssId: number;

  snName: string; // sn as Sub Nature
  snId: number;

  sName: string; // s as service
  sId: number;
  sCode: string;
  sDescr: string;
  sLastUpt: string;

  wlCode: string; // wl as workload
  wlStatus: string;
  wlId: number;

  /* Entity View Section*/
  //ToDo

  /* Partner View */
  //ToDo
}
