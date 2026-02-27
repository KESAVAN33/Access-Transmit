/**
 * AccessTransit - Data Simulation Module
 * 
 * This module provides simulated bus and train data, routes, and all the logic
 * for predictive arrival times, risk assessment, and accessibility filtering.
 */

// ============================================================================
// BUS ROUTE DEFINITIONS
// ============================================================================
export const routes = [
  // COIMBATORE ROUTES
  {
    id: 'route-1',
    name: 'Downtown Express',
    color: '#2563eb',
    stops: ['Central Station', 'City Hall', 'Market Square', 'Tech Park', 'University'],
    description: 'Express route connecting downtown to university district',
    city: 'Coimbatore'
  },
  {
    id: 'route-4',
    name: 'Medical District',
    color: '#7c3aed',
    stops: ['Central Station', 'General Hospital', 'Medical Center', 'Pharmacy Plaza', 'Senior Care'],
    description: 'Route serving healthcare facilities',
    city: 'Coimbatore'
  },
  {
    id: 'route-5',
    name: 'RS Puram Loop',
    color: '#f59e0b',
    stops: ['Gandhipuram', 'RS Puram', 'Saibaba Colony', 'Race Course', 'Gandhipuram'],
    description: 'Circular route through residential areas',
    city: 'Coimbatore'
  },
  {
    id: 'route-6',
    name: 'Peelamedu Tech Route',
    color: '#10b981',
    stops: ['Ukkadam', 'Singanallur', 'Peelamedu', 'TIDEL Park', 'Avinashi Road'],
    description: 'IT corridor express service',
    city: 'Coimbatore'
  },
  
  // CHENNAI ROUTES
  {
    id: 'route-2',
    name: 'Airport Shuttle',
    color: '#059669',
    stops: ['Airport Terminal', 'Hotel District', 'Convention Center', 'Central Station'],
    description: 'Direct shuttle service to and from the airport',
    city: 'Chennai'
  },
  {
    id: 'route-7',
    name: 'Marina Beach Line',
    color: '#0ea5e9',
    stops: ['Central', 'Fort St George', 'Marina Beach', 'Besant Nagar', 'Thiruvanmiyur'],
    description: 'Scenic coastal route along Marina Beach',
    city: 'Chennai'
  },
  {
    id: 'route-8',
    name: 'T Nagar Shopping Express',
    color: '#ec4899',
    stops: ['Egmore', 'Nungambakkam', 'T Nagar', 'Pondy Bazaar', 'Mambalam'],
    description: 'Shopping district connector',
    city: 'Chennai'
  },
  {
    id: 'route-9',
    name: 'OMR IT Corridor',
    color: '#6366f1',
    stops: ['Adyar', 'Tidel Park', 'Perungudi', 'Sholinganallur', 'Siruseri'],
    description: 'IT park express route',
    city: 'Chennai'
  },
  
  // ERODE ROUTES
  {
    id: 'route-3',
    name: 'Circular Line',
    color: '#dc2626',
    stops: ['North Station', 'East Mall', 'South Park', 'West Beach', 'North Station'],
    description: 'Circular route covering all major city areas',
    city: 'Erode'
  },
  {
    id: 'route-10',
    name: 'Erode Junction Link',
    color: '#84cc16',
    stops: ['Erode Junction', 'Bus Stand', 'Collectorate', 'GH', 'VOC Park'],
    description: 'Central city connector',
    city: 'Erode'
  },
  {
    id: 'route-11',
    name: 'Bhavani Express',
    color: '#f97316',
    stops: ['Erode Bus Stand', 'Surampatti', 'Bhavanisagar', 'Bhavani'],
    description: 'Inter-city express to Bhavani',
    city: 'Erode'
  },
  
  // BANGALORE ROUTES
  {
    id: 'route-12',
    name: 'MG Road Metro Feeder',
    color: '#8b5cf6',
    stops: ['Majestic', 'Cubbon Park', 'MG Road', 'Trinity Circle', 'Indiranagar'],
    description: 'Metro station feeder service',
    city: 'Bangalore'
  },
  {
    id: 'route-13',
    name: 'Electronic City Express',
    color: '#14b8a6',
    stops: ['Silk Board', 'Bommanahalli', 'Electronic City Phase 1', 'Infosys', 'Wipro Gate'],
    description: 'IT hub express route',
    city: 'Bangalore'
  },
  {
    id: 'route-14',
    name: 'Whitefield Tech Park',
    color: '#f43f5e',
    stops: ['KR Puram', 'Marathahalli', 'ITPL', 'Whitefield', 'Hope Farm'],
    description: 'Eastern IT corridor service',
    city: 'Bangalore'
  },
  {
    id: 'route-15',
    name: 'Airport Link BIAS',
    color: '#0284c7',
    stops: ['Majestic', 'Hebbal', 'Yelahanka', 'Devanahalli', 'KIA Terminal'],
    description: 'Airport express shuttle',
    city: 'Bangalore'
  },
  
  // HYDERABAD ROUTES
  {
    id: 'route-16',
    name: 'HITEC City Express',
    color: '#7c3aed',
    stops: ['Secunderabad', 'Begumpet', 'Ameerpet', 'Madhapur', 'HITEC City'],
    description: 'IT corridor direct service',
    city: 'Hyderabad'
  },
  {
    id: 'route-17',
    name: 'Old City Heritage',
    color: '#ca8a04',
    stops: ['Charminar', 'Mecca Masjid', 'Salar Jung', 'Nampally', 'Abids'],
    description: 'Heritage tourism route',
    city: 'Hyderabad'
  },
  {
    id: 'route-18',
    name: 'Gachibowli Loop',
    color: '#a855f7',
    stops: ['Jubilee Hills', 'Banjara Hills', 'Gachibowli', 'Financial District', 'Nanakramguda'],
    description: 'Business district connector',
    city: 'Hyderabad'
  },
  
  // MUMBAI ROUTES
  {
    id: 'route-19',
    name: 'Marine Drive Express',
    color: '#0891b2',
    stops: ['CST', 'Churchgate', 'Marine Drive', 'Girgaon', 'Haji Ali'],
    description: 'Coastal scenic route',
    city: 'Mumbai'
  },
  {
    id: 'route-20',
    name: 'BKC Business Link',
    color: '#65a30d',
    stops: ['Kurla', 'BKC', 'Kalanagar', 'Bandra Station', 'Linking Road'],
    description: 'Business district shuttle',
    city: 'Mumbai'
  },
  {
    id: 'route-21',
    name: 'Andheri Local',
    color: '#e11d48',
    stops: ['Andheri Station', 'MIDC', 'SEEPZ', 'Chakala', 'Airport'],
    description: 'Andheri area circular',
    city: 'Mumbai'
  },
  
  // DELHI ROUTES
  {
    id: 'route-22',
    name: 'Connaught Place Ring',
    color: '#dc2626',
    stops: ['New Delhi Station', 'Connaught Place', 'Janpath', 'India Gate', 'Mandi House'],
    description: 'Central Delhi circular',
    city: 'Delhi'
  },
  {
    id: 'route-23',
    name: 'Gurugram Cyber Express',
    color: '#0d9488',
    stops: ['IFFCO Chowk', 'Cyber Hub', 'DLF Phase 1', 'Sikanderpur', 'MG Road'],
    description: 'Corporate park shuttle',
    city: 'Delhi'
  },
  {
    id: 'route-24',
    name: 'Old Delhi Heritage',
    color: '#b45309',
    stops: ['Chandni Chowk', 'Red Fort', 'Jama Masjid', 'Daryaganj', 'Delhi Gate'],
    description: 'Heritage area tour route',
    city: 'Delhi'
  },
  {
    id: 'route-25',
    name: 'Noida IT Park',
    color: '#7c2d12',
    stops: ['Sector 18', 'Sector 62', 'Tech Park', 'Sector 125', 'Greater Noida'],
    description: 'Noida tech corridor service',
    city: 'Delhi'
  }
];

// ============================================================================
// TRAIN ROUTE DEFINITIONS (LOCAL/METRO/SUBURBAN)
// ============================================================================
export const trainRoutes = [
  // MUMBAI LOCAL TRAINS
  {
    id: 'train-route-1',
    name: 'Western Line',
    color: '#1d4ed8',
    type: 'local',
    stations: ['Churchgate', 'Marine Lines', 'Charni Road', 'Mumbai Central', 'Dadar', 'Bandra', 'Andheri', 'Borivali', 'Virar'],
    description: 'Western Railway suburban line',
    city: 'Mumbai',
    frequency: '3-5 mins peak, 10-15 mins off-peak'
  },
  {
    id: 'train-route-2',
    name: 'Central Line',
    color: '#dc2626',
    type: 'local',
    stations: ['CST', 'Masjid', 'Byculla', 'Dadar', 'Kurla', 'Ghatkopar', 'Thane', 'Dombivli', 'Kalyan'],
    description: 'Central Railway main line',
    city: 'Mumbai',
    frequency: '3-5 mins peak, 8-12 mins off-peak'
  },
  {
    id: 'train-route-3',
    name: 'Harbour Line',
    color: '#059669',
    type: 'local',
    stations: ['CST', 'Wadala', 'Chembur', 'Vashi', 'Nerul', 'Belapur', 'Panvel'],
    description: 'Harbour line connecting to Navi Mumbai',
    city: 'Mumbai',
    frequency: '5-10 mins peak, 15-20 mins off-peak'
  },

  // CHENNAI SUBURBAN/METRO
  {
    id: 'train-route-4',
    name: 'Chennai Beach Line',
    color: '#0891b2',
    type: 'suburban',
    stations: ['Chennai Beach', 'Fort', 'Park', 'Egmore', 'Chetpet', 'Nungambakkam', 'Kodambakkam', 'Mambalam', 'Tambaram'],
    description: 'Chennai suburban beach to Tambaram',
    city: 'Chennai',
    frequency: '10-15 mins throughout'
  },
  {
    id: 'train-route-5',
    name: 'Chennai Metro Blue Line',
    color: '#2563eb',
    type: 'metro',
    stations: ['Wimco Nagar', 'Thiruvottiyur', 'Toll Gate', 'Washermanpet', 'Central', 'Egmore', 'T Nagar', 'Guindy', 'Airport'],
    description: 'Metro connecting north to airport',
    city: 'Chennai',
    frequency: '5-8 mins'
  },
  {
    id: 'train-route-6',
    name: 'Chennai Metro Green Line',
    color: '#16a34a',
    type: 'metro',
    stations: ['Central', 'Govt. Estate', 'LIC', 'Thousand Lights', 'AG-DMS', 'Teynampet', 'Nandanam', 'Saidapet', 'St. Thomas Mount'],
    description: 'Metro green corridor',
    city: 'Chennai',
    frequency: '5-8 mins'
  },

  // BANGALORE METRO
  {
    id: 'train-route-7',
    name: 'Namma Metro Purple Line',
    color: '#7c3aed',
    type: 'metro',
    stations: ['Whitefield', 'Kadugodi', 'Pattandur Agrahara', 'Mahadevapura', 'Garudacharpalya', 'Baiyyappanahalli', 'Indiranagar', 'Halasuru', 'Trinity', 'MG Road', 'Cubbon Park', 'Vidhana Soudha', 'Sir M. Visveshwaraya', 'Majestic', 'City Railway', 'Magadi Road', 'Hosahalli', 'Vijayanagar', 'Attiguppe', 'Deepanjali Nagar', 'Mysore Road', 'Nayandahalli', 'Rajarajeshwari Nagar', 'Jnanabharathi', 'Pattanagere', 'Kengeri Bus Terminal', 'Kengeri', 'Challaghatta'],
    description: 'East-West metro corridor',
    city: 'Bangalore',
    frequency: '4-6 mins peak, 10 mins off-peak'
  },
  {
    id: 'train-route-8',
    name: 'Namma Metro Green Line',
    color: '#22c55e',
    type: 'metro',
    stations: ['Nagasandra', 'Dasarahalli', 'Jalahalli', 'Peenya Industry', 'Peenya', 'Goraguntepalya', 'Yeshwanthpur', 'Sandal Soap Factory', 'Mahalakshmi', 'Rajajinagar', 'Kuvempu Road', 'Srirampura', 'Sampige Road', 'Majestic', 'Chickpete', 'KR Market', 'National College', 'Lalbagh', 'South End Circle', 'Jayanagar', 'RV Road', 'Banashankari', 'JP Nagar', 'Yelachenahalli', 'Konanakunte Cross', 'Doddakallasandra', 'Vajarahalli', 'Thalaghattapura', 'Silk Institute'],
    description: 'North-South metro corridor',
    city: 'Bangalore',
    frequency: '4-6 mins peak, 10 mins off-peak'
  },

  // HYDERABAD METRO
  {
    id: 'train-route-9',
    name: 'Hyderabad Metro Red Line',
    color: '#ef4444',
    type: 'metro',
    stations: ['Miyapur', 'JNTU College', 'KPHB Colony', 'Kukatpally', 'Balanagar', 'Moosapet', 'Bharat Nagar', 'Erragadda', 'ESI Hospital', 'SR Nagar', 'Ameerpet', 'Punjagutta', 'Irrum Manzil', 'Khairatabad', 'Lakdi-ka-pul', 'Assembly', 'Nampally', 'Gandhi Bhavan', 'Osmania Medical', 'MG Bus Station', 'Malakpet', 'New Market', 'Musarambagh', 'Dilsukhnagar', 'Chaitanyapuri', 'Victoria Memorial', 'LB Nagar'],
    description: 'Miyapur to LB Nagar corridor',
    city: 'Hyderabad',
    frequency: '5-7 mins'
  },
  {
    id: 'train-route-10',
    name: 'Hyderabad Metro Blue Line',
    color: '#3b82f6',
    type: 'metro',
    stations: ['Raidurg', 'HITEC City', 'Durgam Cheruvu', 'Madhapur', 'Jubilee Hills', 'Yousufguda', 'Madhura Nagar', 'Ameerpet', 'Begumpet', 'Prakash Nagar', 'Rasoolpura', 'Paradise', 'JBS'],
    description: 'Raidurg to JBS corridor',
    city: 'Hyderabad',
    frequency: '5-7 mins'
  },

  // DELHI METRO
  {
    id: 'train-route-11',
    name: 'Delhi Metro Blue Line',
    color: '#2563eb',
    type: 'metro',
    stations: ['Dwarka Sector 21', 'Dwarka Sector 8', 'Dwarka Sector 9', 'Dwarka Sector 10', 'Dwarka Sector 11', 'Dwarka Sector 12', 'Dwarka Sector 13', 'Dwarka Sector 14', 'Dwarka', 'Dwarka Mor', 'Nawada', 'Uttam Nagar West', 'Uttam Nagar East', 'Janakpuri West', 'Janakpuri East', 'Tilak Nagar', 'Subhash Nagar', 'Tagore Garden', 'Rajouri Garden', 'Ramesh Nagar', 'Moti Nagar', 'Kirti Nagar', 'Shadipur', 'Patel Nagar', 'Rajendra Place', 'Karol Bagh', 'Jhandewalan', 'Ramakrishna Ashram Marg', 'Rajiv Chowk', 'Barakhamba Road', 'Mandi House', 'Pragati Maidan', 'Indraprastha', 'Yamuna Bank', 'Akshardham', 'Mayur Vihar-I', 'Mayur Vihar Extension', 'New Ashok Nagar', 'Noida Sector 15', 'Noida Sector 16', 'Noida Sector 18', 'Botanical Garden', 'Golf Course', 'Noida City Centre', 'Noida Sector 34', 'Noida Sector 52', 'Noida Sector 61', 'Noida Sector 59', 'Noida Sector 62', 'Noida Electronic City'],
    description: 'Dwarka to Noida Electronic City',
    city: 'Delhi',
    frequency: '3-5 mins peak'
  },
  {
    id: 'train-route-12',
    name: 'Delhi Metro Yellow Line',
    color: '#eab308',
    type: 'metro',
    stations: ['Samaypur Badli', 'Rohini Sector 18-19', 'Haiderpur Badli Mor', 'Jahangirpuri', 'Adarsh Nagar', 'Azadpur', 'Model Town', 'GTB Nagar', 'Vishwavidyalaya', 'Vidhan Sabha', 'Civil Lines', 'Kashmere Gate', 'Chandni Chowk', 'Chawri Bazar', 'New Delhi', 'Rajiv Chowk', 'Patel Chowk', 'Central Secretariat', 'Udyog Bhawan', 'Lok Kalyan Marg', 'Jor Bagh', 'INA', 'AIIMS', 'Green Park', 'Hauz Khas', 'Malviya Nagar', 'Saket', 'Qutab Minar', 'Chhattarpur', 'Sultanpur', 'Ghitorni', 'Arjan Garh', 'Guru Dronacharya', 'Sikanderpur', 'MG Road', 'IFFCO Chowk', 'HUDA City Centre'],
    description: 'Samaypur Badli to HUDA City Centre',
    city: 'Delhi',
    frequency: '3-5 mins peak'
  },
  {
    id: 'train-route-13',
    name: 'Delhi Metro Red Line',
    color: '#dc2626',
    type: 'metro',
    stations: ['Shaheed Sthal', 'Hindon River', 'Arthala', 'Mohan Nagar', 'Shyam Park', 'Major Mohit Sharma', 'Raj Bagh', 'Shaheed Nagar', 'Dilshad Garden', 'Jhilmil', 'Mansarovar Park', 'Shahdara', 'Welcome', 'Seelampur', 'Shastri Park', 'Kashmere Gate', 'Tis Hazari', 'Pulbangash', 'Pratap Nagar', 'Shastri Nagar', 'Inderlok', 'Kanhaiya Nagar', 'Keshav Puram', 'Netaji Subhash Place', 'Kohat Enclave', 'Pitampura', 'Rohini East', 'Rohini West', 'Rithala'],
    description: 'Shaheed Sthal to Rithala',
    city: 'Delhi',
    frequency: '4-6 mins peak'
  },

  // KOLKATA METRO (added for completeness)
  {
    id: 'train-route-14',
    name: 'Kolkata Metro Blue Line',
    color: '#0ea5e9',
    type: 'metro',
    stations: ['Dakshineswar', 'Baranagar', 'Noapara', 'Dum Dum', 'Belgachia', 'Shyambazar', 'Sovabazar-Sutanuti', 'Girish Park', 'Mahatma Gandhi Road', 'Central', 'Chandni Chowk', 'Esplanade', 'Park Street', 'Maidan', 'Rabindra Sadan', 'Netaji Bhavan', 'Jatin Das Park', 'Kalighat', 'Rabindra Sarobar', 'Mahanayak Uttam Kumar', 'Netaji', 'Masterda Surya Sen', 'Kavi Subhash'],
    description: 'North-South corridor',
    city: 'Kolkata',
    frequency: '5-8 mins'
  }
];

// ============================================================================
// SIMULATED TRAIN DATA
// ============================================================================
let trainData = [
  // MUMBAI LOCAL TRAINS
  {
    trainId: 'LOCAL-WR-101',
    route: 'train-route-1',
    routeName: 'Western Line',
    trainType: 'local',
    currentLocation: { lat: 18.9398, lng: 72.8354 },
    currentStation: 'Churchgate',
    nextStation: 'Marine Lines',
    distanceToNextStation: 1.2,
    avgSpeed: 45,
    crowdLevel: 'High',
    accessible: true,
    acCoach: false,
    coaches: 12,
    currentPassengers: 1800,
    capacity: 2000,
    platform: 3,
    direction: 'Northbound',
    lastUpdated: new Date().toISOString()
  },
  {
    trainId: 'LOCAL-WR-102',
    route: 'train-route-1',
    routeName: 'Western Line',
    trainType: 'local',
    currentLocation: { lat: 19.0544, lng: 72.8402 },
    currentStation: 'Bandra',
    nextStation: 'Andheri',
    distanceToNextStation: 4.2,
    avgSpeed: 50,
    crowdLevel: 'Medium',
    accessible: true,
    acCoach: true,
    coaches: 15,
    currentPassengers: 1200,
    capacity: 2500,
    platform: 1,
    direction: 'Northbound',
    lastUpdated: new Date().toISOString()
  },
  {
    trainId: 'LOCAL-CR-201',
    route: 'train-route-2',
    routeName: 'Central Line',
    trainType: 'local',
    currentLocation: { lat: 18.9402, lng: 72.8356 },
    currentStation: 'CST',
    nextStation: 'Masjid',
    distanceToNextStation: 0.8,
    avgSpeed: 35,
    crowdLevel: 'High',
    accessible: true,
    acCoach: false,
    coaches: 12,
    currentPassengers: 1900,
    capacity: 2000,
    platform: 5,
    direction: 'Northbound',
    lastUpdated: new Date().toISOString()
  },
  {
    trainId: 'LOCAL-HR-301',
    route: 'train-route-3',
    routeName: 'Harbour Line',
    trainType: 'local',
    currentLocation: { lat: 19.0330, lng: 72.9300 },
    currentStation: 'Vashi',
    nextStation: 'Nerul',
    distanceToNextStation: 3.5,
    avgSpeed: 55,
    crowdLevel: 'Low',
    accessible: true,
    acCoach: false,
    coaches: 9,
    currentPassengers: 400,
    capacity: 1200,
    platform: 2,
    direction: 'Southbound',
    lastUpdated: new Date().toISOString()
  },

  // CHENNAI TRAINS
  {
    trainId: 'CHENNAI-SUB-401',
    route: 'train-route-4',
    routeName: 'Chennai Beach Line',
    trainType: 'suburban',
    currentLocation: { lat: 13.0827, lng: 80.2707 },
    currentStation: 'Chennai Beach',
    nextStation: 'Fort',
    distanceToNextStation: 1.0,
    avgSpeed: 40,
    crowdLevel: 'Medium',
    accessible: true,
    acCoach: false,
    coaches: 8,
    currentPassengers: 600,
    capacity: 1000,
    platform: 1,
    direction: 'Westbound',
    lastUpdated: new Date().toISOString()
  },
  {
    trainId: 'METRO-CH-501',
    route: 'train-route-5',
    routeName: 'Chennai Metro Blue Line',
    trainType: 'metro',
    currentLocation: { lat: 13.0827, lng: 80.2707 },
    currentStation: 'Central',
    nextStation: 'Egmore',
    distanceToNextStation: 1.5,
    avgSpeed: 35,
    crowdLevel: 'Low',
    accessible: true,
    acCoach: true,
    coaches: 4,
    currentPassengers: 150,
    capacity: 400,
    platform: 1,
    direction: 'Southbound',
    lastUpdated: new Date().toISOString()
  },
  {
    trainId: 'METRO-CH-502',
    route: 'train-route-6',
    routeName: 'Chennai Metro Green Line',
    trainType: 'metro',
    currentLocation: { lat: 13.0418, lng: 80.2341 },
    currentStation: 'T Nagar',
    nextStation: 'Nandanam',
    distanceToNextStation: 1.8,
    avgSpeed: 38,
    crowdLevel: 'Medium',
    accessible: true,
    acCoach: true,
    coaches: 4,
    currentPassengers: 220,
    capacity: 400,
    platform: 2,
    direction: 'Southbound',
    lastUpdated: new Date().toISOString()
  },

  // BANGALORE METRO
  {
    trainId: 'METRO-BLR-601',
    route: 'train-route-7',
    routeName: 'Namma Metro Purple Line',
    trainType: 'metro',
    currentLocation: { lat: 12.9698, lng: 77.7500 },
    currentStation: 'Whitefield',
    nextStation: 'Kadugodi',
    distanceToNextStation: 2.0,
    avgSpeed: 40,
    crowdLevel: 'High',
    accessible: true,
    acCoach: true,
    coaches: 6,
    currentPassengers: 550,
    capacity: 600,
    platform: 1,
    direction: 'Westbound',
    lastUpdated: new Date().toISOString()
  },
  {
    trainId: 'METRO-BLR-602',
    route: 'train-route-7',
    routeName: 'Namma Metro Purple Line',
    trainType: 'metro',
    currentLocation: { lat: 12.9716, lng: 77.5946 },
    currentStation: 'MG Road',
    nextStation: 'Cubbon Park',
    distanceToNextStation: 1.2,
    avgSpeed: 35,
    crowdLevel: 'Medium',
    accessible: true,
    acCoach: true,
    coaches: 6,
    currentPassengers: 380,
    capacity: 600,
    platform: 2,
    direction: 'Westbound',
    lastUpdated: new Date().toISOString()
  },
  {
    trainId: 'METRO-BLR-701',
    route: 'train-route-8',
    routeName: 'Namma Metro Green Line',
    trainType: 'metro',
    currentLocation: { lat: 12.9771, lng: 77.5725 },
    currentStation: 'Majestic',
    nextStation: 'Chickpete',
    distanceToNextStation: 1.0,
    avgSpeed: 32,
    crowdLevel: 'High',
    accessible: true,
    acCoach: true,
    coaches: 6,
    currentPassengers: 580,
    capacity: 600,
    platform: 1,
    direction: 'Southbound',
    lastUpdated: new Date().toISOString()
  },

  // HYDERABAD METRO
  {
    trainId: 'METRO-HYD-801',
    route: 'train-route-9',
    routeName: 'Hyderabad Metro Red Line',
    trainType: 'metro',
    currentLocation: { lat: 17.4500, lng: 78.3800 },
    currentStation: 'HITEC City',
    nextStation: 'Durgam Cheruvu',
    distanceToNextStation: 1.5,
    avgSpeed: 38,
    crowdLevel: 'High',
    accessible: true,
    acCoach: true,
    coaches: 3,
    currentPassengers: 450,
    capacity: 500,
    platform: 1,
    direction: 'Eastbound',
    lastUpdated: new Date().toISOString()
  },
  {
    trainId: 'METRO-HYD-802',
    route: 'train-route-10',
    routeName: 'Hyderabad Metro Blue Line',
    trainType: 'metro',
    currentLocation: { lat: 17.4300, lng: 78.4500 },
    currentStation: 'Ameerpet',
    nextStation: 'Begumpet',
    distanceToNextStation: 2.0,
    avgSpeed: 42,
    crowdLevel: 'Medium',
    accessible: true,
    acCoach: true,
    coaches: 3,
    currentPassengers: 280,
    capacity: 500,
    platform: 2,
    direction: 'Northbound',
    lastUpdated: new Date().toISOString()
  },

  // DELHI METRO
  {
    trainId: 'METRO-DEL-901',
    route: 'train-route-11',
    routeName: 'Delhi Metro Blue Line',
    trainType: 'metro',
    currentLocation: { lat: 28.6315, lng: 77.2167 },
    currentStation: 'Rajiv Chowk',
    nextStation: 'Barakhamba Road',
    distanceToNextStation: 0.8,
    avgSpeed: 35,
    crowdLevel: 'High',
    accessible: true,
    acCoach: true,
    coaches: 8,
    currentPassengers: 1100,
    capacity: 1200,
    platform: 3,
    direction: 'Eastbound',
    lastUpdated: new Date().toISOString()
  },
  {
    trainId: 'METRO-DEL-902',
    route: 'train-route-11',
    routeName: 'Delhi Metro Blue Line',
    trainType: 'metro',
    currentLocation: { lat: 28.5700, lng: 77.3200 },
    currentStation: 'Noida Sector 18',
    nextStation: 'Botanical Garden',
    distanceToNextStation: 1.5,
    avgSpeed: 40,
    crowdLevel: 'Medium',
    accessible: true,
    acCoach: true,
    coaches: 8,
    currentPassengers: 750,
    capacity: 1200,
    platform: 1,
    direction: 'Eastbound',
    lastUpdated: new Date().toISOString()
  },
  {
    trainId: 'METRO-DEL-1001',
    route: 'train-route-12',
    routeName: 'Delhi Metro Yellow Line',
    trainType: 'metro',
    currentLocation: { lat: 28.6129, lng: 77.2295 },
    currentStation: 'Central Secretariat',
    nextStation: 'Udyog Bhawan',
    distanceToNextStation: 1.0,
    avgSpeed: 38,
    crowdLevel: 'Medium',
    accessible: true,
    acCoach: true,
    coaches: 8,
    currentPassengers: 680,
    capacity: 1200,
    platform: 2,
    direction: 'Southbound',
    lastUpdated: new Date().toISOString()
  },
  {
    trainId: 'METRO-DEL-1101',
    route: 'train-route-13',
    routeName: 'Delhi Metro Red Line',
    trainType: 'metro',
    currentLocation: { lat: 28.6562, lng: 77.2410 },
    currentStation: 'Kashmere Gate',
    nextStation: 'Tis Hazari',
    distanceToNextStation: 1.2,
    avgSpeed: 36,
    crowdLevel: 'Low',
    accessible: true,
    acCoach: true,
    coaches: 6,
    currentPassengers: 320,
    capacity: 900,
    platform: 4,
    direction: 'Westbound',
    lastUpdated: new Date().toISOString()
  }
];

// ============================================================================
// SIMULATED BUS DATA
// ============================================================================
let busData = [
  // Route 1 - Downtown Express
  {
    busId: 'BUS-101',
    route: 'route-1',
    routeName: 'Downtown Express',
    currentLocation: { lat: 40.7128, lng: -74.0060 },
    currentStop: 'Central Station',
    nextStop: 'City Hall',
    distanceToNextStop: 2.5, // km
    avgSpeed: 25, // km/h
    crowdLevel: 'Low',
    turnAngle: 15,
    accessible: true,
    capacity: 50,
    currentPassengers: 15,
    lastUpdated: new Date().toISOString()
  },
  {
    busId: 'BUS-102',
    route: 'route-1',
    routeName: 'Downtown Express',
    currentLocation: { lat: 40.7150, lng: -74.0080 },
    currentStop: 'City Hall',
    nextStop: 'Market Square',
    distanceToNextStop: 1.8,
    avgSpeed: 20,
    crowdLevel: 'Medium',
    turnAngle: 25,
    accessible: true,
    capacity: 50,
    currentPassengers: 28,
    lastUpdated: new Date().toISOString()
  },
  {
    busId: 'BUS-103',
    route: 'route-1',
    routeName: 'Downtown Express',
    currentLocation: { lat: 40.7180, lng: -74.0100 },
    currentStop: 'Market Square',
    nextStop: 'Tech Park',
    distanceToNextStop: 3.2,
    avgSpeed: 30,
    crowdLevel: 'High',
    turnAngle: 45, // High risk: overcrowded + sharp turn
    accessible: false,
    capacity: 50,
    currentPassengers: 48,
    lastUpdated: new Date().toISOString()
  },
  // Route 2 - Airport Shuttle
  {
    busId: 'BUS-201',
    route: 'route-2',
    routeName: 'Airport Shuttle',
    currentLocation: { lat: 40.6413, lng: -73.7781 },
    currentStop: 'Airport Terminal',
    nextStop: 'Hotel District',
    distanceToNextStop: 5.0,
    avgSpeed: 40,
    crowdLevel: 'Low',
    turnAngle: 10,
    accessible: true,
    capacity: 60,
    currentPassengers: 20,
    lastUpdated: new Date().toISOString()
  },
  {
    busId: 'BUS-202',
    route: 'route-2',
    routeName: 'Airport Shuttle',
    currentLocation: { lat: 40.6500, lng: -73.7900 },
    currentStop: 'Hotel District',
    nextStop: 'Convention Center',
    distanceToNextStop: 2.0,
    avgSpeed: 25,
    crowdLevel: 'High',
    turnAngle: 35, // High risk
    accessible: true,
    capacity: 60,
    currentPassengers: 55,
    lastUpdated: new Date().toISOString()
  },
  // Route 3 - Circular Line
  {
    busId: 'BUS-301',
    route: 'route-3',
    routeName: 'Circular Line',
    currentLocation: { lat: 40.7300, lng: -74.0200 },
    currentStop: 'North Station',
    nextStop: 'East Mall',
    distanceToNextStop: 4.0,
    avgSpeed: 22,
    crowdLevel: 'Medium',
    turnAngle: 20,
    accessible: false,
    capacity: 45,
    currentPassengers: 25,
    lastUpdated: new Date().toISOString()
  },
  {
    busId: 'BUS-302',
    route: 'route-3',
    routeName: 'Circular Line',
    currentLocation: { lat: 40.7250, lng: -74.0150 },
    currentStop: 'South Park',
    nextStop: 'West Beach',
    distanceToNextStop: 3.5,
    avgSpeed: 28,
    crowdLevel: 'Low',
    turnAngle: 12,
    accessible: true,
    capacity: 45,
    currentPassengers: 10,
    lastUpdated: new Date().toISOString()
  },
  // Route 4 - Medical District
  {
    busId: 'BUS-401',
    route: 'route-4',
    routeName: 'Medical District',
    currentLocation: { lat: 40.7400, lng: -74.0300 },
    currentStop: 'Central Station',
    nextStop: 'General Hospital',
    distanceToNextStop: 1.5,
    avgSpeed: 18,
    crowdLevel: 'Medium',
    turnAngle: 8,
    accessible: true,
    capacity: 40,
    currentPassengers: 22,
    lastUpdated: new Date().toISOString()
  },
  {
    busId: 'BUS-402',
    route: 'route-4',
    routeName: 'Medical District',
    currentLocation: { lat: 40.7420, lng: -74.0280 },
    currentStop: 'Medical Center',
    nextStop: 'Pharmacy Plaza',
    distanceToNextStop: 0.8,
    avgSpeed: 15,
    crowdLevel: 'High',
    turnAngle: 50, // High risk
    accessible: true,
    capacity: 40,
    currentPassengers: 38,
    lastUpdated: new Date().toISOString()
  },
  
  // Route 5 - RS Puram Loop (Coimbatore)
  {
    busId: 'BUS-501',
    route: 'route-5',
    routeName: 'RS Puram Loop',
    currentLocation: { lat: 11.0168, lng: 76.9558 },
    currentStop: 'Gandhipuram',
    nextStop: 'RS Puram',
    distanceToNextStop: 2.0,
    avgSpeed: 20,
    crowdLevel: 'Medium',
    turnAngle: 15,
    accessible: true,
    capacity: 45,
    currentPassengers: 25,
    lastUpdated: new Date().toISOString()
  },
  {
    busId: 'BUS-502',
    route: 'route-5',
    routeName: 'RS Puram Loop',
    currentLocation: { lat: 11.0120, lng: 76.9520 },
    currentStop: 'Race Course',
    nextStop: 'Gandhipuram',
    distanceToNextStop: 1.5,
    avgSpeed: 18,
    crowdLevel: 'Low',
    turnAngle: 10,
    accessible: true,
    capacity: 45,
    currentPassengers: 12,
    lastUpdated: new Date().toISOString()
  },
  
  // Route 6 - Peelamedu Tech Route (Coimbatore)
  {
    busId: 'BUS-601',
    route: 'route-6',
    routeName: 'Peelamedu Tech Route',
    currentLocation: { lat: 11.0250, lng: 77.0200 },
    currentStop: 'Singanallur',
    nextStop: 'Peelamedu',
    distanceToNextStop: 3.0,
    avgSpeed: 35,
    crowdLevel: 'High',
    turnAngle: 20,
    accessible: true,
    capacity: 50,
    currentPassengers: 45,
    lastUpdated: new Date().toISOString()
  },
  {
    busId: 'BUS-602',
    route: 'route-6',
    routeName: 'Peelamedu Tech Route',
    currentLocation: { lat: 11.0300, lng: 77.0350 },
    currentStop: 'TIDEL Park',
    nextStop: 'Avinashi Road',
    distanceToNextStop: 2.5,
    avgSpeed: 30,
    crowdLevel: 'Medium',
    turnAngle: 25,
    accessible: false,
    capacity: 50,
    currentPassengers: 30,
    lastUpdated: new Date().toISOString()
  },
  
  // Route 7 - Marina Beach Line (Chennai)
  {
    busId: 'BUS-701',
    route: 'route-7',
    routeName: 'Marina Beach Line',
    currentLocation: { lat: 13.0569, lng: 80.2425 },
    currentStop: 'Fort St George',
    nextStop: 'Marina Beach',
    distanceToNextStop: 1.8,
    avgSpeed: 15,
    crowdLevel: 'High',
    turnAngle: 8,
    accessible: true,
    capacity: 55,
    currentPassengers: 50,
    lastUpdated: new Date().toISOString()
  },
  {
    busId: 'BUS-702',
    route: 'route-7',
    routeName: 'Marina Beach Line',
    currentLocation: { lat: 13.0100, lng: 80.2700 },
    currentStop: 'Besant Nagar',
    nextStop: 'Thiruvanmiyur',
    distanceToNextStop: 2.2,
    avgSpeed: 22,
    crowdLevel: 'Low',
    turnAngle: 12,
    accessible: true,
    capacity: 55,
    currentPassengers: 18,
    lastUpdated: new Date().toISOString()
  },
  
  // Route 8 - T Nagar Shopping Express (Chennai)
  {
    busId: 'BUS-801',
    route: 'route-8',
    routeName: 'T Nagar Shopping Express',
    currentLocation: { lat: 13.0418, lng: 80.2341 },
    currentStop: 'T Nagar',
    nextStop: 'Pondy Bazaar',
    distanceToNextStop: 0.8,
    avgSpeed: 12,
    crowdLevel: 'High',
    turnAngle: 40,
    accessible: true,
    capacity: 50,
    currentPassengers: 48,
    lastUpdated: new Date().toISOString()
  },
  {
    busId: 'BUS-802',
    route: 'route-8',
    routeName: 'T Nagar Shopping Express',
    currentLocation: { lat: 13.0500, lng: 80.2200 },
    currentStop: 'Egmore',
    nextStop: 'Nungambakkam',
    distanceToNextStop: 2.5,
    avgSpeed: 20,
    crowdLevel: 'Medium',
    turnAngle: 18,
    accessible: true,
    capacity: 50,
    currentPassengers: 28,
    lastUpdated: new Date().toISOString()
  },
  
  // Route 9 - OMR IT Corridor (Chennai)
  {
    busId: 'BUS-901',
    route: 'route-9',
    routeName: 'OMR IT Corridor',
    currentLocation: { lat: 12.9600, lng: 80.2400 },
    currentStop: 'Tidel Park',
    nextStop: 'Perungudi',
    distanceToNextStop: 4.0,
    avgSpeed: 40,
    crowdLevel: 'Medium',
    turnAngle: 10,
    accessible: true,
    capacity: 60,
    currentPassengers: 35,
    lastUpdated: new Date().toISOString()
  },
  {
    busId: 'BUS-902',
    route: 'route-9',
    routeName: 'OMR IT Corridor',
    currentLocation: { lat: 12.9100, lng: 80.2300 },
    currentStop: 'Sholinganallur',
    nextStop: 'Siruseri',
    distanceToNextStop: 5.5,
    avgSpeed: 45,
    crowdLevel: 'Low',
    turnAngle: 8,
    accessible: true,
    capacity: 60,
    currentPassengers: 20,
    lastUpdated: new Date().toISOString()
  },
  
  // Route 10 - Erode Junction Link
  {
    busId: 'BUS-1001',
    route: 'route-10',
    routeName: 'Erode Junction Link',
    currentLocation: { lat: 11.3410, lng: 77.7172 },
    currentStop: 'Bus Stand',
    nextStop: 'Collectorate',
    distanceToNextStop: 1.2,
    avgSpeed: 15,
    crowdLevel: 'Medium',
    turnAngle: 22,
    accessible: true,
    capacity: 40,
    currentPassengers: 25,
    lastUpdated: new Date().toISOString()
  },
  
  // Route 11 - Bhavani Express
  {
    busId: 'BUS-1101',
    route: 'route-11',
    routeName: 'Bhavani Express',
    currentLocation: { lat: 11.3600, lng: 77.7500 },
    currentStop: 'Surampatti',
    nextStop: 'Bhavanisagar',
    distanceToNextStop: 8.0,
    avgSpeed: 50,
    crowdLevel: 'Low',
    turnAngle: 15,
    accessible: true,
    capacity: 55,
    currentPassengers: 22,
    lastUpdated: new Date().toISOString()
  },
  
  // Route 12 - MG Road Metro Feeder (Bangalore)
  {
    busId: 'BUS-1201',
    route: 'route-12',
    routeName: 'MG Road Metro Feeder',
    currentLocation: { lat: 12.9716, lng: 77.5946 },
    currentStop: 'Cubbon Park',
    nextStop: 'MG Road',
    distanceToNextStop: 1.5,
    avgSpeed: 18,
    crowdLevel: 'High',
    turnAngle: 12,
    accessible: true,
    capacity: 45,
    currentPassengers: 42,
    lastUpdated: new Date().toISOString()
  },
  {
    busId: 'BUS-1202',
    route: 'route-12',
    routeName: 'MG Road Metro Feeder',
    currentLocation: { lat: 12.9800, lng: 77.6400 },
    currentStop: 'Trinity Circle',
    nextStop: 'Indiranagar',
    distanceToNextStop: 2.0,
    avgSpeed: 22,
    crowdLevel: 'Medium',
    turnAngle: 18,
    accessible: true,
    capacity: 45,
    currentPassengers: 28,
    lastUpdated: new Date().toISOString()
  },
  
  // Route 13 - Electronic City Express (Bangalore)
  {
    busId: 'BUS-1301',
    route: 'route-13',
    routeName: 'Electronic City Express',
    currentLocation: { lat: 12.8400, lng: 77.6600 },
    currentStop: 'Electronic City Phase 1',
    nextStop: 'Infosys',
    distanceToNextStop: 2.5,
    avgSpeed: 30,
    crowdLevel: 'High',
    turnAngle: 15,
    accessible: true,
    capacity: 60,
    currentPassengers: 55,
    lastUpdated: new Date().toISOString()
  },
  {
    busId: 'BUS-1302',
    route: 'route-13',
    routeName: 'Electronic City Express',
    currentLocation: { lat: 12.9200, lng: 77.6200 },
    currentStop: 'Silk Board',
    nextStop: 'Bommanahalli',
    distanceToNextStop: 3.0,
    avgSpeed: 15,
    crowdLevel: 'High',
    turnAngle: 35,
    accessible: false,
    capacity: 60,
    currentPassengers: 58,
    lastUpdated: new Date().toISOString()
  },
  
  // Route 14 - Whitefield Tech Park (Bangalore)
  {
    busId: 'BUS-1401',
    route: 'route-14',
    routeName: 'Whitefield Tech Park',
    currentLocation: { lat: 12.9698, lng: 77.7500 },
    currentStop: 'ITPL',
    nextStop: 'Whitefield',
    distanceToNextStop: 2.8,
    avgSpeed: 25,
    crowdLevel: 'Medium',
    turnAngle: 20,
    accessible: true,
    capacity: 50,
    currentPassengers: 32,
    lastUpdated: new Date().toISOString()
  },
  
  // Route 15 - Airport Link BIAS (Bangalore)
  {
    busId: 'BUS-1501',
    route: 'route-15',
    routeName: 'Airport Link BIAS',
    currentLocation: { lat: 13.1986, lng: 77.7066 },
    currentStop: 'Devanahalli',
    nextStop: 'KIA Terminal',
    distanceToNextStop: 3.5,
    avgSpeed: 50,
    crowdLevel: 'Low',
    turnAngle: 8,
    accessible: true,
    capacity: 55,
    currentPassengers: 18,
    lastUpdated: new Date().toISOString()
  },
  {
    busId: 'BUS-1502',
    route: 'route-15',
    routeName: 'Airport Link BIAS',
    currentLocation: { lat: 13.0700, lng: 77.5900 },
    currentStop: 'Hebbal',
    nextStop: 'Yelahanka',
    distanceToNextStop: 6.0,
    avgSpeed: 45,
    crowdLevel: 'Medium',
    turnAngle: 12,
    accessible: true,
    capacity: 55,
    currentPassengers: 30,
    lastUpdated: new Date().toISOString()
  },
  
  // Route 16 - HITEC City Express (Hyderabad)
  {
    busId: 'BUS-1601',
    route: 'route-16',
    routeName: 'HITEC City Express',
    currentLocation: { lat: 17.4400, lng: 78.3800 },
    currentStop: 'Madhapur',
    nextStop: 'HITEC City',
    distanceToNextStop: 2.0,
    avgSpeed: 25,
    crowdLevel: 'High',
    turnAngle: 18,
    accessible: true,
    capacity: 55,
    currentPassengers: 50,
    lastUpdated: new Date().toISOString()
  },
  {
    busId: 'BUS-1602',
    route: 'route-16',
    routeName: 'HITEC City Express',
    currentLocation: { lat: 17.4300, lng: 78.4500 },
    currentStop: 'Begumpet',
    nextStop: 'Ameerpet',
    distanceToNextStop: 3.5,
    avgSpeed: 20,
    crowdLevel: 'Medium',
    turnAngle: 25,
    accessible: true,
    capacity: 55,
    currentPassengers: 35,
    lastUpdated: new Date().toISOString()
  },
  
  // Route 17 - Old City Heritage (Hyderabad)
  {
    busId: 'BUS-1701',
    route: 'route-17',
    routeName: 'Old City Heritage',
    currentLocation: { lat: 17.3616, lng: 78.4747 },
    currentStop: 'Charminar',
    nextStop: 'Mecca Masjid',
    distanceToNextStop: 0.5,
    avgSpeed: 10,
    crowdLevel: 'High',
    turnAngle: 30,
    accessible: true,
    capacity: 40,
    currentPassengers: 38,
    lastUpdated: new Date().toISOString()
  },
  
  // Route 18 - Gachibowli Loop (Hyderabad)
  {
    busId: 'BUS-1801',
    route: 'route-18',
    routeName: 'Gachibowli Loop',
    currentLocation: { lat: 17.4400, lng: 78.3500 },
    currentStop: 'Gachibowli',
    nextStop: 'Financial District',
    distanceToNextStop: 3.0,
    avgSpeed: 35,
    crowdLevel: 'Medium',
    turnAngle: 15,
    accessible: true,
    capacity: 50,
    currentPassengers: 28,
    lastUpdated: new Date().toISOString()
  },
  {
    busId: 'BUS-1802',
    route: 'route-18',
    routeName: 'Gachibowli Loop',
    currentLocation: { lat: 17.4200, lng: 78.4200 },
    currentStop: 'Banjara Hills',
    nextStop: 'Gachibowli',
    distanceToNextStop: 5.0,
    avgSpeed: 30,
    crowdLevel: 'Low',
    turnAngle: 12,
    accessible: true,
    capacity: 50,
    currentPassengers: 15,
    lastUpdated: new Date().toISOString()
  },
  
  // Route 19 - Marine Drive Express (Mumbai)
  {
    busId: 'BUS-1901',
    route: 'route-19',
    routeName: 'Marine Drive Express',
    currentLocation: { lat: 18.9440, lng: 72.8233 },
    currentStop: 'Marine Drive',
    nextStop: 'Girgaon',
    distanceToNextStop: 1.5,
    avgSpeed: 18,
    crowdLevel: 'High',
    turnAngle: 10,
    accessible: true,
    capacity: 50,
    currentPassengers: 48,
    lastUpdated: new Date().toISOString()
  },
  {
    busId: 'BUS-1902',
    route: 'route-19',
    routeName: 'Marine Drive Express',
    currentLocation: { lat: 18.9322, lng: 72.8264 },
    currentStop: 'Churchgate',
    nextStop: 'Marine Drive',
    distanceToNextStop: 1.0,
    avgSpeed: 15,
    crowdLevel: 'Medium',
    turnAngle: 8,
    accessible: true,
    capacity: 50,
    currentPassengers: 32,
    lastUpdated: new Date().toISOString()
  },
  
  // Route 20 - BKC Business Link (Mumbai)
  {
    busId: 'BUS-2001',
    route: 'route-20',
    routeName: 'BKC Business Link',
    currentLocation: { lat: 19.0650, lng: 72.8700 },
    currentStop: 'BKC',
    nextStop: 'Kalanagar',
    distanceToNextStop: 2.0,
    avgSpeed: 22,
    crowdLevel: 'High',
    turnAngle: 20,
    accessible: true,
    capacity: 55,
    currentPassengers: 52,
    lastUpdated: new Date().toISOString()
  },
  {
    busId: 'BUS-2002',
    route: 'route-20',
    routeName: 'BKC Business Link',
    currentLocation: { lat: 19.0700, lng: 72.8500 },
    currentStop: 'Bandra Station',
    nextStop: 'Linking Road',
    distanceToNextStop: 1.5,
    avgSpeed: 15,
    crowdLevel: 'Medium',
    turnAngle: 25,
    accessible: true,
    capacity: 55,
    currentPassengers: 30,
    lastUpdated: new Date().toISOString()
  },
  
  // Route 21 - Andheri Local (Mumbai)
  {
    busId: 'BUS-2101',
    route: 'route-21',
    routeName: 'Andheri Local',
    currentLocation: { lat: 19.1136, lng: 72.8697 },
    currentStop: 'MIDC',
    nextStop: 'SEEPZ',
    distanceToNextStop: 2.5,
    avgSpeed: 25,
    crowdLevel: 'Medium',
    turnAngle: 18,
    accessible: true,
    capacity: 45,
    currentPassengers: 28,
    lastUpdated: new Date().toISOString()
  },
  
  // Route 22 - Connaught Place Ring (Delhi)
  {
    busId: 'BUS-2201',
    route: 'route-22',
    routeName: 'Connaught Place Ring',
    currentLocation: { lat: 28.6315, lng: 77.2167 },
    currentStop: 'Connaught Place',
    nextStop: 'Janpath',
    distanceToNextStop: 0.8,
    avgSpeed: 12,
    crowdLevel: 'High',
    turnAngle: 15,
    accessible: true,
    capacity: 50,
    currentPassengers: 47,
    lastUpdated: new Date().toISOString()
  },
  {
    busId: 'BUS-2202',
    route: 'route-22',
    routeName: 'Connaught Place Ring',
    currentLocation: { lat: 28.6129, lng: 77.2295 },
    currentStop: 'India Gate',
    nextStop: 'Mandi House',
    distanceToNextStop: 1.5,
    avgSpeed: 18,
    crowdLevel: 'Medium',
    turnAngle: 12,
    accessible: true,
    capacity: 50,
    currentPassengers: 30,
    lastUpdated: new Date().toISOString()
  },
  
  // Route 23 - Gurugram Cyber Express (Delhi)
  {
    busId: 'BUS-2301',
    route: 'route-23',
    routeName: 'Gurugram Cyber Express',
    currentLocation: { lat: 28.4595, lng: 77.0266 },
    currentStop: 'Cyber Hub',
    nextStop: 'DLF Phase 1',
    distanceToNextStop: 2.0,
    avgSpeed: 25,
    crowdLevel: 'High',
    turnAngle: 10,
    accessible: true,
    capacity: 55,
    currentPassengers: 50,
    lastUpdated: new Date().toISOString()
  },
  {
    busId: 'BUS-2302',
    route: 'route-23',
    routeName: 'Gurugram Cyber Express',
    currentLocation: { lat: 28.4800, lng: 77.0900 },
    currentStop: 'MG Road',
    nextStop: 'IFFCO Chowk',
    distanceToNextStop: 3.5,
    avgSpeed: 30,
    crowdLevel: 'Medium',
    turnAngle: 18,
    accessible: true,
    capacity: 55,
    currentPassengers: 35,
    lastUpdated: new Date().toISOString()
  },
  
  // Route 24 - Old Delhi Heritage (Delhi)
  {
    busId: 'BUS-2401',
    route: 'route-24',
    routeName: 'Old Delhi Heritage',
    currentLocation: { lat: 28.6562, lng: 77.2410 },
    currentStop: 'Red Fort',
    nextStop: 'Jama Masjid',
    distanceToNextStop: 0.6,
    avgSpeed: 10,
    crowdLevel: 'High',
    turnAngle: 35,
    accessible: true,
    capacity: 40,
    currentPassengers: 38,
    lastUpdated: new Date().toISOString()
  },
  
  // Route 25 - Noida IT Park (Delhi)
  {
    busId: 'BUS-2501',
    route: 'route-25',
    routeName: 'Noida IT Park',
    currentLocation: { lat: 28.5700, lng: 77.3200 },
    currentStop: 'Sector 62',
    nextStop: 'Tech Park',
    distanceToNextStop: 4.0,
    avgSpeed: 40,
    crowdLevel: 'Medium',
    turnAngle: 12,
    accessible: true,
    capacity: 55,
    currentPassengers: 32,
    lastUpdated: new Date().toISOString()
  },
  {
    busId: 'BUS-2502',
    route: 'route-25',
    routeName: 'Noida IT Park',
    currentLocation: { lat: 28.5400, lng: 77.3900 },
    currentStop: 'Sector 125',
    nextStop: 'Greater Noida',
    distanceToNextStop: 8.0,
    avgSpeed: 50,
    crowdLevel: 'Low',
    turnAngle: 8,
    accessible: true,
    capacity: 55,
    currentPassengers: 20,
    lastUpdated: new Date().toISOString()
  }
];

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get all bus data (for voice assistant and other queries)
 */
export const getBusData = () => {
  return [...busData];
};

/**
 * Get all train data
 */
export const getTrainData = () => {
  return [...trainData];
};

/**
 * Get train by ID
 */
export const getTrainById = (trainId) => {
  return trainData.find(t => t.trainId === trainId);
};

/**
 * Get trains by route
 */
export const getTrainsByRoute = (routeId) => {
  return trainData.filter(t => t.route === routeId);
};

/**
 * Get train routes by city
 */
export const getTrainRoutesByCity = (city) => {
  return trainRoutes.filter(r => r.city === city);
};

/**
 * Simulate train movement
 */
export const simulateTrainMovement = () => {
  trainData = trainData.map(train => {
    const route = trainRoutes.find(r => r.id === train.route);
    if (!route) return train;

    // Random speed variation
    const speedVariation = (Math.random() - 0.5) * 10;
    const newSpeed = Math.max(20, Math.min(80, train.avgSpeed + speedVariation));

    // Simulate distance decrease
    let newDistance = train.distanceToNextStation - (newSpeed / 60 / 20);
    
    // If arrived at station, move to next
    if (newDistance <= 0) {
      const currentIdx = route.stations.indexOf(train.currentStation);
      const nextIdx = (currentIdx + 1) % route.stations.length;
      const afterNextIdx = (nextIdx + 1) % route.stations.length;
      
      return {
        ...train,
        currentStation: route.stations[nextIdx],
        nextStation: route.stations[afterNextIdx],
        distanceToNextStation: 1 + Math.random() * 3,
        avgSpeed: newSpeed,
        crowdLevel: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)],
        currentPassengers: Math.floor(train.capacity * (0.3 + Math.random() * 0.6)),
        lastUpdated: new Date().toISOString()
      };
    }

    return {
      ...train,
      distanceToNextStation: Math.max(0.1, newDistance),
      avgSpeed: newSpeed,
      lastUpdated: new Date().toISOString()
    };
  });
};

/**
 * Calculate predicted arrival time
 * Formula: arrival time = distance / speed (in hours, converted to minutes)
 */
export const calculateArrivalTime = (distanceKm, speedKmh) => {
  if (speedKmh <= 0) return 'N/A';
  const timeHours = distanceKm / speedKmh;
  const timeMinutes = Math.round(timeHours * 60);
  return timeMinutes;
};

/**
 * Format arrival time for display
 */
export const formatArrivalTime = (minutes) => {
  if (minutes === 'N/A') return 'N/A';
  if (minutes < 1) return 'Arriving now';
  if (minutes === 1) return '1 min';
  return `${minutes} mins`;
};

/**
 * Assess risk level based on crowd level and turn angle
 * Risk is HIGH when: crowdLevel === 'High' AND turnAngle > 30
 */
export const assessRisk = (crowdLevel, turnAngle) => {
  if (crowdLevel === 'High' && turnAngle > 30) {
    return {
      level: 'High',
      message: '⚠️ High Risk: Overcrowded bus on sharp turn',
      icon: '⚠️'
    };
  }
  if (crowdLevel === 'High' || turnAngle > 45) {
    return {
      level: 'Medium',
      message: '⚡ Caution: Monitor conditions',
      icon: '⚡'
    };
  }
  return {
    level: 'Low',
    message: '✅ Safe conditions',
    icon: '✅'
  };
};

/**
 * Get crowd level indicator with color and emoji
 */
export const getCrowdIndicator = (level) => {
  switch (level) {
    case 'Low':
      return { emoji: '🟢', color: '#22c55e', text: 'Low Crowd' };
    case 'Medium':
      return { emoji: '🟡', color: '#eab308', text: 'Medium Crowd' };
    case 'High':
      return { emoji: '🔴', color: '#ef4444', text: 'High Crowd' };
    default:
      return { emoji: '⚪', color: '#9ca3af', text: 'Unknown' };
  }
};

/**
 * Filter buses by accessibility
 */
export const filterAccessibleBuses = (buses, accessibilityOn) => {
  if (!accessibilityOn) return buses;
  return buses.filter(bus => bus.accessible === true);
};

/**
 * Filter buses by route
 */
export const filterBusesByRoute = (buses, routeId) => {
  if (!routeId) return buses;
  return buses.filter(bus => bus.route === routeId);
};

/**
 * Get all buses (with simulated updates)
 */
export const getAllBuses = () => {
  return [...busData];
};

/**
 * Get bus by ID
 */
export const getBusById = (busId) => {
  return busData.find(bus => bus.busId === busId);
};

/**
 * Get buses for a specific route
 */
export const getBusesForRoute = (routeId) => {
  return busData.filter(bus => bus.route === routeId);
};

/**
 * Simulate bus movement (updates position and other dynamic data)
 * This function is called periodically to simulate real-time updates
 */
export const simulateBusMovement = () => {
  busData = busData.map(bus => {
    // Simulate small position changes
    const latChange = (Math.random() - 0.5) * 0.001;
    const lngChange = (Math.random() - 0.5) * 0.001;
    
    // Simulate distance reduction (bus getting closer to next stop)
    let newDistance = bus.distanceToNextStop - (bus.avgSpeed / 360); // ~10 second interval
    if (newDistance < 0) newDistance = Math.random() * 5 + 1; // Reset to new distance
    
    // Occasionally change crowd level
    const crowdChange = Math.random();
    let newCrowdLevel = bus.crowdLevel;
    if (crowdChange < 0.1) {
      const levels = ['Low', 'Medium', 'High'];
      newCrowdLevel = levels[Math.floor(Math.random() * levels.length)];
    }
    
    // Update passenger count based on crowd level
    let passengers = bus.currentPassengers;
    if (newCrowdLevel !== bus.crowdLevel) {
      const crowdRatio = newCrowdLevel === 'Low' ? 0.3 : newCrowdLevel === 'Medium' ? 0.6 : 0.9;
      passengers = Math.round(bus.capacity * crowdRatio + (Math.random() - 0.5) * 10);
      passengers = Math.max(0, Math.min(bus.capacity, passengers));
    }
    
    // Simulate speed variations
    const speedVariation = (Math.random() - 0.5) * 5;
    const newSpeed = Math.max(10, Math.min(50, bus.avgSpeed + speedVariation));
    
    return {
      ...bus,
      currentLocation: {
        lat: bus.currentLocation.lat + latChange,
        lng: bus.currentLocation.lng + lngChange
      },
      distanceToNextStop: Math.round(newDistance * 10) / 10,
      avgSpeed: Math.round(newSpeed),
      crowdLevel: newCrowdLevel,
      currentPassengers: passengers,
      lastUpdated: new Date().toISOString()
    };
  });
  
  return busData;
};

// ============================================================================
// STATISTICS FOR DASHBOARD
// ============================================================================

/**
 * Get aggregated statistics for the dashboard
 */
export const getDashboardStats = () => {
  const buses = getAllBuses();
  
  // Crowd distribution
  const crowdDistribution = {
    Low: buses.filter(b => b.crowdLevel === 'Low').length,
    Medium: buses.filter(b => b.crowdLevel === 'Medium').length,
    High: buses.filter(b => b.crowdLevel === 'High').length
  };
  
  // Risk alerts count
  const riskAlerts = buses.filter(b => {
    const risk = assessRisk(b.crowdLevel, b.turnAngle);
    return risk.level === 'High';
  }).length;
  
  // Accessibility stats
  const accessibleBuses = buses.filter(b => b.accessible).length;
  
  // Utilization by route
  const utilizationByRoute = routes.map(route => {
    const routeBuses = buses.filter(b => b.route === route.id);
    const avgUtilization = routeBuses.length > 0
      ? Math.round(routeBuses.reduce((sum, b) => sum + (b.currentPassengers / b.capacity) * 100, 0) / routeBuses.length)
      : 0;
    return {
      name: route.name.split(' ')[0], // Short name
      utilization: avgUtilization,
      color: route.color
    };
  });
  
  // Hourly crowd trends (simulated)
  const hourlyTrends = [];
  for (let hour = 6; hour <= 22; hour++) {
    const peakHours = [8, 9, 17, 18];
    const isCrowded = peakHours.includes(hour);
    hourlyTrends.push({
      hour: `${hour}:00`,
      crowd: isCrowded ? 75 + Math.random() * 20 : 30 + Math.random() * 30
    });
  }
  
  return {
    totalBuses: buses.length,
    activeBuses: buses.length,
    crowdDistribution,
    riskAlerts,
    accessibleBuses,
    utilizationByRoute,
    hourlyTrends
  };
};

/**
 * Get recent alerts for the dashboard
 */
export const getRecentAlerts = () => {
  const buses = getAllBuses();
  const alerts = [];
  
  buses.forEach(bus => {
    const risk = assessRisk(bus.crowdLevel, bus.turnAngle);
    if (risk.level === 'High') {
      alerts.push({
        id: `alert-${bus.busId}`,
        busId: bus.busId,
        route: bus.routeName,
        message: risk.message,
        timestamp: new Date().toLocaleTimeString(),
        type: 'danger'
      });
    } else if (risk.level === 'Medium') {
      alerts.push({
        id: `alert-${bus.busId}`,
        busId: bus.busId,
        route: bus.routeName,
        message: risk.message,
        timestamp: new Date().toLocaleTimeString(),
        type: 'warning'
      });
    }
  });
  
  return alerts;
};

// ============================================================================
// VOICE GUIDANCE (Accessibility Feature)
// ============================================================================

/**
 * Generate voice guidance text for a bus
 */
export const generateVoiceGuidance = (bus) => {
  const arrivalMins = calculateArrivalTime(bus.distanceToNextStop, bus.avgSpeed);
  const crowdInfo = getCrowdIndicator(bus.crowdLevel);
  const risk = assessRisk(bus.crowdLevel, bus.turnAngle);
  
  let guidance = `Bus ${bus.busId} on ${bus.routeName}. `;
  guidance += `Currently at ${bus.currentStop}, heading to ${bus.nextStop}. `;
  guidance += `Estimated arrival in ${formatArrivalTime(arrivalMins)}. `;
  guidance += `Crowd level is ${bus.crowdLevel}. `;
  
  if (bus.accessible) {
    guidance += 'This bus is wheelchair accessible. ';
  }
  
  if (risk.level === 'High') {
    guidance += 'Warning: ' + risk.message;
  }
  
  return guidance;
};

/**
 * Speak text using Web Speech API
 */
export const speakText = (text) => {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
    return true;
  }
  return false;
};

// ============================================================================
// HAPTIC (VIBRATION) ALERTS
// ============================================================================

/**
 * Vibration patterns for different events
 * Pattern arrays: [vibrate, pause, vibrate, pause, ...] in milliseconds
 */
export const HAPTIC_PATTERNS = {
  busArrival: [200, 100, 200, 100, 400],    // Two short + one long pulse for bus arrival
  stopReached: [300, 100, 300],              // Two medium pulses for stop reached
  routeChange: [100, 50, 100, 50, 100],      // Three quick pulses for route change
  alert: [500, 200, 500],                     // Two long pulses for general alert
  success: [100, 100, 200],                   // Short-short-long for success
  warning: [400, 100, 400, 100, 400]         // Three long pulses for warning
};

/**
 * Trigger haptic vibration feedback
 * Uses the Vibration API (supported on most mobile browsers)
 * @param {string} eventType - Type of event: 'busArrival', 'stopReached', 'routeChange', 'alert', 'success', 'warning'
 * @returns {boolean} - Whether vibration was triggered successfully
 */
export const triggerHaptic = (eventType = 'alert') => {
  // Check if Vibration API is supported
  if ('vibrate' in navigator) {
    const pattern = HAPTIC_PATTERNS[eventType] || HAPTIC_PATTERNS.alert;
    try {
      navigator.vibrate(pattern);
      console.log(`Haptic feedback: ${eventType}`);
      return true;
    } catch (error) {
      console.warn('Vibration failed:', error);
      return false;
    }
  } else {
    console.log(`Haptic not supported. Event: ${eventType}`);
    return false;
  }
};

/**
 * Cancel any ongoing vibration
 */
export const cancelHaptic = () => {
  if ('vibrate' in navigator) {
    navigator.vibrate(0);
  }
};

// ============================================================================
// AI SMART BUS RECOMMENDATION
// ============================================================================

/**
 * Calculate a recommendation score for a bus.
 * Higher is better. Factors: crowd (lower is better), accessibility, risk (lower is better)
 * Score: 100 - crowdPenalty - riskPenalty + accessibilityBonus
 */
export const calculateRecommendationScore = (bus) => {
  let score = 100;
  // Crowd penalty
  if (bus.crowdLevel === 'High') score -= 40;
  else if (bus.crowdLevel === 'Medium') score -= 15;
  // Risk penalty
  const risk = assessRisk(bus.crowdLevel, bus.turnAngle);
  if (risk.level === 'High') score -= 30;
  else if (risk.level === 'Medium') score -= 10;
  // Accessibility bonus
  if (bus.accessible) score += 10;
  return Math.max(0, Math.min(100, score));
};

/**
 * Get the recommended bus from a list (highest score)
 */
export const getRecommendedBus = (buses) => {
  if (!buses || buses.length === 0) return null;
  let best = buses[0];
  let bestScore = calculateRecommendationScore(best);
  buses.forEach(bus => {
    const score = calculateRecommendationScore(bus);
    if (score > bestScore) {
      best = bus;
      bestScore = score;
    }
  });
  return best;
};

// ============================================================================
// FALL RISK DETECTION
// ============================================================================

/**
 * Detect fall risk: if crowd is High and turnAngle > 30
 * Returns alert message or null
 */
export const detectFallRisk = (bus) => {
  if (bus.crowdLevel === 'High' && bus.turnAngle > 30) {
    return {
      alert: true,
      message: '⚠️ Fall Risk: High crowd on sharp turn. Please hold on!'
    };
  }
  return { alert: false, message: null };
};

// ============================================================================
// PREDICTIVE OVERCROWDING
// ============================================================================

/**
 * Simulate predictive overcrowding forecast.
 * Returns a forecast message based on current crowd and time.
 */
export const predictOvercrowding = (bus) => {
  // Simulate: if Medium crowd and peak hours (8-10, 17-19), predict High
  const hour = new Date().getHours();
  const peakHours = [8, 9, 17, 18];
  if (bus.crowdLevel === 'Medium' && peakHours.includes(hour)) {
    return {
      forecast: true,
      message: '📈 Predicted: Crowd may increase to High in next 10 mins'
    };
  }
  if (bus.crowdLevel === 'Low' && peakHours.includes(hour)) {
    return {
      forecast: true,
      message: '📈 Predicted: Crowd may increase to Medium soon'
    };
  }
  return { forecast: false, message: null };
};

// ============================================================================
// SAFETY SCORE
// ============================================================================

/**
 * Compute a safety score (0-100%) for a bus.
 * Factors: crowd, risk, turn angle
 */
export const calculateSafetyScore = (bus) => {
  let score = 100;
  // Crowd penalty
  if (bus.crowdLevel === 'High') score -= 30;
  else if (bus.crowdLevel === 'Medium') score -= 10;
  // Turn angle penalty (sharp turns reduce safety)
  if (bus.turnAngle > 45) score -= 25;
  else if (bus.turnAngle > 30) score -= 15;
  else if (bus.turnAngle > 15) score -= 5;
  // Risk penalty
  const risk = assessRisk(bus.crowdLevel, bus.turnAngle);
  if (risk.level === 'High') score -= 20;
  else if (risk.level === 'Medium') score -= 10;
  return Math.max(0, Math.min(100, score));
};
