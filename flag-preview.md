# 🌍 Dialing Code Dropdown with Flags

## Preview of Dropdown Options

The dialing code dropdown now displays countries with their respective flag emojis:

### Sample Countries:
- 🇮🇳 India (भारत) (+91)
- 🇺🇸 United States (+1)
- 🇬🇧 United Kingdom (+44)
- 🇨🇦 Canada (+1)
- 🇦🇺 Australia (+61)
- 🇩🇪 Germany (+49)
- 🇫🇷 France (+33)
- 🇯🇵 Japan (+81)
- 🇨🇳 China (+86)
- 🇧🇷 Brazil (+55)
- 🇪🇸 Spain (+34)
- 🇮🇹 Italy (+39)
- 🇷🇺 Russia (+7)
- 🇰🇷 South Korea (+82)
- 🇲🇽 Mexico (+52)

### Features:
- ✅ **243 countries** with flags and dialing codes
- ✅ **Search functionality** - users can search by country name
- ✅ **Alphabetical sorting** for easy navigation
- ✅ **Flag emojis** generated from ISO2 country codes
- ✅ **Fallback support** with common countries if API fails
- ✅ **Loading state** with spinner while fetching data
- ✅ **Error handling** with user-friendly messages

### Technical Implementation:
- Uses Unicode flag emoji generation from ISO2 codes
- Integrates with existing `react-native-element-dropdown`
- Maintains compatibility with existing form validation
- Responsive design matching app's UI/UX

### API Integration:
- Fetches from: `http://192.168.0.132:3000/sec/countries/codes`
- Transforms API response to include flag emojis
- Handles network errors gracefully
