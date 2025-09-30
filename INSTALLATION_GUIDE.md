# Beautiful Backgrounds 2.0 - 설치 가이드

## ✅ 생성 완료!

새로운 Safari 확장 프로그램이 성공적으로 생성되었습니다.

### 📁 프로젝트 위치
```
/Users/online/beutiful/Beautiful Backgrounds/
```

## 🚀 설치 방법

### 1. Xcode에서 프로젝트 열기
```bash
open "/Users/online/beutiful/Beautiful Backgrounds/Beautiful Backgrounds.xcodeproj"
```
또는 Finder에서 `Beautiful Backgrounds.xcodeproj` 파일을 더블클릭

### 2. 서명 설정
1. Xcode 왼쪽 패널에서 프로젝트 아이콘 클릭
2. "Beautiful Backgrounds" 타겟 선택
3. "Signing & Capabilities" 탭 클릭
4. **Team** 드롭다운에서 본인의 Apple ID 선택
   - Apple ID가 없다면 "Add an Account..." 클릭
   - 무료 Apple Developer 계정으로도 가능합니다

5. "Beautiful Backgrounds Extension" 타겟도 같은 Team으로 설정

### 3. 빌드 및 실행
1. Xcode 상단의 타겟이 "Beautiful Backgrounds"로 설정되어 있는지 확인
2. **⌘+R** 누르거나 "Product > Run" 클릭
3. 앱이 빌드되고 실행됩니다 (Applications 폴더에 설치됨)

### 4. Safari에서 확장 프로그램 활성화
1. **Safari 열기**
2. **Safari > 환경설정** (또는 ⌘+,)
3. **확장 기능** 탭 클릭
4. **"Beautiful Backgrounds Extension"** 찾아서 체크박스 선택
5. 권한 설정:
   - "모든 웹사이트에서" 선택
   - 또는 "일부 웹사이트에서" 선택 후 원하는 사이트 추가

### 5. 새 탭 열기
- Safari에서 **⌘+T**를 눌러 새 탭을 엽니다
- Beautiful Backgrounds가 나타납니다! 🎉

## 🎨 주요 기능

- **🌄 아름다운 배경**: Unsplash API를 통한 고화질 이미지
- **🤖 AI 채팅**: Google Gemini 2.5 Flash 기반 어시스턴트
- **📅 캘린더**: 미니 캘린더 위젯 (설정에서 활성화)
- **📝 메모**: 날짜별 메모 기능 (캘린더 날짜 클릭)
- **📷 커스텀 사진**: 본인의 사진을 배경으로 사용
- **⏰ 실시간 시계**: 현재 시간과 날짜 표시
- **💭 영감 명언**: 매일 바뀌는 명언
- **👋 개인화**: 이름 설정으로 맞춤 인사말

## ⚙️ 사용 팁

### 이름 설정
- 인사말 텍스트를 클릭하여 이름 입력/변경

### 배경 변경
- 우측 상단의 🔄 버튼 클릭
- 또는 **⌘+R** (Cmd+R)

### AI 채팅 사용
- 좌측 상단의 💬 버튼 클릭
- 파일 업로드 가능 (이미지, PDF 등)
- 대화 기록은 자동 저장됨

### 캘린더 메모
- 우측 상단에 캘린더가 보임 (설정에서 활성화 필요)
- 날짜 클릭하여 메모 작성
- 캘린더를 길게 누르면 메모 관리 모드

### 커스텀 사진
1. 📷 버튼 클릭하여 사진 업로드
2. 설정(⚙️)에서 "Use Custom Photos" 활성화
3. 최대 5장까지 저장 가능

## 🔧 문제 해결

### 확장 프로그램이 목록에 없음
- Xcode에서 앱을 다시 빌드 (⌘+B)
- Safari 완전히 종료 후 재시작
- 확장 프로그램 앱이 Applications 폴더에 있는지 확인

### 새 탭이 변경되지 않음
- Safari 환경설정 > 일반
- "새로운 탭 또는 윈도우가 열릴 때" 확인
- 확장 프로그램 권한이 "모든 웹사이트"로 설정되어 있는지 확인

### 배경 이미지가 안 보임
- 인터넷 연결 확인
- Safari > 개발자 > 웹 속성 보기 > 콘솔에서 오류 확인
- 콘텐츠 차단기가 활성화되어 있다면 비활성화

### AI 채팅이 작동하지 않음
- 백엔드 API가 올바르게 설정되어 있는지 확인
- 콘솔에서 네트워크 오류 확인
- API 키가 만료되지 않았는지 확인

## 📦 파일 구조

```
Beautiful Backgrounds/
├── Beautiful Backgrounds.xcodeproj     # Xcode 프로젝트
├── Beautiful Backgrounds/              # 메인 앱
│   └── Resources/                      # 앱 리소스
└── Beautiful Backgrounds Extension/    # 확장 프로그램
    ├── manifest.json                   # 확장 프로그램 설정
    ├── newtab.html                     # 메인 UI
    ├── newtab.js                       # JavaScript 로직
    ├── styles.css                      # 스타일시트
    ├── Icon-*.png                      # 아이콘들
    └── SafariWebExtensionHandler.swift # Swift 핸들러
```

## 🔄 업데이트

파일을 수정한 후:
1. Xcode에서 **⌘+B** (빌드)
2. Safari 완전히 종료
3. Xcode에서 **⌘+R** (실행)
4. Safari 재시작

## 🎯 개발자 정보

- **버전**: 2.0.0
- **호환성**: macOS Sequoia 26.0+, Safari 17.0+
- **프레임워크**: Manifest V3, SwiftUI
- **백엔드**: Vercel Serverless Functions

## 📝 라이센스

개인적 및 교육적 목적으로 자유롭게 사용 가능합니다.

---

**즐거운 브라우징 되세요! 🎉**