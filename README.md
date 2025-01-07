# News_Aggregator

A modern, responsive news application built with vanilla JavaScript that aggregates news from various sources using the NewsAPI.

![2](https://github.com/user-attachments/assets/8c8aacc5-ce56-41ac-81b4-9715601ff0c7)
![3](https://github.com/user-attachments/assets/36f4d25b-2e9f-41cd-816e-989cf9993a77)


## Features

- Real-time news updates
- Category filtering (Technology, Business, Health, Science)
- Search functionality
- Responsive design
- Infinite scroll with "Load More"
- Clean, modern UI

## Demo

View the live demo: [NewsFlow Demo](your-github-pages-url)

## Setup

1. Clone the repository:
```bash
git clone https://github.com/BinaryBhakti/News_Aggregator
```

2. Create a `.env` file in the root directory:
```bash
NEWS_API_KEY=your_api_key_here
```

3. Install dependencies:
```bash
npm install
```

4. Start the development server:
```bash
npm start
```

## Environment Variables

Create a `.env` file with the following:

```env
NEWS_API_KEY=your_api_key_here
```

## API Limitations

- NewsAPI free tier only allows requests from localhost
- For production deployment, a paid subscription is required

## Local Development

1. Get an API key from [NewsAPI](https://newsapi.org/)
2. Add your API key to `.env`
3. Open `index.html` in your browser or use a local server

## Deployment

For deploying to production:

1. Set up a backend proxy server
2. Update the API endpoint in `config.js`
3. Deploy using GitHub Pages, Netlify, or similar platforms

## Tech Stack

- JavaScript
- HTML5
- CSS3
- NewsAPI
- Font Awesome icons

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Push to the branch
5. Open a pull request

## License

This project is licensed under the MIT License - see [LICENSE](LICENSE) file for details.
