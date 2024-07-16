
# Watery Light
POC OAuth flow for a simple comments site.

Built with nextjs, prisma and lucia!

Supported OAuths: discord, google (github coming soon)

## Run

Copy .env.local.example to .env.local, and fill in the secrets. then run

```
docker build -t watery-light:latest .
docker run -p 3000:3000 -d watery-light 
```


