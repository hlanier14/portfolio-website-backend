FROM node:18-slim

# Create and change to the app directory.
WORKDIR /usr/src/app

# Copy application dependency manifests to the container image.
# A wildcard is used to ensure copying both package.json AND package-lock.json (when available).
# Copying this first prevents re-running npm install on every code change.
COPY package*.json ./

# Install production dependencies.
# If you add a package-lock.json, speed your build by switching to 'npm ci'.
# RUN npm ci --only=production
RUN npm install --only=production

# Copy local code to the container image.
COPY . ./

ENV PORT=8080
ENV FROM_EMAIL=projects/784309172112/secrets/contact-me-from-email/latest
ENV FROM_EMAIL_PASSWORD=projects/784309172112/secrets/contact-me-from-email-password/latest
ENV TO_EMAIL=projects/784309172112/secrets/contact-me-to-email/latest

# Run the web service on container startup.
CMD [ "node", "index.js" ]

# [END run_helloworld_dockerfile]
# [END cloudrun_helloworld_dockerfile]