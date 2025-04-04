# Next.js Weather App

A beautiful and modern weather application built with Next.js, TypeScript, Tailwind CSS, and Firebase authentication.

## Features

- **Real-time Weather Data**: Get current weather conditions based on your location
- **Search Functionality**: Search for weather information by city name
- **Weather Map**: Visual representation of weather patterns
- **City List View**: View weather data for major cities around the world
- **User Authentication**: Secure login and registration using Firebase
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Modern UI**: Beautiful interface using a custom color palette

## Technology Stack

- **Next.js 14**: React framework for building the user interface
- **TypeScript**: For type-safe code and better developer experience
- **Tailwind CSS**: For styling and responsive design
- **Firebase Authentication**: For user management
- **OpenWeatherMap API**: For weather data

## Color Palette

The application uses a custom color palette:
- Sand (#D1C6AD)
- Taupe (#BBADA0)
- Mauve (#A1869E)
- Lavender (#797596)
- Navy (#0B1D51)

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory with the following variables:
   ```
   NEXT_PUBLIC_WEATHER_API_KEY=your_openweathermap_api_key
   NEXT_PUBLIC_WEATHER_API_BASE=https://api.openweathermap.org/data/2.5/
   
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_firebase_measurement_id
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Build for Production

```bash
npm run build
```

Then start the production server:

```bash
npm start
```

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- OpenWeatherMap for providing the weather data API
- Firebase for authentication services
- Icons from various free icon libraries 