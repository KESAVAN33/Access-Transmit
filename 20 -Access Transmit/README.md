# AccessTransit - Human-Centered Public Transport Assistant

A complete prototype of a web application that provides accessible, real-time public transit information with safety alerts and crowd monitoring.

## Features

### 🏠 Home Screen
- View all available bus routes
- Search routes by name or description
- **Accessibility Toggle**: Filter to show only wheelchair-accessible buses
- Quick statistics overview (active buses, alerts, accessible buses)
- Color-coded crowd indicators for each route

### 🚌 Route Details
- List of all buses on a selected route
- Real-time location and next stop information
- **Predictive Arrival Time**: Calculated as `distance / speed`
- Crowd level indicators: 🟢 Low | 🟡 Medium | 🔴 High
- **Risk Alerts**: Warns when `crowdLevel == High` AND `turnAngle > 30°`
- Sort by arrival time, crowd level, or distance
- **Voice Guidance**: Text-to-speech for accessibility

### 📍 Tracking Screen
- Simulated map view with animated bus position
- Real-time updates every 2 seconds
- Journey information (current/next stop, ETA, speed)
- Live crowd level with capacity bar
- Safety status indicator
- **Push Notifications**: Alerts for risk level changes
- Accessibility information display

### 📊 Admin Dashboard
- Overview tab with charts:
  - Bus utilization by route (bar chart)
  - Crowd distribution (pie chart)
  - Hourly crowd trends (area chart)
- Fleet status table with all buses
- Active alerts management

## Data Simulation

The app uses simulated data with the following structure per bus:

```javascript
{
  busId: 'BUS-101',
  route: 'route-1',
  routeName: 'Downtown Express',
  currentLocation: { lat: 40.7128, lng: -74.0060 },
  currentStop: 'Central Station',
  nextStop: 'City Hall',
  distanceToNextStop: 2.5, // km
  avgSpeed: 25, // km/h
  crowdLevel: 'Low', // 'Low' | 'Medium' | 'High'
  turnAngle: 15, // degrees
  accessible: true,
  capacity: 50,
  currentPassengers: 15
}
```

### Logic Implementations:

1. **Predictive Arrival Time**:
   ```javascript
   arrivalMinutes = (distanceToNextStop / avgSpeed) * 60
   ```

2. **Risk Assessment**:
   ```javascript
   if (crowdLevel === 'High' && turnAngle > 30) {
     return '⚠️ High Risk: Overcrowded bus on sharp turn'
   }
   ```

3. **Accessibility Filter**:
   ```javascript
   buses.filter(bus => bus.accessible === true)
   ```

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Navigate to the project directory:
   ```bash
   cd AccessTransit
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
AccessTransit/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── HomeScreen.js      # Route selection & accessibility toggle
│   │   ├── RouteDetails.js    # Bus list with real-time info
│   │   ├── TrackingScreen.js  # Map view with live tracking
│   │   └── Dashboard.js       # Admin analytics dashboard
│   ├── data/
│   │   └── busData.js         # Simulated data & utility functions
│   ├── styles/
│   │   └── index.css          # Complete application styling
│   ├── App.js                 # Main app with routing
│   └── index.js               # Entry point
└── package.json
```

## UI Features

- **Responsive Design**: Works on mobile and desktop
- **Clean Modern Interface**: Card-based layout with smooth transitions
- **Color Coding**: Intuitive status indicators
- **Animations**: Pulse effects for alerts, smooth transitions
- **Accessibility**: 
  - ARIA labels for screen readers
  - Voice guidance via Web Speech API
  - High contrast mode support
  - Keyboard navigation support
  - Reduced motion support

## Technologies Used

- **React 18**: UI framework
- **React Router DOM**: Client-side routing
- **Recharts**: Charts for dashboard
- **Web Speech API**: Voice guidance
- **CSS3**: Styling with CSS variables

## Simulated Real-Time Updates

The application simulates real-time data updates:
- Bus positions update every 3 seconds
- Dashboard refreshes every 5 seconds
- Tracking screen updates every 2 seconds

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

Note: Voice guidance requires a browser that supports the Web Speech API.

## License

MIT License - Feel free to use this prototype for learning or as a starting point for your own projects.
