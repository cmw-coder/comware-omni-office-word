export interface ReportSkuDto {
  begin?: number;
  end?: number;
  count: number;
  type: 'AIGC';
  product: 'WORD';
  firstClass: 'CODE';
  secondClass: string;
  skuName: 'ADOPT' | 'GENE' | 'KEEP';
  user: string;
  userType: 'USER' | 'HOST';
  extra?: string;
  subType?: string;
  hostName?: string;
}
