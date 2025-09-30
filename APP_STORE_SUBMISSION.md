# Beautiful Backgrounds - 앱스토어 제출 준비 가이드

## ✅ 완료된 사항

### 1. Safari App Extension 마이그레이션
- ✅ Manifest V3로 전환 완료
- ✅ Safari Extension Handler (Swift) 구현
- ✅ WeatherKit 네이티브 통합 완료

### 2. 백엔드 의존성 제거
- ✅ Vercel 백엔드 제거 완료
- ✅ Unsplash API 직접 사용 (큐레이션 이미지 20개 내장)
- ✅ WeatherKit은 네이티브 Swift로 처리

### 3. 현재 기능
- 🌄 배경 이미지 (큐레이션 20개 + 커스텀 업로드 5개)
- 🌤️ 날씨 정보 (Apple WeatherKit)
- 📅 캘린더 위젯 (메모 기능)
- 💭 영감 명언 10개
- ⏰ 실시간 시계
- 👋 개인화 인사말

---

## 📋 앱스토어 제출 체크리스트

### 1. Apple Developer 계정 준비
- [ ] Apple Developer Program 가입 ($99/년)
- [ ] App Store Connect 로그인
- [ ] 개인정보 보호정책 URL 준비
- [ ] 지원 URL 준비

### 2. 앱 정보 준비

#### 필수 정보
```
앱 이름: Beautiful Backgrounds
번들 ID: com.beautiful.backgrounds
버전: 2.0.0
카테고리: Productivity (생산성)
부카테고리: Utilities (유틸리티)
```

#### 앱 설명 (영어)
```
Transform your Safari new tab into a beautiful, productive space.

FEATURES:
• 🌄 Beautiful Backgrounds - 20 curated stunning photos
• 📷 Custom Photos - Upload up to 5 personal photos
• 🌤️ Weather - Real-time weather powered by Apple WeatherKit
• 📅 Calendar - Mini calendar with memo feature
• 💭 Daily Quotes - Inspiring quotes to start your day
• ⏰ Live Clock - Always know the time and date
• 👋 Personal Greeting - Customized welcome message

PRIVACY FOCUSED:
• All data stored locally on your device
• No tracking or analytics
• No account required
• Open source friendly

Perfect for those who love Momentum but want a native Safari experience!
```

#### 앱 설명 (한국어)
```
Safari 새 탭을 아름답고 생산적인 공간으로 변환하세요.

주요 기능:
• 🌄 아름다운 배경 - 엄선된 20개의 멋진 사진
• 📷 커스텀 사진 - 최대 5장의 개인 사진 업로드
• 🌤️ 날씨 - Apple WeatherKit 기반 실시간 날씨
• 📅 캘린더 - 메모 기능이 있는 미니 캘린더
• 💭 매일 명언 - 영감을 주는 명언으로 하루 시작
• ⏰ 실시간 시계 - 항상 시간과 날짜 확인
• 👋 개인 인사말 - 맞춤형 환영 메시지

개인정보 보호 중심:
• 모든 데이터는 기기에 로컬 저장
• 추적이나 분석 없음
• 계정 필요 없음
• 오픈 소스 친화적

Momentum을 좋아하지만 네이티브 Safari 경험을 원하는 분들에게 완벽합니다!
```

### 3. 스크린샷 준비 (필수)
**macOS 스크린샷 요구사항:**
- 1280 x 800 pixels (최소)
- 2560 x 1600 pixels (권장 - Retina)
- 2880 x 1800 pixels (최고 품질 - M1/M2 Mac)
- PNG 또는 JPEG 형식
- 최소 3개, 최대 10개

**촬영해야 할 스크린샷:**
1. 메인 화면 (아름다운 배경 + 시계 + 인사말)
2. 날씨 위젯 표시
3. 캘린더 + 메모 기능
4. 설정 화면
5. 커스텀 사진 업로드 화면

**촬영 방법:**
```bash
# Safari에서 새 탭 열기
# Cmd+Shift+4 눌러서 스크린샷 촬영
# 또는 Cmd+Shift+5로 전체 화면 촬영
```

### 4. 앱 아이콘 준비
**필요한 아이콘 크기:**
- 16x16 ✅ (이미 있음)
- 32x32 ✅ (이미 있음)
- 48x48 ✅ (이미 있음)
- 128x128 ✅ (이미 있음)
- 256x256
- 512x512
- 1024x1024 (App Store용)

**현재 위치:**
```
/Users/online/beutiful/Beautiful Backgrounds/Beautiful Backgrounds Extension/
├── Icon-16.png
├── Icon-32.png
├── Icon-48.png
└── Icon-128.png
```

### 5. 서명 및 빌드 설정

#### Xcode 설정
1. **Signing & Capabilities**
   - Team: 본인 Apple Developer 계정 선택
   - Signing Certificate: "Apple Distribution"
   - Provisioning Profile: "App Store"

2. **Capabilities 추가**
   - [x] App Sandbox (필수)
   - [x] Location (WeatherKit용)
   - [x] Network (날씨 및 이미지 다운로드)

3. **Info.plist 설정**
   ```xml
   <key>NSLocationWhenInUseUsageDescription</key>
   <string>Weather information requires your location</string>

   <key>NSLocationAlwaysAndWhenInUseUsageDescription</key>
   <string>Weather updates need access to your location</string>
   ```

#### 빌드 단계
```bash
# 1. Archive 생성
Xcode > Product > Archive

# 2. Validate App
Organizer > Validate App (자동 검증)

# 3. Distribute App
Organizer > Distribute App > App Store Connect
```

### 6. 개인정보 보호정책 작성

**필수 포함 사항:**
- 수집하는 데이터: 위치 정보 (날씨용)
- 데이터 저장: 로컬 저장소만 사용
- 제3자 공유: 없음
- 사용자 권리: 삭제 및 수정 가능

**샘플 정책 (privacy-policy.md):**
```markdown
# Privacy Policy for Beautiful Backgrounds

Last updated: 2025-09-30

## Data Collection
Beautiful Backgrounds collects minimal data:
- Location (only for weather features, with permission)
- User preferences (stored locally)
- Custom photos (stored locally)

## Data Storage
All data is stored locally on your device:
- localStorage for preferences
- Local file system for photos

## Third-Party Services
- Apple WeatherKit: Location data for weather
- Unsplash: Background images (no tracking)

## Your Rights
You can delete all data by:
- Removing the extension
- Clearing Safari's website data

## Contact
For privacy concerns: [your-email@example.com]
```

### 7. App Store Connect 설정

#### 새 앱 생성
1. App Store Connect 로그인
2. "My Apps" > "+" 버튼 > "New App"
3. 정보 입력:
   - Platform: macOS
   - Name: Beautiful Backgrounds
   - Primary Language: English
   - Bundle ID: com.beautiful.backgrounds
   - SKU: beautiful-backgrounds-001

#### 버전 정보
- Version: 2.0.0
- Copyright: 2025 [Your Name]
- Trade Representative Contact: [Your Email]

#### 앱 심사 정보
- Demo Account: 필요 없음
- Contact Information: [Your Email/Phone]
- Notes:
  ```
  This is a Safari extension that replaces the new tab page.
  No backend server required - all data stored locally.
  WeatherKit requires location permission.
  ```

### 8. 심사 준비

#### 테스트 체크리스트
- [ ] 모든 기능이 정상 작동하는지 확인
- [ ] 위치 권한 요청이 제대로 표시되는지 확인
- [ ] 날씨 정보가 정확한지 확인
- [ ] 커스텀 사진 업로드가 작동하는지 확인
- [ ] 캘린더 메모 저장/불러오기 테스트
- [ ] 설정 변경이 저장되는지 확인
- [ ] Safari 재시작 후에도 데이터 유지 확인

#### 알려진 제한사항
- 위치 권한 거부 시 날씨 표시 안 됨 (의도된 동작)
- 인터넷 연결 없으면 배경 이미지 로드 안 됨
- 최대 5개의 커스텀 사진만 저장 가능

---

## 📝 제출 전 최종 체크

### 코드 품질
- [ ] 모든 콘솔 로그 제거 또는 최소화
- [ ] 에러 핸들링 확인
- [ ] 사용하지 않는 코드 제거
- [ ] 주석 정리

### 법적 요구사항
- [ ] 개인정보 보호정책 URL
- [ ] 지원 URL
- [ ] 저작권 표시
- [ ] 오픈소스 라이선스 (Unsplash 사진 출처)

### 앱 메타데이터
- [ ] 앱 이름 최종 확정
- [ ] 설명 문구 검토
- [ ] 키워드 설정 (Safari, New Tab, Productivity, Weather, Calendar)
- [ ] 연령 등급 확인 (4+)

---

## 🚀 제출 프로세스

### 1단계: 최종 빌드
```bash
cd "/Users/online/beutiful/Beautiful Backgrounds App"
open "Beautiful Backgrounds.xcodeproj"

# Xcode에서:
# 1. Product > Clean Build Folder (Cmd+Shift+K)
# 2. Product > Archive (Cmd+Shift+B 아님!)
# 3. Organizer에서 Validate
# 4. Distribute to App Store Connect
```

### 2단계: App Store Connect
1. "My Apps" > "Beautiful Backgrounds"
2. "+ Version" > "2.0.0"
3. 모든 메타데이터 입력
4. 스크린샷 업로드
5. 빌드 선택 (Xcode에서 업로드한 빌드)

### 3단계: 심사 제출
1. "Submit for Review" 클릭
2. Export Compliance: No (암호화 사용 안 함)
3. Advertising Identifier: No (광고 없음)
4. Content Rights: Yes (모든 콘텐츠 사용 권한 있음)

### 4단계: 대기
- 평균 심사 기간: 24-48시간
- 상태 확인: App Store Connect

---

## ⚠️ 심사 거절 대비

### 흔한 거절 사유와 해결책

#### 1. 개인정보 보호정책 누락
**해결:** 웹사이트에 정책 게시 후 URL 제공

#### 2. 위치 권한 설명 부족
**해결:** Info.plist에 자세한 설명 추가

#### 3. 충돌/버그
**해결:** TestFlight 베타 테스트 진행

#### 4. 스크린샷 불충분
**해결:** 주요 기능을 보여주는 고품질 스크린샷 추가

#### 5. 메타데이터 오류
**해결:** 설명, 키워드, 카테고리 재검토

---

## 📞 문제 발생 시

### Apple 지원 연락처
- App Review: https://developer.apple.com/contact/app-review/
- Technical Support: https://developer.apple.com/support/

### 커뮤니티
- Apple Developer Forums
- Stack Overflow (tag: safari-extension)

---

## 🎯 다음 버전 (2.1.0) 계획

- [ ] 더 많은 배경 이미지 추가
- [ ] 테마 커스터마이징
- [ ] 위젯 추가 (할일 목록, 타이머 등)
- [ ] iCloud 동기화
- [ ] 다국어 지원 확대

---

**작성일:** 2025-09-30
**버전:** 2.0.0
**상태:** 제출 준비 완료 대기