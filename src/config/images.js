const S3_BASE_URL = 'https://aisolution-website-images-yourname.s3.amazonaws.com';

export const imagePaths = {
  // Products
  products: {
    aiAnalytics: `${S3_BASE_URL}/products/ai-analytics-dashboard.jpg`,
    smartCRM: `${S3_BASE_URL}/products/smart-crm-interface.jpg`,
    cyberShield: `${S3_BASE_URL}/products/cybersecurity-monitor.jpg`,
    automateFlow: `${S3_BASE_URL}/products/automateflow-workflow.jpg`,
    visionAI: `${S3_BASE_URL}/products/vision-ai-computer.jpg`,
    chatGPTEnterprise: `${S3_BASE_URL}/products/chatgpt-enterprise.jpg`,
  },
  
  // Team
  team: {
    sarah: `${S3_BASE_URL}/team/sarah-chen-profile.jpg`,
    michael: `${S3_BASE_URL}/team/michael-rodriguez.jpg`,
    james: `${S3_BASE_URL}/team/james-wilson.jpg`,
    lisa: `${S3_BASE_URL}/team/lisa-thompson.jpg`,
  },
  
  // Events
  events: {
    aiSummit2024: `${S3_BASE_URL}/events/2024-ai-summit/banner.jpg`,
    techWorkshop: `${S3_BASE_URL}/events/2024-workshop/venue.jpg`,
  },
  
  // Articles
  articles: {
    futureAI: `${S3_BASE_URL}/articles/2024/future-of-ai-cover.jpg`,
    mlVsDl: `${S3_BASE_URL}/articles/2024/ml-vs-dl-infographic.jpg`,
  },
  
  // Company
  company: {
    logo: `${S3_BASE_URL}/company/logo.png`,
    heroBg: `${S3_BASE_URL}/misc/hero-background.jpg`,
  },
};

// Fallback images (if S3 image fails to load)
export const fallbackImages = {
  product: '📊',
  team: '👤',
  event: '📅',
  article: '📝',
};