FROM oven/bun:1.1.17
WORKDIR /app

COPY . .

RUN bun install

# Install Node.js 22.x
# Needed for Prisma migration
RUN apt-get update && apt-get install -y curl software-properties-common
RUN curl -sL https://deb.nodesource.com/setup_22.x | bash -
RUN apt-get install -y nodejs

RUN bun run prisma:migrate 

RUN bun run build

CMD ["bun", "run", "start"]