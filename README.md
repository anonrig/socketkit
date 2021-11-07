
# Socketkit

Socketkit is a all-in-one solution for mobile application developers and companies. It provides all the necessary solutions and tools for maintaining, increasing, and understanding the revenue flow of a mobile application. All services supported by Socketkit is built using gRPC and provides an easy to use interface which any of the programming language out there can easily interact with.

## Competitor Tracking

Store worker works like an exact replica of Sensortower. It stores an application's releases, versions, reviews as well as their changes in title, subtitle, description and pricing. It helps you to get more insight about your competitors changes within their product iteration.

**Competitors:**

- Sensortower
- AppAnnie

**Features:**

- Analyze an application's meta informations in AppStore.
- Track an application's reviews across different countries.

## AppStore Subscription Tracking

Subscription worker works similar to a combination of Revenuecat and ChartMogul, but it's primarily focused on iOS applications. It has a built-in integration with AppStore Connect and retrieves, analyzes daily payments made through AppStore Connect. 

**Competitors:**

- RevenueCat
- ChartMogul

**Features:**

- Has a built-in integration with AppStore Connect
- Stores data in a normalized way and transforms different currencies into the preference of the account it's linked into.
- Provides easy to use reports such as Monthly Recurring Revenue (MRR), Average Revenue Per User (ARPU), Daily Revenue etc.
	
## Real-time Notifications

Notification worker is a built-in microservice which supports stateless transactions through multiple providers including but not limited to email (through Sendgrid), Discord and Slack.

**Competitors:**

- Reviewbot

**Features**:

- Has a common syntax for specifying different messages with different formats across the microservices.
- Can send reviews to Discord and Slack.
- Does not have/store any state, nor cares about anything except sending the preferred notification.

## Processing Payment

Payment worker is a built-in microservice which supports usage based and monthly based fee for the previous implementation of Socketkit. It is kept in this repository for historical reasons.

## Account Management

Accounts worker is a built-in microservice which stores and handles everything related to an account and an organization. It aims to replace Ory Kratos used inside the core worker.
	
## Socketkit Gateway

Core worker is the only micro-service available to the internet. It works as a gateway between the HTTP requests and the designated microservice it's aimed to be received from. It does not store any logic related to ACL, since it's handled by Ory Kratos. 
