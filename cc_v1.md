Build a mobile-first PWA called “HmmmNow”.

Product:
HmmmNow is a London-only Chinese-language toilet rescue PWA for Chinese-speaking tourists in London. It helps users quickly find nearby usable toilets when they urgently need one.

Core positioning:
This is NOT a generic map app.
This is a funny, cute, meme-like emergency utility.

Primary user:
Chinese-speaking tourists / visitors walking around London who suddenly need a toilet.

Language:
All user-facing copy must be in Simplified Chinese.
Use playful, meme-like, slightly funny Chinese copy.
Avoid corporate, official, boring language.

Tech stack:
- Vite + React + TypeScript
- Tailwind CSS
- Supabase
- Leaflet + OpenStreetMap
- vite-plugin-pwa
- Deployable to Vercel

Do not build:
- Native iOS app
- Native Android app
- Login/signup
- User profiles
- Comments
- Favourites
- Complex rating system
- Multi-city support
- Admin dashboard
- AI features
- Baby changing fields
- Accessibility filters
- Full route navigation inside the app

V1 success criteria:
- Looks good on mobile
- Fully Chinese UI
- Product name: HmmmNow
- User clicks Panic Mode before location is requested
- Panic Mode can get user location
- App shows nearest 3 toilets sorted by distance
- Each toilet can open Google Maps directions
- Panic result page has a small map below the cards
- App supports 15–30 manually entered London toilet records
- Add a Loo form submits to Supabase pending_toilets
- No login required
- Can be deployed to Vercel
- Can be added to mobile home screen as PWA

Core user journey:
1. User opens HmmmNow on mobile.
2. Home screen shows product name, funny Chinese headline, and one large panic button.
3. User taps the panic button.
4. App requests geolocation permission.
5. If permission is granted:
   - Fetch active toilets from Supabase.
   - Calculate distance from user location to each toilet.
   - Sort toilets by distance.
   - Show nearest 3 toilets as cute cards.
   - Highlight the nearest one as the best option.
   - Show a small map below the cards with the nearby toilet markers.
6. User taps “带我过去”.
7. App opens Google Maps directions in a new tab.
8. User can also submit a new toilet tip through “我也知道一个”.

PWA requirements:
- App name: HmmmNow
- Short name: HmmmNow
- Theme should feel playful and soft.
- Create a simple manifest.
- Add installable PWA support through vite-plugin-pwa.
- Use a simple emoji-style icon placeholder for now if needed.
- The app should work well as an “Add to Home Screen” mobile web app.

Design direction:
- Mobile-first
- Funny meme tool
- Cute but not childish
- Soft, rounded, playful
- iOS-like cards
- Warm/light background
- Big panic button
- Cards should have large border radius and soft shadows
- Use emoji icons lightly
- Do not make the landing page look like Google Maps
- Map should be secondary, shown after Panic Mode results
- Layout should work especially well on iPhone-sized screens

Suggested visual style:
- Background: warm cream / very light beige
- Cards: white or soft pastel
- Primary button: large rounded pill or rounded rectangle
- Use Tailwind classes, no external design system required
- Avoid dense text
- Make everything easy to scan quickly

Initial Chinese copy:
Home:
- Product name: “HmmmNow”
- Main headline: “在伦敦，突然 Hmmmm？”
- Subtitle: “看看附近的💩点”
- Primary button: “🚨 快憋不住啦！”
- Secondary button: “➕ 我也知道一个”
- Footer line: “救救所有在伦敦街头 Hmmmm 的孩子吧”

Panic loading:
- “正在帮你找救命厕所……”
- “别慌，地图已经开始努力了。”

Panic results:
- Page title: “附近最有希望的 3 个”
- Subtitle: “按你当前位置粗略排序，先救急，别太纠结。”
- First card badge: “最像救命的那个”
- Second card badge: “备选 1”
- Third card badge: “备选 2”

Card labels:
- Distance label: “距离你”
- Access label: “进入方式”
- Note label: “你懂的”
- Confidence label: “靠谱程度”
- Last checked label: “最近确认”
- Button: “带我过去”
- Details button if needed: “展开看看”

Map section:
- Title: “附近地图”
- Subtitle: “点一下图标，看看能不能救你。”

Location denied state:
- “定位失败了，但问题不大。”
- “你还是可以先看看附近地图。”
- Button: “看看地图”

No result state:
- “附近暂时没有收录厕所。”
- “这不是你的问题，是我们的数据库还不够努力。”
- Buttons:
  - “看看地图”
  - “我也知道一个”

Add a Loo:
- Page title: “你也知道一个？”
- Subtitle: “救人一急，功德 +1。”
- Fields:
  - “地点名”
  - “大概地址 / 区域”
  - “进入方式”
  - “你懂的”
  - “补充说明”
- Submit button: “提交这个救命地点”
- Success message: “收到。下一个在伦敦突然沉默的人会感谢你。”
- Error message: “提交失败了，再试一次？”

Disclaimer:
- “厕所信息可能会变。请友好使用，别为难 staff。”

Supabase environment variables:
Use:
- VITE_SUPABASE_URL
- VITE_SUPABASE_ANON_KEY

Supabase tables:

1. toilets

SQL:

create table toilets (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  area text,
  address text not null,
  lat double precision not null,
  lng double precision not null,
  access_type text not null,
  hmmm_note text,
  opening_hours text,
  confidence text,
  last_checked date,
  is_active boolean default true,
  created_at timestamp with time zone default now()
);

2. pending_toilets

SQL:

create table pending_toilets (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  area_or_address text,
  access_type text,
  hmmm_note text,
  extra_note text,
  created_at timestamp with time zone default now()
);

Data model TypeScript:

type Toilet = {
  id: string;
  name: string;
  area?: string | null;
  address: string;
  lat: number;
  lng: number;
  access_type: string;
  hmmm_note?: string | null;
  opening_hours?: string | null;
  confidence?: string | null;
  last_checked?: string | null;
  is_active: boolean;
  created_at?: string;
};

type PendingToiletInput = {
  name: string;
  area_or_address?: string;
  access_type?: string;
  hmmm_note?: string;
  extra_note?: string;
};

Recommended project structure:
- src/App.tsx
- src/types.ts
- src/lib/supabase.ts
- src/lib/distance.ts
- src/data/mockToilets.ts
- src/components/Home.tsx
- src/components/PanicMode.tsx
- src/components/ToiletCard.tsx
- src/components/MiniMap.tsx
- src/components/AddLooForm.tsx
- src/components/BottomNav.tsx or simple navigation controls
- src/components/LoadingState.tsx
- src/components/ErrorState.tsx
- src/index.css

Important implementation approach:
First build the full app with local mock data so the UI and journey can be tested immediately.
Then connect Supabase.
Keep mock data as fallback if Supabase env variables are missing.

Distance calculation:
Use Haversine distance.

Create function:

getDistanceKm(userLat, userLng, toiletLat, toiletLng): number

Create formatter:

formatDistance(distanceKm):
- if less than 1 km, show metres, e.g. “230m”
- if 1 km or above, show km with one decimal, e.g. “1.4km”

Optional walk time:
Assume walking speed 5 km/h.
walkingMinutes = Math.round(distanceKm / 5 * 60)
Display:
“约 3 分钟 · 230m”

Sorting:
- After getting user location, calculate distance for all active toilets.
- Sort ascending.
- Take first 3.
- Attach distanceKm to each result for display.

Google Maps directions:
For each toilet, “带我过去” opens:

https://www.google.com/maps/dir/?api=1&destination={lat},{lng}

Use window.open(url, "_blank").

Location behaviour:
- Do not request geolocation on initial page load.
- Only request geolocation when user taps “🚨 快憋不住啦！”
- If geolocation succeeds, show nearest 3 toilets.
- If geolocation fails or is denied, show friendly Chinese fallback and still allow map browsing.

Navigation:
Use simple internal state instead of heavy routing:
- view = "home" | "panic" | "add"
- PanicMode can include map and result cards.
- AddLooForm can return to home after success.

Home screen requirements:
- Must feel like a meme emergency tool.
- Do not show a giant map on home.
- Main CTA should dominate the screen.
- Include product name and Chinese copy.
- Include disclaimer at bottom.

PanicMode screen requirements:
States:
1. idle/requesting location
2. loading toilets
3. results
4. location denied
5. error
6. no toilets

When results are shown:
- Show nearest 3 toilet cards first.
- Below cards show small map.
- Map should include markers for those 3 toilets and possibly all active toilets.
- User location can be shown if easy.

ToiletCard requirements:
Show:
- Badge: first card “最像救命的那个”, second “备选 1”, third “备选 2”
- Name
- Area
- Distance
- Access type
- Hmmm note under label “你懂的”
- Confidence
- Last checked
- Opening hours if present
- Button “带我过去”

Do not overload the card.
Keep it readable.

MiniMap requirements:
- Use Leaflet + OpenStreetMap.
- Center on user location if available; otherwise center on London:
  lat: 51.5074
  lng: -0.1278
  zoom: 13
- Use cute custom marker labels where possible:
  - “🚻” for normal toilet
  - “⭐” for nearest/best option
- Marker popup should show:
  - toilet name
  - access_type
  - button/link “带我过去”
- Map height on mobile: around 260–320px.
- Rounded corners.

AddLooForm requirements:
Fields:
- name: required
- area_or_address: optional but recommended
- access_type: dropdown
- hmmm_note: textarea
- extra_note: textarea

Access type options:
- 免费可进
- 问店员
- 需要消费
- 需要 code
- 不太确定

Validation:
- If name is empty, show “先给这个救命地点起个名字。”
- If all other fields are empty, show “再多给一点线索吧，不然我们也找不到它。”
- On submit, insert into pending_toilets.
- On success, show success message.
- Do not show submitted toilets immediately in public list.

Supabase fetching:
- Fetch toilets with:
  select("*").eq("is_active", true)
- Order can be by created_at or name; distance sorting happens client-side.
- If Supabase fails, show error state.
- If no env variables are present, use mockToilets and show a small dev-only console warning.

Mock data:
Create 5 mock toilet records around central London for development:
- Soho
- Piccadilly
- Covent Garden
- South Bank
- King’s Cross

Use realistic lat/lng, but placeholder hmmm_note is fine.
Example:
{
  id: "mock-1",
  name: "Waterstones Piccadilly",
  area: "Piccadilly",
  address: "203/206 Piccadilly, London W1J 9HD",
  lat: 51.5090,
  lng: -0.1342,
  access_type: "问店员",
  hmmm_note: "咖啡区附近，可能需要问 staff。",
  opening_hours: "跟随店铺营业时间",
  confidence: "中",
  last_checked: "2026-04-27",
  is_active: true
}

PWA:
Set manifest:
- name: HmmmNow
- short_name: HmmmNow
- description: 在伦敦突然 Hmmmm？帮你快速找到附近能去的厕所。
- display: standalone
- start_url: /
- theme_color: choose a warm playful colour
- background_color: warm cream

Important:
Do not spend time creating a perfect icon.
Use a simple placeholder icon or emoji-inspired generated asset if quick.

Responsive requirements:
- Must be excellent on mobile.
- Desktop can simply show a centred mobile-width layout.
- Max content width around 430px or 480px.
- Body background can fill desktop but app content should remain mobile-card-like.

Performance:
- Keep app lightweight.
- No unnecessary libraries beyond required stack.
- Do not load large assets.
- Map should only render when needed, not on initial home screen.

Accessibility basics:
- Buttons should be large enough to tap.
- Text should have readable contrast.
- Use semantic button elements.
- Do not rely only on colour for important information.

Final deliverables:
- Working Vite React TypeScript app
- Tailwind configured
- Supabase client configured
- Leaflet map working
- PWA configured
- Mock data fallback
- Clear README with:
  - how to install
  - how to run locally
  - required env vars
  - Supabase SQL setup
  - how to deploy to Vercel

Build order:
1. Create Vite React TypeScript app.
2. Install and configure Tailwind.
3. Build static UI with mock data.
4. Implement Home.
5. Implement PanicMode with geolocation and distance sorting.
6. Implement ToiletCard.
7. Implement Google Maps directions button.
8. Implement MiniMap.
9. Implement AddLooForm.
10. Add Supabase integration.
11. Add PWA config.
12. Polish Chinese copy and mobile layout.
13. Ensure npm run build succeeds.

Do not overbuild.
Do not add authentication.
Do not add a complex backend.
Do not add features outside V1 scope.
The goal is to launch a cute, useful, London-only Chinese PWA today.