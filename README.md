# SkySettle - Flight Delay Compensation Assistant

SkySettle is a modern web application that helps air travelers check their eligibility for compensation after experiencing flight delays or cancellations. The application analyzes flight information against relevant air passenger rights regulations to provide clear guidance on compensation claims.

## Features

- **Flight Compensation Eligibility Check**: Enter your flight number and date to get an instant assessment of your compensation eligibility.
- **Flight History Analysis**: View the performance history of your flight over the past 7 days, including on-time, delayed, and cancellation statistics.
- **Delay/Cancellation Analysis**: Get detailed information about the reasons behind flight delays or cancellations to support your compensation claim.
- **Real-time Data Processing**: See results as they're generated through a streaming response system.
- **Clean, Modern UI**: Intuitive interface built with React and Tailwind CSS for a seamless user experience.

## Technology Stack

- **Frontend**: React with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **Build Tool**: Vite
- **Backend Communication**: Fetch API with streaming response handling

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn package manager
- A backend API service running on http://localhost:8000 : [Github Repo Link](https://github.com/deepanshgandhi/SkySettle)

### Installation

1. Clone this repository:
   ```sh
   git clone https://github.com/yourusername/skysettle.git
   cd skysettle
   ```

2. Install dependencies:
   ```sh
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```sh
   npm run dev
   # or
   yarn dev
   ```

4. The application will be available at http://localhost:8080

### Backend Requirements

The application expects the following API endpoints to be available on your backend:

- `http://localhost:8000/compensation` - For flight compensation eligibility checks
- `http://localhost:8000/flight-stats` - For flight history statistics
- `http://localhost:8000/cancellation-reason` - For delay/cancellation reason analysis

Each endpoint should support streaming responses for real-time data processing.

## How to Use SkySettle

1. **Start a Flight Check**:
   - Enter a valid flight number (e.g., BA1234) in the Flight Number field
   - Select the date of your flight using the date picker
   - Click the "Check Flight" button

2. **Review Compensation Eligibility**:
   - The application will display your compensation eligibility status
   - You'll receive information about applicable regulations and potential compensation amounts

3. **View Flight History**:
   - After receiving your compensation check results, click "Show past 7 days flight history"
   - Review statistics about on-time performance, delays, and cancellations for your flight

4. **Analyze Delay/Cancellation Reasons**:
   - Click "Check delay/cancel reason" to get detailed information about the factors behind your flight disruption
   - This information can be valuable when filing a compensation claim

5. **Start a New Check**:
   - Click "Check another flight" at any time to begin a new search

## Development and Contribution

### Project Structure

- `src/components` - React components
- `src/hooks` - Custom React hooks
- `src/pages` - Page-level components
- `src/lib` - Utility functions

### Running Tests

```sh
npm test
# or
yarn test
```

### Building for Production

```sh
npm run build
# or
yarn build
```

The built files will be in the `dist` directory.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with [shadcn/ui](https://ui.shadcn.com/) components
- Icon set from [Lucide Icons](https://lucide.dev/)
