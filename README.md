# ✈️ WanderIQ – AI Travel Assistant

WanderIQ is an intelligent travel planning application that leverages AI to generate detailed, personalized travel itineraries, fetch real-time flight suggestions, and visualize destinations.

---

## ✨ Key Features

### **AI-Powered Itineraries**
Generates detailed day-by-day plans based on destination, budget, travelers, and interests using structured JSON schemas.

### **Conversational Customization**
Modify existing itineraries using natural language.
> Example: “Change day 2 to be more relaxed.”

### **Real-Time Flight Search**
Integrates with **FlightAPI.io** to provide real-time flight options and pricing.

### **Dynamic Visuals**
Automatically fetches beautiful destination images using the **Unsplash API**.

### **Schema Validation**
Uses **Ajv** to strictly validate AI outputs — preventing UI crashes due to malformed data.

### **Smart Recommendations**
Recommends new destinations based on saved trip history.

### **Local Persistence**
Trips are automatically saved using browser `localStorage`.

---

## 🛠️ Tech Stack

- **Framework:** Next.js 13+ (App Router)  
- **AI Model:** OpenAI gpt-4o-mini  
- **Styling:** Styled Components & CSS Variables  
- **Animations:** Framer Motion  
- **Validation:** Ajv JSON Schema Validator  

### **APIs Used**
- OpenAI API (Itinerary Generation)  
- Unsplash API (Image Fetching)  
- FlightAPI.io (Flight Data)

---

## 🌐 Live Deployment

WanderIQ is deployed and accessible at:

👉 **https://wanderiq-pbl.vercel.app**

---

## 📜 License

MIT License — free to use and adapt.
