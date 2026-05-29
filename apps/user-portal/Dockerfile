# Requires local build first: npm run build
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY .next/standalone ./
COPY .next/static ./.next/static
COPY public ./public
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
CMD ["node", "server.js"]
