module.exports = {
  content: ['./src/**/*.{js,jsx}', './public/index.html'],
  theme: {
    extend: {
      colors: {
        mist: {
          50: '#f7fbff',
          100: '#eeff5ff',
          200: '#dbe9ff',
          300: '#c2d8ff',
          400: '#9fbfff',
          500: '#7aa3ff',
        },
        blush: {
          50: '#fff6f7',
          100: '#ffe9ee',
          200: '#ffd3dd',
          300: '#ffb6c7',
          400: '#ff91ad',
          500: '#f36c93',
        },
        cloud: {
           50: '#fbfbfe',
          100: '#f4f5fb',
          200: '#e7eaf6',
          300: '#d4daf0',
          400: '#bbc5e8',
          500: '#9faee0',
        },
      },
      boxShadow: {
        soft: '0 20px 60px -30px rgba(63, 94, 162, 0.35)',
      },
      borderRadius: {
        xl: '1.25rem',
        '2xl': '1.75rem',
        '3xl': '2rem',
      },
    },
  },
  plugins: [],
};
