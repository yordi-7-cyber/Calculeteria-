# ⚡ CalcEverything v1.0

> A hilariously powerful calculator web app built for everyone — especially for you, Ethiopia 🇪🇹

---

## 🚀 How to Run

No installs. No build steps. No nonsense.

1. Clone or download this repo
2. Open `index.html` in any browser
3. That's it. You're calculating.

---

## ✨ Features

### 🔐 Liquid Glass Sign In
- Beautiful iOS 26-style Liquid Glass auth modal
- Sign up / Sign in with email & password (stored locally)
- One-click Google & GitHub demo login
- Password show/hide toggle
- Remember me toggle switch
- Forgot password flow
- Session persists across page reloads
- User avatar badge in header after login

### 🔢 Standard Calculator
- Full arithmetic: +, −, ×, ÷, %, +/−
- Live preview result as you type
- Full keyboard support (numbers, operators, Enter, Backspace, Escape)

### 🧪 Scientific Calculator
- Trig: sin, cos, tan (degrees)
- Logarithms: log, ln
- Powers & roots: x², x³, xʸ, √x, ∛x
- Constants: π, e
- Factorial n!, absolute value |x|, inverse 1/x
- Full keyboard support

### 💪 BMI Calculator
- Metric (kg / cm) and Imperial (lb / in) modes
- Animated BMI bar with sliding marker
- Categories: Underweight → Normal → Overweight → Obese I → Obese II+
- Funny but honest health advice for each category
- Age input (optional)

### 💸 Currency Converter — Ethiopia First 🇪🇹
**30 currencies including:**
- 🇪🇹 ETB — Ethiopian Birr *(default)*
- 🇩🇯 DJF — Djiboutian Franc
- 🇸🇴 SOS — Somali Shilling
- 🇸🇩 SDG — Sudanese Pound
- 🇰🇪 KES — Kenyan Shilling
- 🇺🇬 UGX — Ugandan Shilling
- 🇹🇿 TZS — Tanzanian Shilling
- 🇷🇼 RWF — Rwandan Franc
- 🇪🇬 EGP — Egyptian Pound
- 🇳🇬 NGN — Nigerian Naira
- 🇬🇭 GHS — Ghanaian Cedi
- 🇿🇦 ZAR — South African Rand
- 🇲🇦 MAD — Moroccan Dirham
- 🌍 XOF / XAF — CFA Franc zones
- 🇦🇪 AED — UAE Dirham *(diaspora favorite)*
- 🇸🇦 SAR — Saudi Riyal *(diaspora favorite)*
- 🇺🇸 USD, 🇪🇺 EUR, 🇬🇧 GBP, and more

Rates based on approximate mid-market values, April 2026 (1 USD ≈ 156 ETB).

### 📐 Unit Converter
5 categories, 40+ units:
- 📏 Length — Meter, Km, Mile, Foot, Inch, Yard, Nautical Mile...
- ⚖️ Weight — Kg, Gram, Pound, Ounce, Ton, Stone...
- 🌡️ Temperature — Celsius, Fahrenheit, Kelvin
- 🗺️ Area — m², km², Acre, Hectare, Square Mile...
- 🚀 Speed — m/s, km/h, mph, knot, ft/s

### 📜 Calculation History
- Every calculation saved automatically to localStorage
- Slide-out history panel
- Shows type, expression, result, and timestamp
- Clear all button

### 🌙 Dark / Light Theme
- Toggle between dark (default) and light mode
- Preference saved to localStorage
- Both modes look great

---

## 🗂️ File Structure

```
CalcEverything/
├── index.html   — App structure & all UI panels
├── style.css    — Main styles, themes, calculator UI
├── auth.css     — Liquid Glass sign-in modal styles
├── app.js       — All logic: calc, BMI, currency, units, auth, history
└── README.md    — You are here
```

---

## 🛠️ Tech Stack

| What | How |
|------|-----|
| Language | Vanilla HTML, CSS, JavaScript |
| Fonts | Google Fonts — Orbitron, Boogaloo, Nunito |
| Storage | localStorage (no backend needed) |
| Auth | Client-side only (demo, no server) |
| Dependencies | Zero. None. Nada. |

---

## 🔮 Planned for v2

- [ ] Live exchange rates via free API
- [ ] Amharic (አማርኛ) language support
- [ ] Loan / mortgage calculator
- [ ] Tip calculator
- [ ] Ethiopian calendar converter (Ge'ez ↔ Gregorian)
- [ ] Export history as CSV
- [ ] PWA / installable on mobile

---

## 🇪🇹 Made with love for Ethiopia

ሰላም! This app was built with Ethiopian users in mind.  
ETB is the default currency. East African neighbors are all represented.  
More Ethiopia-specific features coming in v2.

---

*CalcEverything v1.0 — Zero dependencies. Pure web. All power.*
