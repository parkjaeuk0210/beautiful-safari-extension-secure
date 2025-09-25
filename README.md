# Beautiful Backgrounds Safari Extension

Momentum 스타일의 아름다운 배경을 보여주는 Safari 확장 프로그램입니다.

## 기능

- 🌄 아름다운 고화질 배경 이미지
- 🕐 실시간 시계 및 날짜 표시
- 👋 개인화된 인사말
- 💭 매일 바뀌는 영감을 주는 명언
- 🔄 배경 이미지 새로고침
- 📱 반응형 디자인 (모바일 대응)
- 🌙 우아한 글래스모피즘 UI

## 설치 방법

### 1. 개발자 모드 활성화
1. Safari를 열고 `개발` 메뉴를 활성화합니다
   - Safari 환경설정 > 고급 > "메뉴 막대에서 개발 메뉴 보기" 체크
2. `개발 > 확장 기능 허용` 체크

### 2. 확장 프로그램 설치
1. `Beautiful Safari Extension.safariextension` 폴더를 더블클릭
2. Safari에서 확장 프로그램 설치 허용
3. Safari 환경설정 > 확장 기능에서 "Beautiful Backgrounds" 활성화

### 3. 권한 설정
- Safari 환경설정 > 확장 기능 > Beautiful Backgrounds
- "모든 웹사이트에서" 또는 "일부 웹사이트에서" 권한 부여

## 사용 방법

### 기본 사용
1. Safari에서 새 탭을 열면 자동으로 Beautiful Backgrounds가 표시됩니다
2. 시간과 날짜가 실시간으로 표시됩니다
3. 처음 사용시 이름을 입력하여 개인화된 인사말을 받으세요

### 주요 기능
- **이름 설정**: 인사말을 클릭하거나 처음 사용시 이름 입력
- **배경 새로고침**: 우측 하단의 🔄 버튼으로 새로운 배경 이미지 로드
- **설정**: ⚙️ 버튼으로 이름 변경 가능
- **사진 정보**: 좌측 하단에서 사진 작가 정보 확인

## 파일 구조

```
Beautiful Safari Extension.safariextension/
├── Info.plist          # Safari 확장 프로그램 메타데이터
├── global.html          # 글로벌 페이지
├── global.js            # 백그라운드 스크립트
├── newtab.html          # 새 탭 페이지 HTML
├── newtab.js            # 새 탭 페이지 JavaScript
├── styles.css           # 스타일시트
└── content.js           # 콘텐츠 스크립트
```

## 커스터마이징

### 배경 이미지 추가
`content.js`의 `fallbackImages` 배열에 새로운 이미지를 추가할 수 있습니다:

```javascript
{
    url: '이미지_URL',
    photographer: '사진작가_이름',
    location: '촬영_장소',
    description: '이미지_설명'
}
```

### 명언 추가
`content.js`의 `quotes` 배열에 새로운 명언을 추가할 수 있습니다.

### 스타일 변경
`styles.css`를 수정하여 색상, 폰트, 레이아웃을 변경할 수 있습니다.

## 개발자 정보

- **이름**: Beautiful Backgrounds
- **버전**: 1.0
- **호환성**: Safari 14.0+

## 문제 해결

### 확장 프로그램이 작동하지 않는 경우
1. Safari 재시작
2. 확장 프로그램 비활성화 후 재활성화
3. Safari 환경설정에서 권한 확인

### 배경 이미지가 로드되지 않는 경우
- 인터넷 연결 확인
- Safari의 콘텐츠 차단기 설정 확인

### 새 탭에서 표시되지 않는 경우
- Safari 환경설정 > 일반 > "새로운 탭 또는 윈도우가 열릴 때" 설정 확인

## 라이센스

이 프로젝트는 개인적 및 교육적 목적으로 자유롭게 사용할 수 있습니다.

## 기여

버그 리포트나 기능 제안은 언제든 환영합니다!

---

*"매일 새로운 아름다움과 함께 시작하세요" - Beautiful Backgrounds*