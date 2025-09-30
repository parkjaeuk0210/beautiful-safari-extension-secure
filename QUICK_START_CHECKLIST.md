# 🚀 앱스토어 제출 빠른 시작 체크리스트

## 1️⃣ 즉시 해야 할 일 (1-2시간)

### Apple Developer 계정
- [ ] https://developer.apple.com 가입 ($99/년)
- [ ] 결제 완료 확인
- [ ] App Store Connect 접속 확인

### 스크린샷 촬영 (5장)
```bash
# Xcode에서 앱 실행
open "/Users/online/beutiful/Beautiful Backgrounds App/Beautiful Backgrounds.xcodeproj"

# Safari 열고 새 탭 → Cmd+Shift+4로 스크린샷
# 최소 2880x1800 해상도 권장
```

**촬영할 화면:**
1. 메인 화면 (아름다운 배경)
2. 날씨 위젯 표시
3. 캘린더 + 메모
4. 설정 화면
5. 커스텀 사진 업로드

---

## 2️⃣ 아이콘 생성 (30분)

### 필요한 크기
- [ ] 1024x1024 (App Store용) ⚠️ **필수**
- [ ] 512x512
- [ ] 256x256

**현재 있는 것:**
- ✅ 16x16, 32x32, 48x48, 128x128

**생성 방법:**
1. Figma/Sketch/Photoshop에서 1024x1024 디자인
2. 온라인 도구: https://appicon.co
3. 또는 기존 아이콘 업스케일링

---

## 3️⃣ 개인정보 정책 웹사이트 (1시간)

### 옵션 A: GitHub Pages (무료, 추천)
```bash
# 1. GitHub에 새 저장소 생성
# 2. PRIVACY_POLICY.md 업로드
# 3. Settings > Pages 활성화
# URL: https://[username].github.io/beautiful-backgrounds-privacy
```

### 옵션 B: 간단한 웹호스팅
- Vercel (무료)
- Netlify (무료)
- Firebase Hosting (무료)

---

## 4️⃣ Xcode 설정 (30분)

### Signing & Capabilities
```
1. Xcode 열기
2. Beautiful Backgrounds 프로젝트 선택
3. Signing & Capabilities 탭
4. Team: [본인 Apple Developer 계정] 선택
5. Bundle Identifier 확인: com.beautiful.backgrounds
```

### 권한 추가
- [x] App Sandbox
- [x] Location (Weather용)
- [x] Network (이미지 다운로드용)

### Info.plist 확인
```xml
<key>NSLocationWhenInUseUsageDescription</key>
<string>Weather information requires your location</string>
```

---

## 5️⃣ 최종 빌드 및 Archive (30분)

```bash
# 1. Clean
Product > Clean Build Folder (Cmd+Shift+K)

# 2. Archive
Product > Archive

# 3. Validate
Window > Organizer > Validate App

# 4. Upload
Distribute App > App Store Connect
```

---

## 6️⃣ App Store Connect 설정 (1시간)

### 새 앱 생성
1. https://appstoreconnect.apple.com
2. My Apps > + > New App
3. 정보 입력:
   ```
   Platform: macOS
   Name: Beautiful Backgrounds
   Primary Language: English
   Bundle ID: com.beautiful.backgrounds
   SKU: beautiful-backgrounds-2025
   ```

### 앱 정보 입력
- [ ] **Name:** Beautiful Backgrounds
- [ ] **Subtitle:** Beautiful new tab for Safari
- [ ] **Category:** Productivity
- [ ] **Description:** (APP_STORE_SUBMISSION.md 참고)
- [ ] **Keywords:** safari, new tab, productivity, weather, calendar, backgrounds, momentum
- [ ] **Support URL:** [GitHub 또는 웹사이트]
- [ ] **Privacy Policy URL:** [GitHub Pages 또는 웹사이트]

### 스크린샷 업로드
- [ ] 5장 이상 업로드
- [ ] 순서 확인 (가장 중요한 것부터)

### 버전 정보
- [ ] Version: 2.0.0
- [ ] Copyright: 2025 [Your Name]
- [ ] Build 선택 (Xcode에서 업로드한 것)

---

## 7️⃣ 심사 제출 (10분)

### 심사 정보 입력
- [ ] **Contact Information:** [이메일, 전화번호]
- [ ] **Demo Account:** Not needed
- [ ] **Notes:**
  ```
  This Safari extension replaces the new tab page with:
  - Beautiful backgrounds
  - Weather via Apple WeatherKit (requires location)
  - Calendar with memos
  - Inspirational quotes

  All data stored locally on device.
  No backend server required.
  ```

### 심사 제출
- [ ] Export Compliance: **No** (암호화 없음)
- [ ] Advertising Identifier: **No** (광고 없음)
- [ ] **Submit for Review** 클릭

---

## 📊 예상 소요 시간

| 작업 | 시간 | 우선순위 |
|------|------|----------|
| Apple Developer 가입 | 30분 | 🔴 필수 |
| 스크린샷 촬영 | 1시간 | 🔴 필수 |
| 아이콘 생성 | 30분 | 🔴 필수 |
| 개인정보 정책 웹사이트 | 1시간 | 🔴 필수 |
| Xcode 설정 | 30분 | 🟡 중요 |
| Archive 및 업로드 | 30분 | 🟡 중요 |
| App Store Connect | 1시간 | 🟡 중요 |
| 심사 제출 | 10분 | 🟢 쉬움 |
| **총 예상 시간** | **5시간** | |

---

## ⚠️ 주의사항

### 반드시 확인할 것
1. **Bundle ID가 정확한가?** `com.beautiful.backgrounds`
2. **아이콘이 투명 배경이 아닌가?** (PNG, 투명 X)
3. **스크린샷 해상도가 충분한가?** (최소 2560x1600)
4. **개인정보 정책 URL이 작동하는가?**
5. **모든 기능이 테스트되었는가?**

### 흔한 실수
- ❌ 아이콘 크기가 부족함
- ❌ 개인정보 정책 URL 없음
- ❌ 스크린샷이 너무 작음
- ❌ Info.plist에 권한 설명 누락
- ❌ Archive 대신 Build 사용

---

## 🎯 제출 후

### 심사 기간
- 평균 **24-48시간**
- 길면 **1주일**

### 상태 확인
- App Store Connect > My Apps > Beautiful Backgrounds
- 이메일 알림 받기

### 거절되면?
- Resolution Center에서 사유 확인
- 수정 후 재제출
- 평균 2-3번 반복 정상

---

## 📞 도움이 필요하면

### Apple 지원
- https://developer.apple.com/support/
- App Review Team (거절 시 회신)

### 커뮤니티
- Apple Developer Forums
- Reddit: r/iOSProgramming
- Stack Overflow: safari-extension 태그

---

## ✅ 최종 체크

제출 전에 이것만 확인하세요:

```
[ ] Apple Developer 계정 활성화됨
[ ] 스크린샷 5장 촬영 완료
[ ] 1024x1024 앱 아이콘 준비됨
[ ] 개인정보 정책 URL 작동함
[ ] Xcode Archive 성공
[ ] App Store Connect에 빌드 업로드됨
[ ] 모든 메타데이터 입력됨
[ ] 심사 노트 작성됨
```

**모두 체크되었다면 "Submit for Review" 클릭!** 🚀

---

**작성일:** 2025-09-30
**참고:** APP_STORE_SUBMISSION.md (상세 가이드)