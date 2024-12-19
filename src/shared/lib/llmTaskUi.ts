export const CREATE_CONFIG_70B = {
  top_p: 0.7,
  top_k: 1,
  temperature: 0.9,
  presence_penalty: 0.0,
  frequency_penalty: 0.0,
  repetition_penalty: 1.1,
  beam_width: 1,
};
export const CREATE_CONFIG = {
  top_p: 0.6,
  top_k: 1,
  temperature: 0.9,
  presence_penalty: 0.1,
  frequency_penalty: 0.05,
  beam_width: 1,
};

export const SCRIPT_CREATE_CONFIG = {
  top_p: 0.7,
  top_k: 1,
  temperature: 2,
  presence_penalty: 0,
  frequency_penalty: 0,
  repetition_penalty: 1.1,
  beam_width: 1,
};

export const STANDARDIZATION_CREATE_CONFIG = {
  top_p: 0.7,
  top_k: 1,
  temperature: 0.5,
  presence_penalty: 0.0,
  frequency_penalty: 0.0,
  repetition_penalty: 0.5,
  beam_width: 1,
};

export const RECREATE_CONFIG = {
  top_p: 1,
  top_k: 4,
  temperature: 0.9,
  presence_penalty: 0.1,
  frequency_penalty: 0.05,
  beam_width: 2,
};

export const SOCKET_EVENT_LLM = {
  FETCH_S_ID: 'session_info', // Orchestra ID
  ROOM_CREATE: 'room_create',
  ROOM_CONNECT: 'room_connect',
  LLM: {
    REQUEST: 'llm_task_request',
    RESPONSE_START: 'llm_task_response_start',
    RESPONSE: 'llm_task_response',
    RESPONSE_END: 'llm_task_response_end',
  },
  SDF: {
    REQUEST: 'sdf_request',
    RESPONSE_START: 'sdf_response_start',
    RESPONSE: 'sdf_response',
    RESPONSE_END: 'sdf_response_end',
  },
};

export const LLM_TASK_EMAIL_SEND_RADIO_PURPOSE_01 = [
  {
    id: 'propose',
    value: 'llm:사업_제안',
    label: 'llm:사업_제안',
    defaultChecked: true,
  },
  {
    id: 'request',
    value: 'llm:미팅_신청',
    label: 'llm:미팅_신청',
    defaultChecked: false,
  },
];

export const NEWS_LANGUAGES_CHANGES = [
  { value: 'Korean', label: 'llm:한국어' },
  { value: 'English', label: 'llm:영어' },
];

export const TRANSLATE_LANGUAGE_CHANGES = [{ value: 'English', label: 'llm:영어' }];

export const CODE_LANGUAGES_CHANGES = [
  { value: 'Python', label: 'Python' },
  { value: 'Java', label: 'Java' },
  { value: 'Javascript', label: 'Javascript' },
];

export const LLM_TASK_EMAIL_SEND_RADIO_PURPOSE_02 = [
  {
    id: 'schedule',
    value: 'llm:미팅_일정_조정',
    label: 'llm:미팅_일정_조정',
    defaultChecked: false,
  },
  {
    id: 'support',
    value: 'llm:업무_지원요청',
    label: 'llm:업무_지원요청',
    defaultChecked: false,
  },
  {
    id: 'share',
    value: 'llm:업무_진행상황_공유',
    label: 'llm:업무_진행상황_공유',
    defaultChecked: false,
  },
];

export const LLM_TASK_EXAMPLE = {
  email: {
    SEND: [
      {
        purpose: '사업 제안',
        content:
          '자사의 TTS모델을 활용하여 텍스트를 자연스러운 음성으로 변환하여 비즈니스단에서 다양한 활용이 가능합니다. 오디오 북 제작, 가상 비서 개발, 접근성 강화, 캐릭터 제작, 교육 자료 제작 등에서 도움이 될 수 있습니다.',
      },
      {
        purpose: '미팅 신청',
        content:
          '프로젝트 논의를 위해 미팅을 요청합니다. 특히, 개발 중인 DEF 애플리케이션의 진행 상황을 점검하고 싶습니다.',
      },
    ],
  },

  code: [
    {
      language: 'Python',
      content: '주어진 숫자가 소수인지 아닌지를 결정하는 함수를 작성하세요.',
    },
    {
      language: 'Java',
      content: '정렬된 리스트에서 특정 값의 인덱스를 이진 탐색을 사용하여 찾는 함수를 작성하세요.',
    },
    {
      language: 'Javascript',
      content: '주어진 그래프에서 깊이 우선 탐색을 구현하는 함수를 작성하세요.',
    },
  ],
  promotion: [
    {
      productName: 'PureBreeze 공기 필터',
      productInfo: '첨단 HEPA 여과 기술 사용',
      detailedService: 'HEPA 기술이 공기 중 입자 99.98%를 포착',
      companyName: '에코에어 솔루션즈',
      keyword: '친환경, 순수',
      target: '모든 연령, 모든 성별',
    },
    {
      productName: 'ClearWave 공기 정화기',
      productInfo: 'UV-C 빛을 사용하여 공기 중 세균 살균',
      detailedService: '공기를 살균하여 박테리아와 바이러스 제거',
      companyName: '클린에어 테크놀로지',
      keyword: '공기 정화, 항균, 안전',
      target: '가족, 사무실',
    },
    {
      productName: 'BioHeal 프로바이오틱 보충제',
      productInfo: '고급 프로바이오틱 보충제, 건강 및 면역 지원을 위한 독특한 균주 혼합',
      detailedService: '서빙 당 100억 CFU로, 높은 효능과 효과 보장',
      companyName: '헬스퍼스트 뉴트리셔널스',
      keyword: '건강, 프로바이오틱',
      target: '모든 연령',
    },
  ],
  news: [
    {
      topic: '뛰어난 주행 거리와 신속한 충전 기능을 갖춘 DEF 전기차 모델 E 출시',
      content:
        'DEF 모델 E는 400마일의 주행 거리와 0-60mph 3.5초의 가속력을 자랑합니다. 350kW 급속 충전이 가능하며, 자율 주행 기능을 탑재했습니다. 5년/60,000마일 보증을 제공하며, 가격은 45,000달러입니다. 첫 1,000대 한정으로 무료 충전 크레딧을 제공합니다.',
    },
    {
      topic: '개인 맞춤형 운동 계획과 AI 코치가 제공되는 FitLife 앱 출시',
      content:
        'FitLife 앱은 개인 맞춤형 운동 계획과 식단 추적 기능을 제공하며, AI 기반의 운동 코치 기능을 갖추고 있습니다. 월 구독료는 9.99달러이며, 첫 달 무료 체험을 제공합니다. 친구 초대 시 1개월 무료 이용 혜택도 있습니다.',
    },
    {
      topic: '비건 화장품과 항산화 성분을 포함한 GlowBeauty 신제품 라인 출시',
      content:
        'GlowBeauty 신제품 라인은 비건 화장품으로, 항산화 세럼, 히알루론산 보습 크림, SPF50 선스크린을 포함합니다. 모든 제품은 동물 실험을 하지 않았으며, 가격대는 20-50달러입니다. 첫 구매 시 15% 할인 코드를 제공합니다.',
    },
  ],

  script: [
    {
      topic: '해커톤 개최',
      content: '마음AI 판교 본사 4층에서. 취업준비생들과. 공공 데이터를 활용해서.',
    },
    {
      topic: '효과적인 시간 관리 전략',
      content:
        '개인 및 직업 생활에서 시간 관리의 중요성, 다양한 시간 관리 기술: 포모도로 기법, 아이젠하워 매트릭스, 시간 블로킹, 시간 관리를 도와주는 도구 및 앱, 일반적인 시간 관리 함정을 피하는 팁, 일과 휴식 및 취미에 시간을 포함한 균형 잡힌 일정 만들기.',
    },
    {
      topic: 'DIY 홈 데코 프로젝트',
      content:
        'DIY 홈 데코의 소개와 그 이점, 여러 프로젝트에 대한 단계별 가이드: 가구 페인팅, 벽 장식 만들기, 장식용 베개 만들기, 각 프로젝트에 필요한 재료와 도구, 예산 친화적인 공급품 조달 팁, 완료된 프로젝트의 영감이 되는 전후 사진.',
    },
  ],

  core_summary: [
    {
      content: `여러분, 안녕하세요!
  
        오늘 저희는 함께 모여 교통 안전에 대해 이야기하고, 우리가 취할 수 있는 조치들에 대해 고민해보려고 합니다. 교통 안전은 우리 모두가 함께 지켜야 할 매우 중요한 문제입니다. 우리는 도로에서 안전하게 이동할 수 있을 뿐만 아니라 다른 이들도 안전하게 이동할 수 있도록 노력해야 합니다.
        
        첫째로, 우리는 교통 규칙을 잘 지켜야 합니다. 우리는 빨간 불에서 멈춰야 하고, 횡단보도에서는 보행자 우선 원칙을 준수해야 합니다. 또한, 운전 중에는 휴대전화 사용을 삼가고, 안전벨트를 착용하는 등의 안전 수칙을 준수해야 합니다. 우리가 이런 작은 조치들을 지키면, 우리의 도로는 훨씬 안전해질 것입니다.
        
        둘째로, 우리는 서로에 대한 배려와 예의를 갖는 것이 중요합니다. 우리가 도로를 함께 사용하는 것은 서로에 대한 배려와 존중이 필요한 시간입니다. 우리는 차량 운전자일 때는 보행자와 자전거 타는 사람들에게 충분한 공간을 주어야 합니다. 반면 보행자나 자전거 타는 사람으로서는 도로 규칙을 잘 따라야 하며, 운전자의 시야를 가려서는 안 됩니다.`,
      limitNumber: '10',
    },
    {
      content: `재생 에너지의 사용이 확대되면서 전력망의 안정성 문제가 대두되고 있다. 태양광, 풍력, 수력 등 재생 에너지는 지속 가능한 에너지원으로 각광받고 있으며, 탄소 배출을 줄이는 데 중요한 역할을 한다. 그러나 재생 에너지는 날씨와 같은 환경 요인에 크게 영향을 받아 생산량이 일정하지 않다는 단점이 있다. 이러한 변동성은 전력망의 안정성을 저해할 수 있으며, 전력 공급에 불안정을 초래할 수 있다. 이를 해결하기 위해 에너지 저장 기술, 예를 들어 배터리 시스템이나 수소 저장 기술 등이 개발되고 있다. 또한, 스마트 그리드 기술을 통해 전력 수요와 공급을 실시간으로 관리하고 최적화할 수 있다. 지속 가능한 에너지 전환을 위해서는 이러한 기술적 발전과 함께 정책적 지원이 필요하다.`,
      limitNumber: '10',
    },
  ],
  revision: [
    {
      content: '스마트폰이 저ㅁ점 더 발줜하면서 사람들은 마는 일을 할 수 있게 됬다. 그로 인혜 만은 변화를 가져왔다.',
    },
    {
      content: `퇀소중립을 실천하는 공기업으로 ESG 경영을 최우숸의 가취로 노력하고 있다. 
  나아가 근로자와 국민 보호하기 위해 최선을 다하고 있.`,
    },
    {
      content: `최근 몇년간 기술이 급속히 발전하면서 많은 변화가 일어났다. 특히, 인공지능과 머신러닝의 발전은 우리의 삶을 크게 바꾸고 있다요. 이러한 기술들은 다양한 산업에서 사용되고 있으며, 앞으로 더 많은 발전이 기대된다. 우리는 이러한 변화를 잘 준비해야 한다.
  `,
    },
  ],
  translate: [
    {
      content: '기후 변화로 인한 지구 온난화가 심각해지고 있으며, 이에 대한 대책 마련이 시급하다.',
    },
  ],
  analysis: [
    {
      content: `최근 기후 변화로 인한 지구 온난화 문제가 전 세계적으로 큰 이슈가 되고 있다. 과학자들은 지구 온도가 산업화 이전보다 약 1.2도 상승했다고 경고하고 있으며, 이로 인해 극지방의 빙하가 빠르게 녹고 있다. 이는 해수면 상승을 초래하여 해안 지역 주민들에게 심각한 위협이 되고 있다. 또한, 기후 변화로 인한 이상 기후 현상, 예를 들어 극심한 폭염, 가뭄, 홍수 등이 빈번하게 발생하고 있어 농업과 수자원 관리에도 큰 타격을 주고 있다. 이에 따라 각국 정부와 국제 기구는 탄소 배출을 줄이기 위한 다양한 정책을 추진하고 있으며, 재생 에너지 사용 확대, 산림 보호, 친환경 기술 개발 등의 노력이 필요하다. 지속 가능한 미래를 위해서는 글로벌 협력이 절실히 요구된다.`,
      details: '기사 어조',
    },
    {
      content: `우주 탐사 기술이 발전하면서 민간 우주 여행 시대가 열리고 있다. 과거에는 국가 주도의 우주 탐사가 주를 이루었으나, 최근에는 스페이스X, 블루 오리진, 버진 갤럭틱 등 민간 기업들이 우주 탐사와 우주 여행 시장에 진출하고 있다. 이들 기업은 상업용 우주선 개발과 우주 관광 사업을 통해 새로운 시장을 개척하고 있다. 특히, 스페이스X는 유인 우주선 드래곤을 통해 국제우주정거장(ISS)으로의 왕복 임무를 성공적으로 수행했으며, 우주 관광객을 태운 민간 우주 여행도 계획하고 있다. 이러한 민간 우주 탐사는 우주 산업의 발전을 촉진하고, 더 많은 사람들이 우주를 경험할 수 있는 기회를 제공할 것이다. 그러나 우주 여행의 상용화를 위해서는 안전성 확보와 비용 절감, 그리고 국제적인 규제와 협력이 필요하다.`,
      details: '핵심 포인트',
    },
    {
      content: `데이터 프라이버시 문제가 중요해지면서 관련 규제가 강화되고 있다. 디지털화와 데이터의 폭발적인 증가로 인해 개인 정보의 유출과 오용에 대한 우려가 커지고 있다. 이에 따라 각국 정부는 데이터 프라이버시 보호를 위한 법적 제도를 강화하고 있으며, 기업들은 개인정보 보호 정책을 준수하기 위해 노력하고 있다. 예를 들어, 유럽연합은 GDPR(일반 데이터 보호 규정)을 시행하여 개인 정보 보호를 강화하고 있으며, 미국은 CCPA(캘리포니아 소비자 개인 정보 보호법)을 통해 소비자의 개인 정보 권리를 보호하고 있다. 데이터 프라이버시 문제는 기술적 문제뿐만 아니라 윤리적 문제이기도 하다. 기업과 정부는 개인정보 보호를 위한 기술적 조치와 함께, 투명한 정보 관리와 사용자 동의 절차를 강화해야 한다.`,
      details: '주요 주제',
    },
  ],
};

export const LLM_TASK_EXAMPLE_ENG = {
  email: {
    SEND: [
      {
        purpose: 'Business Proposal',
        content:
          'Hello, we are a company that provides AI chatbot services utilizing cutting-edge technology. Our service will greatly improve user experience and enhance work efficiency.',
      },
      {
        purpose: 'Meeting Request',
        content:
          "We believe that through a partnership with your company, we can explore new markets and strengthen each other's competitiveness. We propose to consider ways to collaborate on new product development and marketing together.",
      },
      {
        purpose: 'Meeting Request',
        content:
          "To enhance your company's customer service quality, we propose the introduction of an AI chatbot solution to support customer inquiries.",
      },
    ],
  },

  code: [
    {
      language: 'Python',
      content: 'Modify Excel file to CSV and visualize data',
    },
    {
      language: 'Java',
      content: 'Calculate quotient from two integers input',
    },
    {
      language: 'Javascript',
      content: 'Print multiplication table',
    },
  ],
  promotion: [
    {
      numberOfsampleString: 2,
      productName: 'Clean Toothpaste',
      productInfo: 'Long-lasting freshness with added whitening function',
      detailedService: 'Maintains 20 teeth until your 80s',
      companyName: 'Maum Healthcare',
      keyword: 'Freshness, whitening, cleanliness',
      target: 'Suitable for all ages and genders',
    },
  ],
  news: [
    {
      topic:
        'With a design optimized for body structure, the new mattresses LovelyDream and HelpSleep help improve the quality of sleep.',
      content:
        'The two new products use independent springs, placing each spring individually to minimize reaction to body movements, providing a comfortable sleeping environment.',
    },
  ],

  script: [
    {
      topic: 'Hackathon organized',
      content: 'At the 4th floor of Mind AI headquarters in Pangyo, with job seekers, utilizing public data.',
    },
    {
      topic: 'Sharing Cooking Secrets',
      content:
        'Introducing some cooking secrets, the importance of ingredient selection, cooking tips and tricks, etc.',
    },
    {
      topic: 'Raising Awareness of Social Issues',
      content: 'Awareness of poverty issues, ways to promote social equality, importance of volunteering, etc.',
    },
  ],

  core_summary: [
    {
      content: `Hello everyone! Today, we are gathered to talk about traffic safety and to think about the actions we can take. Traffic safety is a very important issue that we all need to work on together. Not only should we ensure our own safe travel, but we must also strive to keep others safe on the roads.
        First, we must adhere to traffic rules. We should stop at red lights, prioritize pedestrians at crosswalks, refrain from using mobile phones while driving, and always wear seat belts. By following these simple steps, our roads will become much safer.
        Second, it is important to have consideration and courtesy for each other. Sharing the road requires mutual respect and understanding. When driving, we should give enough space to pedestrians and cyclists. Conversely, as pedestrians or cyclists, we should follow road rules and not obstruct drivers’ views.
        `,
      limitNumber: '10',
    },
  ],
  revision: [
    {
      content: "He don't like pizza because it have too much cheese. His sister, however, eats it every day.",
    },
    {
      content: "The cat chase it's tail around the room. It doesn't seem to gets tired.",
    },
    {
      content: "She go to the gym every morning, but she don't see any results. Her trainer says to be patient.",
    },
  ],
  translate: [
    {
      content: 'Many life failures are when a person gives up not realizing how close they are to success.',
    },
  ],
  analysis: [
    {
      content: `On the 22nd, MaumAI (CEO Taejoon Yoo), Korea's leading artificial intelligence (AI) platform, announced that it has received the KC Mark, the national integrated certification mark, for its AI-based premium kiosk 'Barrier-free Kiosk', which is designed for easy use by socially disadvantaged individuals. MaumAI plans to strengthen its business and operations accordingly.
  
  According to a representative from MaumAI, “Currently, we are actively supplying kiosks equipped with barrier-free functions through partnerships with Elevizone and Dot, for which we are undergoing various certification processes, such as barrier-free certification evaluation and innovative procurement registration.”
  
  This move seems to be a swift response to the enforcement of the revised Anti-Discrimination Against Persons with Disabilities Act as of January 28, which mandates the installation of such kiosks in public, educational, and financial institutions.
  
  MaumAI’s barrier-free kiosk includes 13 features to enhance accessibility for socially disadvantaged individuals such as wheelchair users, visually impaired, hearing impaired, and the elderly.
  
  Firstly, ▷for wheelchair users, the kiosk adjusts the height of the screen and braille display device according to the user's eye level, detected by sensors. This feature utilizes patented technology (Patent No. 10-1084029) owned by Elevizone, which MaumAI has partnered with, allowing for a vertical movement range of 400mm between 1500mm and 1900mm, controlled by automatic IR sensors.
  
  ▷For visually impaired individuals (totally blind), a digital tactile device is provided to check menu names in braille. Additionally, all visual information can be provided through voice via a screen operation keypad. ▷For the elderly and visually impaired individuals (low vision, color blindness), text size adjustment in two stages and a high-contrast mode are available to facilitate easier use.
  
  ▷For hearing impaired individuals, all auditory information is also provided visually. Moreover, a 'call button' is available to replace voice-activated calls, aiding hearing impaired users in accessing services.
  
  ▷Additionally, the kiosk allows volume adjustment in four levels, offers Korean/English language options, and includes a 3.5mm headphone jack for private listening. A manual height adjustment button is also available.
  
  Meanwhile, MaumAI is committed to continuous enhancement, barrier-free certification evaluation, and innovative procurement registration to ensure that all people, including the socially disadvantaged, can conveniently use the kiosks.
  
  In response to the growing barrier-free kiosk market, MaumAI’s swift delivery and spread of these kiosks may enable it to dominate the premium market and establish itself as a leading company.
        `,
      details: 'Extract Keywords',
    },
  ],
};
