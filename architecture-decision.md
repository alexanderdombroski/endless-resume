# Architecture Decision Record (ADR)

Project Name: Endless Resume

Decision Title: SvelteKit + MongoDB Atlas + Netlify Lambdas \
Status: Accepted \
Date: 2026-06-16

Here is the [full technology list](https://github.com/alexanderdombroski/endless-resume/blob/main/CONTRIBUTING.md#full-technology-list).

## Frontend

1. **Context** Describe the problem and constraints that required a decision.

- The resume editor requires a dashboard, printing page, and other pages that require shared state for resume data and Auth.
- The user should be able to create, edit, and print resumes at minimum.

2. **Decision** State the architectural decision clearly.

We decided upon using Sveltekit in client-side rendering mode to take advantage of the spa's data persitance across pages and routing setup. Svelte will make state management easy without degrading performance.

3. **Rationale (Data-Based)** Cite specific metrics from your scorecard that justify this decision.

All three of our bakeoffs had small bundle sizes for Svelte compared to other component rendering frameworks like Vue and React.

4. **Consequences and Risks** Identify trade-offs, known risks, and how your team will mitigate them.

- AI struggles to create examples of Svelte 5 code. To mitigate this, we will be referencing the official documentation.
- Svelte has good developer tools, type checking, and linting, which can use to ensure AI code is up to good quality.

5. **Alternatives Considered** Briefly explain why the 2nd place stack was not selected.

- Svelte provides the best balance for our team in terms of both user and developer experience.
- Other frameworks may have been more performance or ease-of-use, but when it comes to both aspects Svelte was superior.

## Backend

1. **Context** Describe the problem and constraints that required a decision.

The resume editor requires a backend to fetch resume data, and to identify and validate users.

2. **Decision** State the architectural decision clearly.

We decided upon using Sveltekit to utilize its native API management. It's endpoints are easy to set up, deploy, and integrate with our svelte code.

3. **Rationale (Data-Based)** Cite specific metrics from your scorecard that justify this decision.

Serverless is much easier to deploy than a full on server. Free tiers like render have a very long initial boot up that we want to avoid. It is also fitting for a small, sparse userbase.

4. **Consequences and Risks** Identify trade-offs, known risks, and how your team will mitigate them.

- Netlify can be a pain to deploy to, but we already got that figured out.
- We'll have to make sure we don't overly mix frontend and backend code when it should be.

5. **Alternatives Considered** Briefly explain why the 2nd place stack was not selected.

- Netlify's serverless architecture supports the full node API.
- It isn't as fast as cloudflare's edge functions, but will have full capabilities to work with MongoDB and other backend packages.

## Database

1. **Context** Describe the problem and constraints that required a decision.

- Data must be stored in a fluid manner with a flexbile schema.
- Performance is essential, and anything we can do to improve said performance, be it in caching and proper distribution of data is desired.

2. **Decision** State the architectural decision clearly.

We also decided on MongoDB for our database solution due to NoSQL being better suited for the type of data we will be storing

3. **Rationale (Data-Based)** Cite specific metrics from your scorecard that justify this decision.

- NoSQL supports flexible schemas, allowing for the easy addition of custom fields into the database, each key-value pair being accessible for use on the frontend.
- MongoDB is very accessible and stable. MongoDB atlas is free and sports its own hosting, cutting down the amount of time needed for deployment.
- MongoDB allows for easy access to our data while also making it availabe to each of us. If we need another database for testing purposes, it is a simple matter to do so via MongoDB Atlas's dashboard.

4. **Consequences and Risks** Identify trade-offs, known risks, and how your team will mitigate them.

- With a flexible schema, we run the risk of having bloated documents which may result in performance loss. However, we believe that we are saving performance in that we will have less need to access multiple tables with a single query.
- There may be overhead because each lambda has to recreate connections to the database rather than use Mongo's TCP pooling system, but it shouldn't be as big of a problem if we make state availabe globally within our spa and only fetch when needed.

5. **Alternatives Considered** Briefly explain why the 2nd place stack was not selected.

- Postgres may have bettter serverless support, but a non-relational database will be more flexible for storing fluid resumes.
- We also considered using MongoDB in a docker container, however we decided against it as we do not want to require each developer to have their own copy of the data and schema being used in development.
