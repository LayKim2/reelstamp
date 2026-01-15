// 플랜 기능 리스트 상수
export const freePlanFeatures = [
  '제한적 릴스 시나리오 생성',
  '제한적 대화형 수정 기능',
  '제한적 메모리 및 텍스트 저장',
];

export const basicPlanFeatures = [
  '릴스 시나리오 무제한 생성',
  '대화형 수정 기능 무제한 사용',
  '제한적 메모리 및 텍스트 저장',
];

export const proPlanFeatures = [
  '릴스 시나리오 무제한 생성',
  '수정 기능 무제한 사용',
  {
    main: '영상 분석 월 20회',
    subItems: [
      '내 영상을 초 단위로 분석',
      '영상 흐름, 장면에 맞춰 시나리오 자동 최적화',
    ],
  },
  '영상 타임라인 수정 기능 무제한 사용',
];

export const masterPlanFeatures = [
  '릴스 시나리오 무제한 생성',
  '수정 기능 무제한 사용',
  {
    main: '영상 분석 무제한',
    subItems: [
      '내 영상을 초 단위로 분석',
      '영상 흐름에 맞춰 시나리오 자동 최적화',
    ],
  },
  '영상 타임라인 수정 기능 무제한 사용',
  '영상 입력 무제한',
];

// 오픈 이벤트 혜택 데이터
export const freePlanEventBenefit = {
  title: '오픈 이벤트 혜택',
  mainItem: '영상 분석 5회 제공',
  subItems: [
    '내 영상을 초 단위로 분석',
    '영상 흐름에 맞춰 시나리오 자동 최적화',
  ],
};

export const basicPlanEventBenefit = {
  title: '오픈 이벤트 혜택',
  mainItem: '영상 분석 10회 제공',
  subItems: [
    '내 영상을 초 단위로 분석',
    '영상 흐름에 맞춰 시나리오 자동 최적화',
  ],
};

