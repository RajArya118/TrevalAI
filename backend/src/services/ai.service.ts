import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from '../config/index.js';
import { prisma } from '../config/prisma.js';
import { PlanTripAiInput } from '../validators/ai.validator.js';

export interface DayItinerary {
  day: number;
  title: string;
  theme: string;
  morning: {
    activity: string;
    description: string;
    estimatedCostInr: number;
    location: string;
  };
  afternoon: {
    activity: string;
    description: string;
    estimatedCostInr: number;
    location: string;
  };
  evening: {
    activity: string;
    description: string;
    estimatedCostInr: number;
    location: string;
  };
  meals: {
    breakfast: string;
    lunch: string;
    dinner: string;
    estimatedTotalCostInr: number;
  };
  dailyTotalCostInr: number;
}

export interface GeneratedItineraryResponse {
  isDemo: boolean;
  demoReason?: string;
  modelUsed?: string;
  disclaimer: string;
  tripSummary: {
    destination: string;
    durationDays: number;
    totalEstimatedBudgetInr: number;
    tripStyle: string;
    travelers: number;
    overview: string;
  };
  days: DayItinerary[];
  budgetBreakdown: {
    accommodationInr: number;
    activitiesInr: number;
    foodInr: number;
    localTransportInr: number;
    contingencyInr: number;
    grandTotalInr: number;
  };
  travelTips: string[];
  suggestedHotelsFromDb: Array<{
    id: string;
    name: string;
    pricePerNight: number;
    rating: number;
    address: string;
    imageUrl: string;
    amenities: string[];
  }>;
}

export class AiService {
  private static calculateDays(start: string, end: string): number {
    const s = new Date(start);
    const e = new Date(end);
    const diffTime = Math.abs(e.getTime() - s.getTime());
    const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return Math.min(Math.max(days || 3, 1), 14); // Clamp between 1 and 14 days
  }

  static async planTrip(input: PlanTripAiInput): Promise<GeneratedItineraryResponse> {
    const durationDays = this.calculateDays(input.startDate, input.endDate);

    // Fetch matching hotels from database to recommend real DB records
    const matchingHotels = await prisma.hotel.findMany({
      where: {
        OR: [
          { destination: { name: { contains: input.destination, mode: 'insensitive' } } },
          { destination: { city: { contains: input.destination, mode: 'insensitive' } } },
          { address: { contains: input.destination, mode: 'insensitive' } },
        ],
      },
      take: 4,
      orderBy: { rating: 'desc' },
      select: {
        id: true,
        name: true,
        pricePerNight: true,
        rating: true,
        address: true,
        imageUrl: true,
        amenities: true,
      },
    });

    // Check if live Gemini API is configured
    if (config.geminiApiKey && config.geminiApiKey.trim() !== '') {
      try {
        const genAI = new GoogleGenerativeAI(config.geminiApiKey);
        const model = genAI.getGenerativeModel({
          model: 'gemini-1.5-flash',
          generationConfig: {
            responseMimeType: 'application/json',
            temperature: 0.7,
          },
        });

        const prompt = `You are an expert travel planner. Create a detailed ${durationDays}-day travel itinerary for ${input.destination}.
Parameters:
- Travelers: ${input.travelers}
- Total Budget: INR ${input.budget}
- Trip Style: ${input.tripStyle}
- Preferences: ${input.preferences || 'None provided'}
- Dates: ${input.startDate} to ${input.endDate} (${durationDays} days)

Respond ONLY with valid JSON conforming strictly to this format:
{
  "overview": "engaging summary of the trip",
  "days": [
    {
      "day": 1,
      "title": "Day title",
      "theme": "Theme for the day",
      "morning": {
        "activity": "Activity name",
        "description": "Details",
        "estimatedCostInr": 500,
        "location": "Specific place"
      },
      "afternoon": {
        "activity": "Activity name",
        "description": "Details",
        "estimatedCostInr": 800,
        "location": "Specific place"
      },
      "evening": {
        "activity": "Activity name",
        "description": "Details",
        "estimatedCostInr": 1200,
        "location": "Specific place"
      },
      "meals": {
        "breakfast": "Recommendation",
        "lunch": "Recommendation",
        "dinner": "Recommendation",
        "estimatedTotalCostInr": 1000
      },
      "dailyTotalCostInr": 3500
    }
  ],
  "budgetBreakdown": {
    "accommodationInr": 15000,
    "activitiesInr": 8000,
    "foodInr": 7000,
    "localTransportInr": 4000,
    "contingencyInr": 2000,
    "grandTotalInr": 36000
  },
  "travelTips": [
    "Tip 1",
    "Tip 2",
    "Tip 3",
    "Tip 4"
  ]
}`;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        const parsed = JSON.parse(responseText);

        return {
          isDemo: false,
          modelUsed: 'gemini-1.5-flash',
          disclaimer:
            'AI-generated itinerary based on live Gemini models. All prices, operational timings, and suggestions are realistic estimates in INR and subject to local seasonal changes.',
          tripSummary: {
            destination: input.destination,
            durationDays,
            totalEstimatedBudgetInr: input.budget,
            tripStyle: input.tripStyle,
            travelers: input.travelers,
            overview: parsed.overview || `An unforgettable ${input.tripStyle} journey across ${input.destination}.`,
          },
          days: parsed.days || [],
          budgetBreakdown: parsed.budgetBreakdown || this.generateDefaultBudget(input.budget, durationDays),
          travelTips: parsed.travelTips || [
            'Carry valid government-issued ID for hotel check-ins and monument tickets.',
            'Keep small denominations of Indian Rupees (INR) for local street vendors and auto-rickshaws.',
            'Book popular tourist attractions and monuments ahead of time to skip long ticket queues.',
            'Stay hydrated and keep digital copies of travel documents accessible offline.',
          ],
          suggestedHotelsFromDb: matchingHotels,
        };
      } catch (err: any) {
        console.warn('Gemini live call failed or timed out. Falling back to high-fidelity demo generator:', err?.message);
        return this.generateSimulatedItinerary(
          input,
          durationDays,
          matchingHotels,
          `Live Gemini API request failed (${err?.message || 'timeout/rate-limit'}). Switched to Demo Mode.`
        );
      }
    }

    // Default to high-fidelity simulated demo mode with clear disclaimer
    return this.generateSimulatedItinerary(
      input,
      durationDays,
      matchingHotels,
      'Demo Mode: No Gemini API Key configured in backend .env. Operating in high-fidelity simulated planner mode.'
    );
  }

  private static generateDefaultBudget(totalBudget: number, days: number) {
    const accommodation = Math.round(totalBudget * 0.4);
    const food = Math.round(totalBudget * 0.25);
    const activities = Math.round(totalBudget * 0.18);
    const transport = Math.round(totalBudget * 0.12);
    const contingency = totalBudget - (accommodation + food + activities + transport);

    return {
      accommodationInr: accommodation,
      activitiesInr: activities,
      foodInr: food,
      localTransportInr: transport,
      contingencyInr: contingency > 0 ? contingency : 1000,
      grandTotalInr: totalBudget,
    };
  }

  private static generateSimulatedItinerary(
    input: PlanTripAiInput,
    durationDays: number,
    matchingHotels: any[],
    demoReason: string
  ): GeneratedItineraryResponse {
    const budgetBreakdown = this.generateDefaultBudget(input.budget, durationDays);
    const dailyBudget = Math.round(input.budget / durationDays);

    const styleTemplates: Record<string, { morning: string; afternoon: string; evening: string; tips: string[] }> = {
      adventure: {
        morning: 'Trek or outdoor adrenaline activities with panoramic vistas',
        afternoon: 'River rafting, off-roading, or nature exploration trail',
        evening: 'Campfire gathering and storytelling with local mountain guides',
        tips: [
          'Wear sturdy trekking shoes and carry an extra layer for changing weather.',
          'Always stay with certified guides for adventure excursions.',
          'Keep a compact first-aid kit and high-energy trail snacks.',
        ],
      },
      relaxation: {
        morning: 'Gentle sunrise yoga, serene beach walk, or slow cafe breakfast',
        afternoon: 'Traditional Ayurvedic spa therapy and tranquil resort lounging',
        evening: 'Sunset viewing at a scenic waterfront restaurant with live acoustic music',
        tips: [
          'Reserve spa sessions at least 24 hours in advance for prime slots.',
          'Disconnect from mobile notifications during afternoon relaxation sessions.',
          'Stay hydrated with fresh coconut water and local herbal teas.',
        ],
      },
      culture: {
        morning: 'Guided heritage walk across historic forts, temples, and palaces',
        afternoon: 'Local artisan workshops and cultural museum exploration',
        evening: 'Traditional folk performance, light-and-sound show, and authentic thali feast',
        tips: [
          'Dress modestly when visiting heritage temples and holy sites.',
          'Hire licensed local guides at monuments to appreciate authentic oral histories.',
          'Support local weavers and artisans directly at government-approved craft markets.',
        ],
      },
      family: {
        morning: 'Fun interactive sightseeing at nature parks and scenic viewpoints',
        afternoon: 'Boating, family-friendly heritage walks, and leisure shopping',
        evening: 'Vibrant local bazaar stroll and casual family dining',
        tips: [
          'Maintain a flexible pace with built-in afternoon rest times for kids and seniors.',
          'Carry safe bottled water and familiar snacks while exploring during the day.',
          'Opt for family suites or adjoining rooms when selecting hotels.',
        ],
      },
      food: {
        morning: 'Legendary heritage breakfast stalls and traditional tea tastings',
        afternoon: 'Signature culinary cooking masterclass and regional delicacy hunt',
        evening: 'Bustling night food street crawl and rooftop dinner with skyline views',
        tips: [
          'Seek out stalls with high turnover for the freshest street delicacies.',
          'Ask locals for regional specialties not highlighted on typical tourist menus.',
          'Carry digestive remedies or digestive fennel seeds after spicy dining tours.',
        ],
      },
    };

    const template = styleTemplates[input.tripStyle] || styleTemplates.culture;

    const days: DayItinerary[] = [];
    for (let i = 1; i <= durationDays; i++) {
      const dayThemes = [
        'Arrival, Orientation & Sunset Vibes',
        'Iconic Landmarks & Heritage Exploration',
        'Hidden Gems & Scenic Nature Discovery',
        'Immersive Local Flavors & Craft Markets',
        'Leisure, Panoramic Viewpoints & Souvenir Shopping',
        'Off-the-Beaten-Path Adventure',
        'Farewell Celebrations & Twilight Magic',
      ];
      const theme = dayThemes[(i - 1) % dayThemes.length];

      const morningCost = Math.round(dailyBudget * 0.15);
      const afternoonCost = Math.round(dailyBudget * 0.25);
      const eveningCost = Math.round(dailyBudget * 0.3);
      const mealCost = Math.round(dailyBudget * 0.3);

      days.push({
        day: i,
        title: `Day ${i}: ${theme}`,
        theme,
        morning: {
          activity: `Morning Sightseeing in ${input.destination}`,
          description: `${template.morning}. Enjoy the pleasant morning weather and avoid mid-day crowds.`,
          estimatedCostInr: morningCost,
          location: `${input.destination} Central District`,
        },
        afternoon: {
          activity: `Afternoon ${input.tripStyle.toUpperCase()} Experience`,
          description: `${template.afternoon}. Relax at a curated cafe and experience the authentic atmosphere.`,
          estimatedCostInr: afternoonCost,
          location: `${input.destination} Cultural Quarter`,
        },
        evening: {
          activity: `Evening Twilight & Dinner Experience`,
          description: `${template.evening}. Experience the vibrant nightlife, evening bazaars, or scenic sunset points.`,
          estimatedCostInr: eveningCost,
          location: `${input.destination} Promenade / Market`,
        },
        meals: {
          breakfast: 'Authentic regional breakfast (Poha, Idli-Sambar, or Parathas with fresh Chai)',
          lunch: 'Curated traditional thali with fresh regional produce and cooling drinks',
          dinner: 'Scenic fine-dining or celebrated local specialty restaurant',
          estimatedTotalCostInr: mealCost,
        },
        dailyTotalCostInr: morningCost + afternoonCost + eveningCost + mealCost,
      });
    }

    return {
      isDemo: true,
      demoReason,
      disclaimer:
        'DEMO MODE: This itinerary was generated using TravelAI\'s built-in intelligent heuristic engine. No actual Gemini API request was billed. All cost estimates are realistic INR approximations.',
      tripSummary: {
        destination: input.destination,
        durationDays,
        totalEstimatedBudgetInr: input.budget,
        tripStyle: input.tripStyle,
        travelers: input.travelers,
        overview: `A hand-crafted ${durationDays}-day ${input.tripStyle} journey designed for ${input.travelers} traveler(s) exploring the wonders of ${input.destination} with a budget of ₹${input.budget.toLocaleString('en-IN')}.`,
      },
      days,
      budgetBreakdown,
      travelTips: [
        ...template.tips,
        'Carry digital and printed IDs for check-ins across transit and accommodations.',
        'Use UPI or carry small INR notes for smooth transactions with local vendors.',
      ],
      suggestedHotelsFromDb: matchingHotels,
    };
  }
}
