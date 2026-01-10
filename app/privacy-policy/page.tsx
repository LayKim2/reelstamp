// 개인정보 처리방침 페이지
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '개인정보 처리방침 - 릴스탬프',
  description: '릴스탬프 개인정보 처리방침',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8">릴스탬프 개인정보처리방침</h1>
        
        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <p className="text-gray-700 leading-relaxed mb-4">
              릴스탬프(이하 &quot;릴스탬프&quot;)는 정보통신서비스 제공자로서 개인정보의 수집/이용 및 제공 등에 관하여 대한민국 관계 법령 및 개인정보보호 규정을 준수하며, 개인정보 자기결정권 등 이용자의 개인정보에 관한 권리를 적극적으로 보장합니다. 본 개인정보처리방침은 릴스탬프가 제공하는 릴스탬프 서비스(이하 &quot;서비스&quot;)에 적용됩니다.
            </p>
            <p className="text-gray-700 leading-relaxed">
              릴스탬프의 서비스를 실제 이용하는 개인정보주체인 이용자(이하 &quot;이용자&quot;)는 회원가입 시에 본 개인정보처리방침의 내용을 확인한 후 &quot;가입하기&quot; 버튼을 누르거나, 기타 다른 상황에서 &quot;동의하기&quot; 버튼을 누름에 따라, 위 개인정보처리방침에 따른 릴스탬프의 개인정보 수집, 이용 및 제공에 대하여 동의한 것으로 간주됩니다.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">제1조 (수집하는 개인정보)</h2>
            <ol className="list-decimal list-inside space-y-4 text-gray-700">
              <li>수집 목적
                <p className="ml-6 mt-2">
                  릴스탬프는 서비스 이용을 위하여 필요한 이용자의 최소한의 개인정보를 수집하며, 이용자의 선택에 따라 마케팅 정보 제공을 위하여 이용자의 개인정보를 수집할 수 있습니다. 그 밖에 다른 목적으로 위 개인정보를 수집할 경우 이용자로부터 별도의 동의를 받습니다.
                </p>
              </li>
              <li>수집하는 개인정보의 항목
                <p className="font-semibold mt-2 mb-2">이용자의 &apos;회원가입&apos; 시 수집되는 정보</p>
                <p className="font-semibold mb-2">필수 수집하는 개인정보</p>
                <ul className="list-disc list-inside ml-6 space-y-1 mb-4">
                  <li>수집항목 : 이름, 이메일 주소, 비밀번호</li>
                  <li>수집목적 : 릴스탬프의 계정 생성 및 관리, 서비스의 제공 및 개선, 이용자와의 의사소통 및 지원, 홍보 및 마케팅 이용 및 정보의 제공</li>
                </ul>
                <p className="mb-2">필수 수집하는 개인정보에 관하여 개인정보 수집 및 이용동의를 거부하실 경우 릴스탬프 서비스 신청 및 이용이 제한됩니다.</p>
                
                <p className="font-semibold mt-4 mb-2">선택 수집하는 개인정보</p>
                <ul className="list-disc list-inside ml-6 space-y-1 mb-4">
                  <li>수집항목 : 휴대전화번호</li>
                  <li>수집목적 : 릴스탬프의 계정 생성 및 관리, 서비스의 제공 및 개선, 이용자와의 의사소통 및 지원, 홍보 및 마케팅 이용 및 정보의 제공</li>
                </ul>
                <p className="mb-2">선택 수집하는 개인정보에 관하여 개인정보 수집 및 이용동의를 거부하실 경우에도 릴스탬프 서비스 신청 및 이용은 가능하나, 서비스 이용에 제한 또는 불이익이 발생할 수 있습니다.</p>

                <p className="font-semibold mt-4 mb-2">서비스 이용 과정에서 수집되는 정보</p>
                <p className="font-semibold mb-2">필수 수집하는 개인정보</p>
                <ul className="list-disc list-inside ml-6 space-y-1 mb-4">
                  <li>수집항목 : 이용자 정보(ID, 닉네임), 접속하는 기기정보(제조사 및 모델명, 기기고유번호, OS버전, 통신사, 접속하는 브라우저), 접속하는 위치정보(국가, 시/군/구, IP주소), 접속일시, 접속통계</li>
                  <li>수집목적 : 서비스 개선 및 부정사용 모니터링</li>
                </ul>
                <p className="mb-2">이와 같이 수집된 정보는 개인정보와 연계된다면 개인정보에 해당할 수 있지만, 연계되지 않을 경우 개인정보에 해당하지 않습니다.</p>
              </li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">제2조 (웹 기반 서비스 제공을 위한 쿠키의 설치 및 운영)</h2>
            <ol className="list-decimal list-inside space-y-4 text-gray-700">
              <li>쿠키란?
                <p className="ml-6 mt-2">
                  이용자가 웹사이트를 접속할 때 해당 웹사이트에서 이용자의 브라우저에 보내는 아주 작은 텍스트 파일로 이용자 PC에 저장됩니다.
                </p>
              </li>
              <li>사용목적
                <p className="ml-6 mt-2">
                  개인화되고 맞춤화된 서비스를 제공하기 위해서 이용자의 정보를 저장하고 수시로 불러오는 쿠키를 사용합니다. 이용자가 웹사이트에 방문할 경우 웹사이트 서버는 이용자의 디바이스에 저장되어 있는 쿠키를 읽어 이용자의 환경설정을 유지하고 맞춤화된 서비스를 제공하게 됩니다. 쿠키는 이용자가 웹사이트를 방문할 때, 웹사이트 사용을 설정한대로 접속하고 편리하게 사용할 수 있도록 돕습니다. 또한, 이용자의 웹사이트 방문 기록, 이용 형태를 통해서 최적화된 광고 등 맞춤형 정보를 제공하기 위해 활용됩니다.
                </p>
              </li>
              <li>쿠키 수집 거부
                <p className="ml-6 mt-2">
                  이용자는 쿠키 설치에 대한 선택권을 가지고 있으며, 이용자가 사용하는 웹 브라우저 상단의 &apos;설정 &gt; 개인정보보호 &gt; 쿠키 및 기타 사이트 데이터&apos; 경로에서 쿠키 설정을 통해 쿠키 허용 및 거부를 할 수 있습니다. 다만, 쿠키 설치를 거부할 경우 웹 사용이 불편해지며, 로그인이 필요한 일부 서비스 이용이 어려울 수 있습니다. 릴스탬프는 유효한 법적 절차를 통하지 않는 한 쿠키의 정보를 제3자에게 절대 공개하지 않습니다.
                </p>
              </li>
              <li>수집방법
                <ul className="list-disc list-inside ml-6 space-y-1">
                  <li>회원가입 시 또는 서비스 이용 과정에서 홈페이지 또는 모바일 애플리케이션을 통해 이용자로부터 직접 입력 받아 수집하는 방법</li>
                  <li>이용자가 릴스탬프 홈페이지에 설치된 플러그인을 통해 입력한 내용을 자동으로 수집하는 방법</li>
                  <li>이미 이용자로부터 개인정보 처리에 관하여 동의를 받은 제3자로부터 제공받아 수집하는 방법.</li>
                </ul>
                <p className="ml-6 mt-2">
                  이 중 제3자가 이용자로부터 동의를 받아 릴스탬프에 제공하는 방식으로 이루어지는 개인정보의 수집에 대하여는 본 개인정보처리방침이 적용되지 않음을 알려드립니다.
                </p>
              </li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">제3조 (수집한 개인정보의 이용)</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              릴스탬프는 서비스 제공 및 개선, 신규 서비스 개발, 홍보 및 마케팅 이용 및 정보의 제공 등을 위해 이용자의 개인정보를 수집, 이용합니다.
            </p>
            <ol className="list-decimal list-inside space-y-4 text-gray-700">
              <li>이용방법
                <ul className="list-disc list-inside ml-6 space-y-1">
                  <li>이용하는 개인정보 : 이메일주소, 휴대전화번호, 사용자 입력 컨텐츠 정보</li>
                  <li>이용하는 목적 : 회원 인증, 서비스 제공, 고지사항 전달, 본인 의사 확인, 불만처리 등 의사소통의 경로 확보, 새로운 서비스나 이벤트 정보 등의 안내, 이용자가 입력한 정보를 기반으로 한 콘텐츠 생성, 결과물 제공, 서비스 품질 개선 및 기능 고도화</li>
                </ul>
              </li>
              <li>이용기간
                <p className="ml-6 mt-2">
                  이용자가 서비스를 이용하는 동안 릴스탬프는 이용자의 개인정보를 지속적으로 보유하며 이를 편리한 서비스 제공을 위해 이용합니다.
                </p>
                <p className="ml-6 mt-2">
                  다만 이용자 본인이 개인정보 변경 혹은 삭제를 요청하는 경우, 릴스탬프는 정책에 따라 해당 개인정보를 삭제하여 추후 열람이나 이용이 불가능한 상태로 처리하고 있습니다.
                </p>
              </li>
              <li>비식별화 된 개인정보의 이용
                <p className="ml-6 mt-2">
                  릴스탬프는 수집한 개인정보를 특정 개인을 알아볼 수 없도록 비식별화 처리하여 통계 분석, 서비스 개선, 과학적 연구, 레퍼런스 이용, 공익적 기록 보존 등을 위하여 처리할 수 있습니다. 이 때 비식별화 된 개인정보는 재식별되지 않도록 추가정보와 분리하여 별도 관리하고, 필요한 기술적·관리적 보호조치를 취합니다.
                </p>
              </li>
              <li>14세 미만 아동의 개인정보 처리
                <p className="ml-6 mt-2">
                  릴스탬프는 법정대리인의 동의가 필요한 14세 미만 아동의 회원가입을 허용하지 않습니다.
                </p>
              </li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">제4조 (개인정보의 제공)</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              릴스탬프는 이용자의 사전 동의 없이 개인정보를 외부에 제공하지 않습니다. 단, 릴스탬프는 다음의 경우 관련 법령에 따라 이용자의 동의 없이도 제3자에게 개인정보를 제공할 수 있습니다.
            </p>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>법에 의거하여 적법한 절차에 의한 수사기관이나 기타 정부기관으로부터 정보제공을 요청받은 경우</li>
              <li>기타 법률에 의해 요구되는 경우</li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">제5조 (개인정보 보유기간 및 파기)</h2>
            <ol className="list-decimal list-inside space-y-4 text-gray-700">
              <li>릴스탬프는 원칙적으로 정해진 보유 및 이용기간에 따라 개인정보를 처리하고 있으나, 다음의 정보에 대해서는 아래의 보존 사유에 의해 명시한 기간 동안 보존합니다.
                <p className="font-semibold mt-2 mb-2">내부 방침에 의한 사유</p>
                <ul className="list-disc list-inside ml-6 space-y-1 mb-4">
                  <li>부정이용기록이 있는 이용자의 기록</li>
                  <li>보존 사유 : 반복적인 부정이용 방지를 위한 동일인 식별을 목적으로 별도 보관합니다.</li>
                  <li>보유 기간 : 5년</li>
                </ul>
                <p className="font-semibold mt-4 mb-2">관련 법령에 의한 사유</p>
                <ul className="list-disc list-inside ml-6 space-y-2 mb-4">
                  <li>계약 또는 청약 철회 등에 관한 기록
                    <ul className="list-circle list-inside ml-4 space-y-1">
                      <li>근거 법령 : 전자상거래 등에서의 소비자보호에 관한 법률</li>
                      <li>보유 기간 : 5년</li>
                    </ul>
                  </li>
                  <li>대금결제 및 재화 등의 공급에 관한 기록
                    <ul className="list-circle list-inside ml-4 space-y-1">
                      <li>근거 법령 : 전자상거래 등에서의 소비자보호에 관한 법률</li>
                      <li>보유 기간 : 5년</li>
                    </ul>
                  </li>
                  <li>이용자의 불만 또는 분쟁처리 기록
                    <ul className="list-circle list-inside ml-4 space-y-1">
                      <li>근거 법령 : 전자상거래 등에서의 소비자보호에 관한 법률</li>
                      <li>보유 기간 : 3년</li>
                    </ul>
                  </li>
                  <li>세법이 규정하는 모든 거래에 관한 장부 및 증빙서류
                    <ul className="list-circle list-inside ml-4 space-y-1">
                      <li>근거 법령 : 국세기본법</li>
                      <li>보유 기간 : 5년</li>
                    </ul>
                  </li>
                  <li>전자금융거래에 관한 기록
                    <ul className="list-circle list-inside ml-4 space-y-1">
                      <li>근거 법령 : 전자금융거래법</li>
                      <li>보유 기간 : 5년</li>
                    </ul>
                  </li>
                  <li>서비스 방문 기록
                    <ul className="list-circle list-inside ml-4 space-y-1">
                      <li>근거 법령 : 통신비밀보호법</li>
                      <li>보유 기간 : 3개월</li>
                    </ul>
                  </li>
                </ul>
              </li>
              <li>릴스탬프는 이용자의 개인정보는 수집 및 이용목적이 달성되면 지체없이 파기합니다. (여기서 &apos;이용목적이 달성된 때&apos;란 철회요청, 서비스계약 만료, 탈퇴 시를 의미) 다만, 회사 내부 방침 또는 관계 법령에서 정한 보관기간이 있을 경우 일정 기간동안 보관 후 파기 합니다.</li>
              <li>종이에 출력된 개인정보는 분쇄기로 분쇄하거나 소각하여 파기하고, 전자적 파일 형태로 저장된 기록은 재생할 수 없는 기술적 방법을 사용하여 삭제합니다.</li>
              <li>릴스탬프는 정보통신망 이용촉진 및 정보보호 등에 관한 법률, 전자금융거래법 및 기타 관계법령에 따른 개인정보 보관 규칙을 성실하게 수행합니다.</li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">제6조 (개인정보 처리 업무의 위탁)</h2>
            <ol className="list-decimal list-inside space-y-4 text-gray-700">
              <li>릴스탬프는 경영 효율성의 제고, 서비스 품질 향상 등을 위하여 업무의 일부를 외부 전문업체 등 제3자에게 용역을 주어 수행하며, 이를 위해 제3자에게 보유하고 있는 이용자의 개인정보를 수집, 보관, 처리, 이용, 제공, 관리, 파기 등을 할 수 있도록 업무 처리를 위탁합니다. 이와 관련하여, 수탁자 및 위탁업무의 내용은 다음과 같습니다.
                <ul className="list-disc list-inside ml-6 space-y-1 mt-2">
                  <li>네이버 주식회사: 간편 로그인</li>
                  <li>카카오 주식회사: 간편 로그인</li>
                  <li>카카오: 카카오 알림톡, 브랜드메시지 발송</li>
                  <li>주식회사 팀매버릭스(래피드) : 통신판매 중개자</li>
                </ul>
              </li>
              <li>릴스탬프가 수탁업체에 위탁하고 있는 업무와 관련된 서비스를 이용하지 않는 경우에는 이용자의 개인정보가 수탁업체에 제공되지 않습니다.</li>
              <li>이와 관련하여, 릴스탬프는 위탁 받은 업체가 개인정보보호법에 따라 개인정보를 안전하게 처리하도록 필요한 사항을 규정하고 관리 및 감독을 하고 있습니다.</li>
              <li>릴스탬프는 그 밖에 추가적으로 제3자에게 개인정보 처리를 위탁하여야 하는 경우에 본 개인정보처리방침을 수정하여 이를 공개하는 등 법령상 필요한 조치를 취합니다.</li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">제7조 (개인정보 국외 이전에 관한 사항)</h2>
            <ol className="list-decimal list-inside space-y-4 text-gray-700">
              <li>릴스탬프는 개인정보를 국외의 다른 사업자에게 제공하지 않습니다. 다만, 서비스의 제공에 관한 계약 이행 및 이용자 편의 증진 등을 위하여 다음과 같이 개인정보 처리 업무 중 일부를 국외에 위탁하고 있습니다.
                <ul className="list-disc list-inside ml-6 space-y-1 mt-2">
                  <li>이전받는 자: Google LLC</li>
                  <li>목적 : 인공지능 기반 릴스 기획 및 대본 생성 서비스 제공 및 이용 분석</li>
                  <li>이전 항목 : 이용자가 서비스 이용 과정에서 입력한 텍스트 정보</li>
                  <li>이전 국가 및 연락처 : 미국 / privacy@google.com / https://policies.google.com/privacy</li>
                  <li>이전 일시 및 방법 : 이용자가 서비스를 이용하여 입력 정보를 제출하는 시점에, 암호화된 네트워크를 통해 API 방식으로 전송</li>
                  <li>보유 및 이용 기간 : 서비스 제공을 위한 처리 목적 달성 후 즉시 파기되거나, Google LLC의 개인정보처리방침에 따라 처리됨</li>
                </ul>
              </li>
              <li>이용자는 언제든지 동의를 철회할 수 있지만, 이 경우 릴스탬프 서비스 이용에 제한이 있을 수 있습니다. 이 또한 관련된 서비스를 이용하지 않는 경우에는 이용자의 개인정보가 수탁업체에 제공되지 않습니다.</li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">제8조 (정보주체와 법정대리인의 권리 · 의무 및 행사방법)</h2>
            <ol className="list-decimal list-inside space-y-4 text-gray-700">
              <li>정보주체는 릴스탬프에 대하여 언제든지 개인정보의 열람, 정정, 삭제, 처리 정지 요구 등의 권리를 행사할 수 있습니다. 이러한 권리 행사는 릴스탬프의 이메일, 공식 홈페이지를 통하여 하실 수 있으며, 릴스탬프는 관련 법령 및 당사의 개인정보 민원 대응 매뉴얼에 따라 요구를 지체 없이 조치하겠습니다.</li>
              <li>단, 다른 법령에서 그 개인정보가 수집 대상으로 명시되어 있는 경우에는 그 삭제를 요구할 수 없습니다.</li>
              <li>제9조 1항과 2항에 명시 된 권리 행사는 정보주체의 법정대리인이나 위임을 받은 자 등 대리인을 통하여도 가능하나, 「개인정보 처리 방법에 관한 고시(제2020-7호)」 별지 제11호 서식에 따른 위임장을 제출하여야 합니다.</li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">제9조 (개인정보 보호를 위한 기술적 관리적 대책)</h2>
            <ol className="list-decimal list-inside space-y-4 text-gray-700">
              <li>릴스탬프는 해킹이나 컴퓨터 바이러스 등에 의해 이용자 개인정보가 유출되거나 훼손되는 것을 막기 위해 최선을 다하고 있습니다.</li>
              <li>릴스탬프는 개인정보 훼손에 대비해서 자료를 수시로 백업하고 있고, 최신 백신프로그램을 이용하여 이용자들의 개인정보나 자료가 누출되거나 손상되지 않도록 방지하고 있으며, 암호화 통신 등을 통하여 네트워크 상에서 개인정보를 안전하게 전송할 수 있도록 하고 있습니다. 그리고 침입차단시스템을 이용하여 외부로부터의 무단 접근을 통제하고 있으며, 기타 시스템적으로 보안성을 확보하기 위한 가능한 모든 기술적 장치를 갖추려고 노력하고 있습니다.</li>
              <li>개인정보를 처리하는 릴스탬프의 직원은 담당자에 한정시키고 있고 이를 위한 별도의 비밀번호를 부여하여 정기적으로 갱신하고 있으며, 담당자에 대한 수시교육을 통하여 릴스탬프의 개인정보보호정책의 준수를 강조하고 있습니다.</li>
              <li>그러나 릴스탬프는 이용자 부주의로 인한 개인정보의 유출에 대해서는 책임을 지지 않습니다. 따라서 이용자께서는 본인의 개인정보보호를 위해 노력을 기울여 주시기 바랍니다.</li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">제10조 (기타)</h2>
            <ol className="list-decimal list-inside space-y-4 text-gray-700">
              <li>정보주체의 권익침해에 대한 구제방법
                <p className="ml-6 mt-2">
                  릴스탬프는 개인정보보호와 관련하여 이용자의 의견을 수렴하고 있으며 불만을 처리하기 위하여 모든 절차와 방법을 마련하고 있습니다. 이용자는 릴스탬프의 개인정보 관리 책임자 및 담당자에게 불만사항을 신고할 수 있으며, 릴스탬프는 이용자의 신고사항에 대하여 신속하고도 충분한 답변을 해 드릴 것입니다. 또 정부에서 설치하여 운영 중인 아래의 기관에 불만을 처리할 수 있습니다.
                </p>
                <ul className="list-disc list-inside ml-6 space-y-1 mt-2">
                  <li>개인정보분쟁조정위원회 : (국번없이) 1833-6972 (www.kopico.go.kr)</li>
                  <li>개인정보침해신고센터 : (국번없이) 118 (privacy.kisa.or.kr)</li>
                  <li>대검찰청 : (국번없이) 1301 (www.spo.go.kr)</li>
                  <li>경찰청 : (국번없이) 182 (ecrm.police.go.kr/minwon/main)</li>
                </ul>
              </li>
              <li>개인정보보호 책임자
                <p className="ml-6 mt-2">
                  개인정보를 보호하는데 있어 귀하께 고지한 사항들에 반하는 사고가 발생할 경우 개인정보관리 책임자가 그에 대한 후속처리 등 필요한 업무를 수행합니다. 릴스탬프는 개인정보에 대한 의견수렴 및 불만처리를 담당하는 개인정보 보호의 담당부서를 아래와 같이 지정하고 있습니다.
                </p>
                <ul className="list-disc list-inside ml-6 space-y-1 mt-2">
                  <li>부서명 : 릴스탬프 고객지원팀</li>
                  <li>연락처 : reelstamp@gmail.com</li>
                </ul>
              </li>
            </ol>
          </section>

          <section className="mb-8">
            <p className="text-gray-700 leading-relaxed">
              법령, 정책 또는 보안기술의 변경, 기타 이 개인정보처리방침의 부칙 변경 등에 따라 이 개인정보처리방침의 내용의 추가, 삭제 및 변경이 있을 시에는 지체없이 당사 개인정보 처리방침 페이지를 통하여 고지합니다.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
