# Beautiful Backgrounds Safari Extension - 마이그레이션 노트

## 현재 문제
- Legacy Safari Extension (`.safariextension`)은 macOS 26.0에서 더 이상 작동하지 않음
- Safari 14+ 부터는 Safari App Extension만 지원됨
- 확장 프로그램 목록에 나타나지 않음

## 작동하던 백업 버전
- 파일: `Beautiful-Safari-Extension-v1.0.1.zip`
- 위치: `/Users/online/beutiful/`
- 이 버전은 이전 macOS에서 정상 작동했음

## 기존 구조
```
Beautiful Safari Extension.safariextension/
├── Info.plist              # 설정 파일
├── content.js              # about:blank를 감지해서 페이지 주입
├── global.js               # 백그라운드 스크립트
├── global.html             # 글로벌 페이지
├── newtab.html             # 메인 UI (시간, 날씨, 배경 등)
├── newtab.js               # 메인 로직
├── styles.css              # 스타일
├── Icon-16.png, Icon-32.png
└── backend/                # Vercel 서버리스 함수
```

## 주요 기능
1. **배경 이미지**: Unsplash API로 매일 새 배경
2. **시계 & 날씨**: 실시간 시계, WeatherKit API 연동
3. **명언 카드**: 랜덤 영감 문구
4. **미니 캘린더**: 월별 캘린더 위젯
5. **사용자 이름**: localStorage에 저장

## content.js 작동 방식
```javascript
// about:blank를 감지하면 전체 페이지를 주입
if (window.top === window && isNewTabPage()) {
    document.documentElement.innerHTML = `전체 HTML...`;
}
```

## 이전 문제들
- **Momentum 확장과 충돌**: 이미 비활성화함
- **Info.plist Website Access**: `Level: All`로 설정 필요
- **Developer ID**: `9QJN37DG5K`

## 다음 할 일: Safari App Extension으로 마이그레이션

### 1. Xcode 프로젝트 생성
```bash
# 위치
cd /Users/online/beutiful/

# Xcode에서
File > New > Project > macOS > App
- Product Name: Beautiful Backgrounds
- Team: 본인 Apple Developer 계정
- Organization Identifier: com.beautiful
- Interface: SwiftUI
- Language: Swift
```

### 2. Safari Extension 타겟 추가
```
File > New > Target > Safari Extension
- 이름: Beautiful Backgrounds Extension
- 기존 앱에 추가
```

### 3. 파일 마이그레이션
기존 파일들을 Safari Extension 타겟으로 복사:
```
Resources/
├── newtab.html
├── newtab.js
├── styles.css
├── content.js (content script로)
└── images/
```

### 4. manifest.json 설정
```json
{
  "manifest_version": 3,
  "name": "Beautiful Backgrounds",
  "version": "1.0",
  "description": "Transform your Safari with beautiful backgrounds",
  "permissions": ["storage"],
  "host_permissions": [
    "https://images.unsplash.com/*",
    "https://weatherkit.apple.com/*",
    "https://nominatim.openstreetmap.org/*"
  ],
  "chrome_url_overrides": {
    "newtab": "newtab.html"
  },
  "content_scripts": [{
    "matches": ["<all_urls>"],
    "js": ["content.js"],
    "run_at": "document_start"
  }]
}
```

## 백엔드 API
- Unsplash: `https://backend-qhi3ehaqn-feras-projects-59a977f0.vercel.app/api/background`
- WeatherKit: `https://your-backend.vercel.app/api/weather-token`

## 참고
- Legacy extension에서는 `safari.application.addEventListener` 사용
- 새 버전에서는 `browser.runtime` 또는 `chrome.runtime` API 사용
- localStorage는 `browser.storage.local`로 변경 필요할 수 있음