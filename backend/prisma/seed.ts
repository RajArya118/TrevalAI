import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  if (process.env.NODE_ENV === 'production') {
    console.error('⛔ Refusing to run development seed script in a PRODUCTION environment!');
    process.exit(1);
  }

  console.log('🌱 Starting TravelAI database seed...');

  // 1. Clean existing seed data safely if needed
  await prisma.review.deleteMany();
  await prisma.savedDestination.deleteMany();
  await prisma.trip.deleteMany();
  await prisma.hotel.deleteMany();
  await prisma.destination.deleteMany();
  await prisma.user.deleteMany();

  console.log('🧹 Existing data wiped for clean seed.');

  // 2. Create Users
  const adminPassword = await bcrypt.hash('Admin@TravelAI2026', 10);
  const userPassword = await bcrypt.hash('User@TravelAI2026', 10);

  const adminUser = await prisma.user.create({
    data: {
      name: 'TravelAI Admin',
      email: 'admin@travelai.com',
      password: adminPassword,
      role: Role.ADMIN,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80',
    },
  });

  const regularUser = await prisma.user.create({
    data: {
      name: 'Chandrabhan Sharma',
      email: 'user@travelai.com',
      password: userPassword,
      role: Role.USER,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&q=80',
    },
  });

  console.log('👤 Created Admin and Demo User accounts.');

  // 3. Create Destinations
  const destinationsData = [
    {
      name: 'Goa Coastal Paradise',
      city: 'Goa',
      country: 'India',
      category: 'Beach',
      description:
        'Famous for its sun-kissed beaches, vibrant nightlife, Portuguese colonial architecture, and fresh seafood shacks. From peaceful South Goa coves to energetic North Goa beach clubs, Goa offers an unforgettable tropical escape.',
      imageUrl: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1200&q=80',
      rating: 4.8,
      estimatedBudget: 18000,
      bestTimeToVisit: 'November to February',
      attractions: ['Baga Beach', 'Fort Aguada', 'Dudhsagar Falls', 'Old Goa Cathedrals', 'Palolem Beach'],
      featured: true,
    },
    {
      name: 'Manali Alpine Wonderland',
      city: 'Manali',
      country: 'India',
      category: 'Mountain',
      description:
        'A high-altitude Himalayan resort town nestled in the Beas River valley. Surrounded by snow-dusted peaks, pine forests, hot springs, and adventure hubs like Solang Valley and Rohtang Pass.',
      imageUrl: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=1200&q=80',
      rating: 4.7,
      estimatedBudget: 22000,
      bestTimeToVisit: 'October to June',
      attractions: ['Solang Valley', 'Rohtang Pass', 'Hadimba Temple', 'Jogini Waterfall', 'Old Manali Cafes'],
      featured: true,
    },
    {
      name: 'Jaipur Royal Pink City',
      city: 'Jaipur',
      country: 'India',
      category: 'Heritage',
      description:
        'The historic capital of Rajasthan, famous for its terracotta-pink palace facades, colossal hilltop fortresses, royal observatories, vibrant bazaars, and mouthwatering Rajasthani cuisine.',
      imageUrl: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1200&q=80',
      rating: 4.9,
      estimatedBudget: 16000,
      bestTimeToVisit: 'October to March',
      attractions: ['Hawa Mahal', 'Amber Fort', 'City Palace', 'Jantar Mantar', 'Nahargarh Fort Sunset'],
      featured: true,
    },
    {
      name: 'Munnar Emerald Tea Hills',
      city: 'Munnar',
      country: 'India',
      category: 'Nature',
      description:
        'Sprawling emerald tea estates, mist-shrouded valleys, cascading waterfalls, and cool mountain breezes make Munnar one of South India\'s most romantic and peaceful hill stations.',
      imageUrl: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=1200&q=80',
      rating: 4.8,
      estimatedBudget: 20000,
      bestTimeToVisit: 'September to March',
      attractions: ['Eravikulam National Park', 'Mattupetty Dam', 'Tea Museum', 'Top Station Viewpoint', 'Attukad Falls'],
      featured: true,
    },
    {
      name: 'Rishikesh Yoga & River Rapids',
      city: 'Rishikesh',
      country: 'India',
      category: 'Adventure',
      description:
        'Known as the World Yoga Capital and India\'s adventure hub on the sacred Ganges river. Offering white-water rafting, bungee jumping, peaceful ashrams, and spiritual Ganga Aarti ceremonies.',
      imageUrl: 'https://images.unsplash.com/photo-1605649487212-47bdab064df8?w=1200&q=80',
      rating: 4.7,
      estimatedBudget: 14000,
      bestTimeToVisit: 'September to April',
      attractions: ['Triveni Ghat Aarti', 'Laxman Jhula', 'River Rafting', 'Beatles Ashram', 'Neelkanth Mahadev'],
      featured: true,
    },
    {
      name: 'Leh Ladakh Moonscapes',
      city: 'Leh',
      country: 'India',
      category: 'Adventure',
      description:
        'A mesmerizing high-altitude desert framed by rugged Himalayan peaks, cobalt blue glacial lakes like Pangong Tso, centuries-old Buddhist monasteries, and world-record high mountain motor passes.',
      imageUrl: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?w=1200&q=80',
      rating: 4.9,
      estimatedBudget: 35000,
      bestTimeToVisit: 'May to September',
      attractions: ['Pangong Lake', 'Nubra Valley', 'Khardung La Pass', 'Thiksey Monastery', 'Magnetic Hill'],
      featured: true,
    },
    {
      name: 'Bali Island of the Gods',
      city: 'Ubud & Kuta',
      country: 'Indonesia',
      category: 'Beach',
      description:
        'Tropical Indonesian paradise boasting terraced rice paddies, ancient sea temples, world-class surfing breaks, vibrant yoga retreats, and tranquil cliffside sunset lounges.',
      imageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200&q=80',
      rating: 4.9,
      estimatedBudget: 45000,
      bestTimeToVisit: 'April to October',
      attractions: ['Uluwatu Temple', 'Tegallalang Rice Terraces', 'Seminyak Beach', 'Mount Batur Sunrise', 'Sacred Monkey Forest'],
      featured: true,
    },
    {
      name: 'Dubai Futuristic Oasis',
      city: 'Dubai',
      country: 'United Arab Emirates',
      category: 'Urban',
      description:
        'A dazzling modern metropolis rising from golden desert dunes, known for futuristic architecture, record-breaking skyscrapers like Burj Khalifa, luxury mega-malls, and desert safaris.',
      imageUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&q=80',
      rating: 4.8,
      estimatedBudget: 55000,
      bestTimeToVisit: 'November to March',
      attractions: ['Burj Khalifa', 'The Dubai Mall & Fountain', 'Palm Jumeirah', 'Desert Safari Dunes', 'Museum of the Future'],
      featured: false,
    },
    {
      name: 'Kyoto Imperial Heritage',
      city: 'Kyoto',
      country: 'Japan',
      category: 'Culture',
      description:
        'The cultural soul of Japan with thousands of classical Buddhist temples, serene zen rock gardens, imperial palaces, geisha teahouses in Gion, and stunning seasonal cherry blossoms.',
      imageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1200&q=80',
      rating: 4.9,
      estimatedBudget: 60000,
      bestTimeToVisit: 'March to May & October to November',
      attractions: ['Fushimi Inari Shrine', 'Kinkaku-ji (Golden Pavilion)', 'Arashiyama Bamboo Grove', 'Gion District', 'Kiyomizu-dera'],
      featured: false,
    },
    {
      name: 'Interlaken Alpine Heights',
      city: 'Interlaken',
      country: 'Switzerland',
      category: 'Mountain',
      description:
        'Nestled between emerald Lake Thun and Lake Brienz, surrounded by the towering Swiss alpine trio: Eiger, Mönch, and Jungfrau. Europe\'s premier playground for skiing, skydiving, and scenic trains.',
      imageUrl: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=1200&q=80',
      rating: 4.9,
      estimatedBudget: 85000,
      bestTimeToVisit: 'June to September & December to March',
      attractions: ['Jungfraujoch - Top of Europe', 'Harder Kulm Viewpoint', 'Lake Brienz Cruise', 'Lauterbrunnen Valley', 'Grindelwald First'],
      featured: false,
    },
  ];

  const createdDestinations = [];
  for (const d of destinationsData) {
    const dest = await prisma.destination.create({ data: d });
    createdDestinations.push(dest);
  }

  console.log(`🗺️ Created ${createdDestinations.length} travel destinations.`);

  // 4. Create Hotels linked to destinations
  const hotelsData = [
    // Goa
    {
      destinationId: createdDestinations[0].id,
      name: 'The Leela Goa Luxury Beach Resort',
      pricePerNight: 12500,
      rating: 4.9,
      address: 'Mobor Beach, Cavelossim, South Goa',
      imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1000&q=80',
      amenities: ['Private Beach', 'Infinity Pool', 'Ayurvedic Spa', 'Golf Course', 'Free Breakfast', 'Fine Dining'],
      featured: true,
    },
    {
      destinationId: createdDestinations[0].id,
      name: 'W Goa Beach Retreat',
      pricePerNight: 9800,
      rating: 4.7,
      address: 'Vagator Beach, North Goa',
      imageUrl: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1000&q=80',
      amenities: ['Sea View Rooms', 'Outdoor Pool', 'Sunset Lounge', 'Gym', 'Cocktail Bar', 'Free WiFi'],
      featured: false,
    },
    // Manali
    {
      destinationId: createdDestinations[1].id,
      name: 'The Himalayan Luxury Castle & Resort',
      pricePerNight: 6500,
      rating: 4.8,
      address: 'Hadimba Road, Manali, Himachal Pradesh',
      imageUrl: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1000&q=80',
      amenities: ['Snow View Balcony', 'Heated Rooms', 'Mountain Spa', 'Fireplace Lounge', 'Free Breakfast', 'Free WiFi'],
      featured: true,
    },
    {
      destinationId: createdDestinations[1].id,
      name: 'Solang Valley Adventure Lodge',
      pricePerNight: 3800,
      rating: 4.5,
      address: 'VPO Palchan, Solang Valley, Manali',
      imageUrl: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1000&q=80',
      amenities: ['Ski Equipment Rental', 'Bonfire & BBQ', 'Trek Guide Desk', 'Restaurant', 'Free Parking'],
      featured: false,
    },
    // Jaipur
    {
      destinationId: createdDestinations[2].id,
      name: 'Rambagh Palace - Royal Heritage Heritage Hotel',
      pricePerNight: 28000,
      rating: 5.0,
      address: 'Bhawani Singh Road, Jaipur, Rajasthan',
      imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1000&q=80',
      amenities: ['Royal Suites', 'Peacock Gardens', 'Indoor & Outdoor Pools', 'Jiva Spa', 'Butler Service', 'Royal Dinners'],
      featured: true,
    },
    {
      destinationId: createdDestinations[2].id,
      name: 'Alsisar Haveli Heritage Hotel',
      pricePerNight: 5500,
      rating: 4.6,
      address: 'Sansar Chandra Road, Pink City, Jaipur',
      imageUrl: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1000&q=80',
      amenities: ['Swimming Pool', 'Traditional Architecture', 'Rooftop Restaurant', 'Free WiFi', 'Cultural Dance Shows'],
      featured: false,
    },
    // Munnar
    {
      destinationId: createdDestinations[3].id,
      name: 'Blanket Hotel & Luxury Tea Spa',
      pricePerNight: 7200,
      rating: 4.9,
      address: 'Attukad Waterfalls Road, Pallivasal, Munnar',
      imageUrl: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1000&q=80',
      amenities: ['Waterfall View', 'Tea Plantation Walks', 'Infinity Pool', 'Ayurvedic Wellness', 'Complimentary Breakfast'],
      featured: true,
    },
    // Rishikesh
    {
      destinationId: createdDestinations[4].id,
      name: 'Aloha On The Ganges Riverside Resort',
      pricePerNight: 6800,
      rating: 4.7,
      address: 'National Highway 58, Tapovan, Rishikesh',
      imageUrl: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=1000&q=80',
      amenities: ['Ganges River View', 'Infinity Pool', 'Daily Yoga Sessions', 'Organic Cafe', 'Adventure Travel Desk'],
      featured: true,
    },
    // Leh Ladakh
    {
      destinationId: createdDestinations[5].id,
      name: 'The Grand Dragon Ladakh',
      pricePerNight: 9500,
      rating: 4.8,
      address: 'Old Road, Sheynam, Leh, Ladakh',
      imageUrl: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1000&q=80',
      amenities: ['Oxygen-Enriched Rooms', 'Central Heating', 'Mountain View Cafe', 'Bakery', 'Ladakhi Folk Music'],
      featured: true,
    },
    // Bali
    {
      destinationId: createdDestinations[6].id,
      name: 'Padma Resort Ubud & Rainforest Spa',
      pricePerNight: 16000,
      rating: 4.9,
      address: 'Banjar Carik, Desa Puhu Payangan, Ubud, Bali',
      imageUrl: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=1000&q=80',
      amenities: ['Heated Infinity Pool', 'Valley Views', 'Yoga Shala', 'Bamboo Restaurant', 'Free Bike Tours'],
      featured: true,
    },
    // Dubai
    {
      destinationId: createdDestinations[7].id,
      name: 'Atlantis, The Palm Luxury Resort',
      pricePerNight: 32000,
      rating: 4.8,
      address: 'Crescent Road, The Palm Jumeirah, Dubai',
      imageUrl: 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?w=1000&q=80',
      amenities: ['Aquaventure Waterpark Access', 'Underwater Aquarium', 'Private Beach', 'Celebrity Chef Restaurants'],
      featured: false,
    },
    // Kyoto
    {
      destinationId: createdDestinations[8].id,
      name: 'Kyoto Traditional Ryokan & Onsen Garden',
      pricePerNight: 22000,
      rating: 4.9,
      address: 'Higashiyama Ward, Kyoto, Japan',
      imageUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=1000&q=80',
      amenities: ['Natural Hot Springs (Onsen)', 'Kaiseki Dinner Included', 'Tatami Rooms', 'Japanese Zen Garden'],
      featured: false,
    },
    // Interlaken
    {
      destinationId: createdDestinations[9].id,
      name: 'Victoria-Jungfrau Grand Hotel & Spa',
      pricePerNight: 42000,
      rating: 4.9,
      address: 'Höheweg 41, Interlaken, Switzerland',
      imageUrl: 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=1000&q=80',
      amenities: ['Jungfrau Mountain View', '5500 sqm Nescens Spa', 'Indoor Pool', 'Gourmet Dining', 'Ski Shuttle'],
      featured: false,
    },
  ];

  for (const h of hotelsData) {
    await prisma.hotel.create({ data: h });
  }

  console.log(`🏨 Created ${hotelsData.length} hotels.`);

  // 5. Create Sample Saved Destinations for Regular User
  await prisma.savedDestination.create({
    data: {
      userId: regularUser.id,
      destinationId: createdDestinations[0].id, // Goa
    },
  });
  await prisma.savedDestination.create({
    data: {
      userId: regularUser.id,
      destinationId: createdDestinations[1].id, // Manali
    },
  });

  // 6. Create Sample Trip for Regular User
  const sampleTripItinerary = {
    overview: 'A scenic 4-day relaxation and culture vacation across South Goa beaches and Portuguese heritage quarters.',
    days: [
      {
        day: 1,
        title: 'Arrival, Beachside Sunset & Fresh Seafood',
        theme: 'Coastal Arrival',
        morning: {
          activity: 'Check-in at Beach Resort & Unpack',
          description: 'Settle in at Cavelossim Beach, sip fresh coconut water, and take in the sea breeze.',
          estimatedCostInr: 1000,
          location: 'Mobor Beach',
        },
        afternoon: {
          activity: 'Poolside relaxation and South Goa village walk',
          description: 'Explore quiet lanes of Portuguese colonial villas and coconut groves.',
          estimatedCostInr: 500,
          location: 'Cavelossim Village',
        },
        evening: {
          activity: 'Candlelight dinner at Martin\'s Corner',
          description: 'Famous seafood feast with butter garlic crab and Goan fish curry.',
          estimatedCostInr: 2500,
          location: 'Betalbatim',
        },
        meals: {
          breakfast: 'Included at resort',
          lunch: 'Beach shack prawns rawa fry and local poee bread',
          dinner: 'Martin\'s Corner Goan Thali and Bebinca dessert',
          estimatedTotalCostInr: 2000,
        },
        dailyTotalCostInr: 6000,
      },
      {
        day: 2,
        title: 'Fontainhas Heritage Quarter & Mandovi River Cruise',
        theme: 'Heritage & Culture',
        morning: {
          activity: 'Walking tour of Fontainhas Latin Quarter',
          description: 'Admire pastel-colored villas, tiled street name plaques, and quaint bakeries.',
          estimatedCostInr: 800,
          location: 'Panaji',
        },
        afternoon: {
          activity: 'Visit Old Goa Bom Jesus Basilica',
          description: 'UNESCO World Heritage 16th-century baroque cathedral and museum.',
          estimatedCostInr: 400,
          location: 'Old Goa',
        },
        evening: {
          activity: 'Sunset catamaran cruise on Mandovi River',
          description: 'Scenic cruise with live Goan folk music and golden twilight views.',
          estimatedCostInr: 1500,
          location: 'Panaji Jetty',
        },
        meals: {
          breakfast: 'Traditional baker\'s fresh bread and espresso at Cafe Bodega',
          lunch: 'Viva Panjim authentic vindaloo and rice',
          dinner: 'Rooftop riverfront dinner at Black Sheep Bistro',
          estimatedTotalCostInr: 2200,
        },
        dailyTotalCostInr: 4900,
      },
    ],
    budgetBreakdown: {
      accommodationInr: 12000,
      activitiesInr: 4500,
      foodInr: 6000,
      localTransportInr: 3500,
      contingencyInr: 2000,
      grandTotalInr: 28000,
    },
    travelTips: [
      'Rent a scooter or self-drive car for effortless travel between North and South Goa.',
      'Carry sunscreen SPF 50 and stay hydrated in the mid-day heat.',
      'Respect heritage site dress codes in Old Goa cathedrals.',
    ],
  };

  await prisma.trip.create({
    data: {
      userId: regularUser.id,
      title: 'Romantic Tropical Escape to Goa',
      destination: 'Goa, India',
      startDate: new Date('2026-11-10'),
      endDate: new Date('2026-11-14'),
      travelers: 2,
      budget: 28000,
      tripStyle: 'relaxation',
      preferences: 'Beachfront, vegetarian-friendly options, heritage walks',
      itinerary: sampleTripItinerary,
      status: 'PLANNED',
      isAiGenerated: true,
    },
  });

  // 7. Create Sample Reviews
  await prisma.review.create({
    data: {
      userId: regularUser.id,
      destinationId: createdDestinations[0].id,
      rating: 5,
      comment: 'Goa never fails to amaze. Clean beaches in South Goa and fabulous seafood!',
    },
  });

  console.log('✅ Seed completed successfully!');
  console.log('\n==========================================');
  console.log('Demo Credentials for TravelAI:');
  console.log('👤 Admin:  admin@travelai.com  |  Password: Admin@TravelAI2026');
  console.log('👤 User:   user@travelai.com   |  Password: User@TravelAI2026');
  console.log('==========================================\n');
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
