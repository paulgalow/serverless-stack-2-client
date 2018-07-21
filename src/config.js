// Configuration file for our app that will reference all the resources we have created

// Dev stage configuration
const dev = {
  STRIPE_KEY: "pk_test_yRtsGQNXyGtXpHoptTSZNrsW",
  s3: {
    REGION: "eu-central-1",
    // Bucket to store our user's uploads
    BUCKET: "notes-app-2-api-dev-attachmentsbucket-cp65mmu43t22"
  },
  apiGateway: {
    REGION: "eu-central-1",
    URL: "https://c38rqc59j8.execute-api.eu-central-1.amazonaws.com/dev"
  },
  cognito: {
    REGION: "eu-central-1",
    USER_POOL_ID: "eu-central-1_BJrY7XJWq",
    APP_CLIENT_ID: "2sq47h30nt1okkff3m5j4kk20k",
    IDENTITY_POOL_ID: "eu-central-1:d2220d73-5046-473c-929b-f37411de9483"
  }
};

// Prod stage configuration
const prod = {
  STRIPE_KEY: "pk_test_yRtsGQNXyGtXpHoptTSZNrsW",
  s3: {
    REGION: "eu-central-1",
    // Bucket to store our user's uploads
    BUCKET: "notes-app-2-api-prod-attachmentsbucket-11zgowrvch986"
  },
  apiGateway: {
    REGION: "eu-central-1",
    URL: "https://wrisy9fo86.execute-api.eu-central-1.amazonaws.com/prod"
  },
  cognito: {
    REGION: "eu-central-1",
    USER_POOL_ID: "eu-central-1_VtNkM4sat",
    APP_CLIENT_ID: "1ih5lsfqkmcr05nk4nr7d2e07q",
    IDENTITY_POOL_ID: "eu-central-1:2af5a043-d54b-4c03-8cb0-b29040f6a156"
  }
};

// Default to 'dev' if not set
const config = process.env.REACT_APP_STAGE === 'prod'
  ? prod
  : dev;

// Add common config values here
export default {
  // Maximum size for user file attachments in byte
  MAX_ATTACHMENT_SIZE: 5000000,
  ...config
};