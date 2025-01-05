// Config and Constants
const CONFIG = {
    API_KEY: "b1ec3168137949f7921e3268a4cf9206",
    BASE_URL: "https://newsapi.org/v2",
    ENDPOINTS: {
        everything: "/everything",
        topHeadlines: "/top-headlines"
    },
    CATEGORIES: {
        technology: "Technology",
        business: "Business",
        health: "Health",
        science: "Science"
    },
    CACHE_DURATION: 5 * 60 * 1000, // 5 minutes
    PAGE_SIZE: 12
};

// News API Service
class NewsService {
    constructor() {
        this.cache = new Map();
    }

    async fetchNews(params) {
        const cacheKey = JSON.stringify(params);
        if (this.cache.has(cacheKey)) {
            const { data, timestamp } = this.cache.get(cacheKey);
            if (Date.now() - timestamp < CONFIG.CACHE_DURATION) {
                return data;
            }
        }

        try {
            const queryParams = new URLSearchParams({
                apiKey: CONFIG.API_KEY,
                pageSize: CONFIG.PAGE_SIZE,
                ...params
            });

            const endpoint = params.category ? 
                CONFIG.BASE_URL + CONFIG.ENDPOINTS.topHeadlines :
                CONFIG.BASE_URL + CONFIG.ENDPOINTS.everything;

            const response = await fetch(`${endpoint}?${queryParams}`);
            if (!response.ok) {
                throw new Error(`Failed to fetch news: ${response.statusText}`);
            }

            const data = await response.json();
            this.cache.set(cacheKey, {
                data,
                timestamp: Date.now()
            });

            return data;
        } catch (error) {
            console.error('Error fetching news:', error);
            throw error;
        }
    }
}

// News App
class NewsApp {
    constructor() {
        this.newsService = new NewsService();
        this.state = {
            currentQuery: '',
            currentPage: 1,
            isLoading: false,
            articles: []
        };

        this.initializeElements();
        this.initializeEventListeners();
        this.loadDefaultNews();
    }

    initializeElements() {
        this.elements = {
            searchInput: document.querySelector('.news-input'),
            searchButton: document.querySelector('.search-button'),
            cardsContainer: document.querySelector('.cards-container'),
            loadingSpinner: document.querySelector('.loading-spinner'),
            errorMessage: document.querySelector('.error-message'),
            loadMoreButton: document.querySelector('.load-more'),
            navItems: document.querySelectorAll('.nav-item'),
            cardTemplate: document.getElementById('news-card-template')
        };
    }

    initializeEventListeners() {
        // Search functionality
        this.elements.searchButton.addEventListener('click', () => {
            this.handleSearch();
        });

        this.elements.searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleSearch();
            }
        });

        // Category navigation
        this.elements.navItems.forEach(item => {
            item.addEventListener('click', () => {
                this.handleCategoryClick(item.dataset.category);
            });
        });

        // Load more
        this.elements.loadMoreButton.addEventListener('click', () => {
            this.loadMoreNews();
        });
    }

    async handleSearch() {
        const searchQuery = this.elements.searchInput.value.trim();
        if (!searchQuery) return;

        this.state.currentQuery = searchQuery;
        this.state.currentPage = 1;
        this.state.articles = [];
        
        // Remove active state from category buttons
        this.elements.navItems.forEach(item => {
            item.classList.remove('active');
        });

        await this.fetchAndDisplayNews({
            q: searchQuery,
            page: this.state.currentPage
        });
    }

    async handleCategoryClick(category) {
        this.state.currentQuery = '';
        this.state.currentPage = 1;
        this.state.articles = [];
        this.elements.searchInput.value = '';

        // Update active state
        this.elements.navItems.forEach(item => {
            item.classList.toggle('active', item.dataset.category === category);
        });

        await this.fetchAndDisplayNews({
            category: category,
            page: this.state.currentPage
        });
    }

    async loadDefaultNews() {
        await this.fetchAndDisplayNews({
            category: 'technology',
            page: this.state.currentPage
        });
        
        // Set technology as active by default
        document.querySelector('[data-category="technology"]').classList.add('active');
    }

    async loadMoreNews() {
        this.state.currentPage++;
        const params = this.state.currentQuery ? 
            { q: this.state.currentQuery, page: this.state.currentPage } :
            { category: document.querySelector('.nav-item.active')?.dataset.category, page: this.state.currentPage };
        
        await this.fetchAndDisplayNews(params, true);
    }

    async fetchAndDisplayNews(params, append = false) {
        try {
            this.toggleLoading(true);
            this.hideError();

            const data = await this.newsService.fetchNews(params);
            
            if (!append) {
                this.elements.cardsContainer.innerHTML = '';
            }

            if (data.articles.length === 0) {
                this.showError('No news found for your search.');
                return;
            }

            this.state.articles = append ? 
                [...this.state.articles, ...data.articles] : 
                data.articles;

            this.displayNews(data.articles);
            this.updateLoadMoreButton(data.totalResults > this.state.articles.length);

        } catch (error) {
            this.showError(error.message);
        } finally {
            this.toggleLoading(false);
        }
    }

    displayNews(articles) {
        articles.forEach(article => {
            if (!article.urlToImage) return;

            const card = this.elements.cardTemplate.content.cloneNode(true);
            
            // Set card content
            card.querySelector('img').src = article.urlToImage;
            card.querySelector('.news-title').textContent = article.title;
            card.querySelector('.news-desc').textContent = article.description || 'No description available';
            
            const date = new Date(article.publishedAt).toLocaleDateString();
            card.querySelector('.source-name').textContent = article.source.name;
            card.querySelector('.publish-date').textContent = date;

            // Add click event
            const cardElement = card.querySelector('.card');
            cardElement.addEventListener('click', () => {
                window.open(article.url, '_blank');
            });

            this.elements.cardsContainer.appendChild(card);
        });
    }

    toggleLoading(show) {
        this.state.isLoading = show;
        this.elements.loadingSpinner.classList.toggle('hidden', !show);
    }

    showError(message) {
        this.elements.errorMessage.querySelector('p').textContent = message;
        this.elements.errorMessage.classList.remove('hidden');
    }

    hideError() {
        this.elements.errorMessage.classList.add('hidden');
    }

    updateLoadMoreButton(show) {
        this.elements.loadMoreButton.classList.toggle('hidden', !show);
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new NewsApp();
});