export interface Effect {
  typeName: string;
  effectName: string;
  weight: number;
  pickWeight: number; //연성 중 뽑힐 확률
  greatWeight: number; //대성공 확률
  isLocked: boolean; //봉인 되었는가
  gauge: number; // 엘릭서 게이지
}
