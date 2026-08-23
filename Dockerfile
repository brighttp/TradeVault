# Gunakan base image Node.js (versi 20 LTS Alpine direkomendasikan karena ringan)
FROM node:20-alpine

# Set direktori kerja di dalam container
WORKDIR /app

# Mengaktifkan corepack (berguna jika Anda menggunakan yarn atau pnpm)
RUN corepack enable

# Expose port 3000 yang secara default digunakan oleh Next.js
EXPOSE 3000

# Perintah default untuk menjalankan aplikasi Next.js dalam mode development
# (Anda bisa menyesuaikan dengan 'yarn dev' atau 'pnpm dev' jika menggunakan package manager lain)
CMD ["npm", "run", "dev"]
