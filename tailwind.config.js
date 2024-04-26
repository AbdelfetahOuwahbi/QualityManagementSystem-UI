const flowbite = require("flowbite-react/tailwind");

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    flowbite.content(),
  ],
  theme: {
    extend: {
      fontFamily: {
        p_extra_light: ['ExtraLight'],
        p_light: ['Light'],
        p_regular: ['Regular'],
        p_medium: ['Medium'],
        p_black: ['Black'],
        p_thin: ['Thin'],
        p_bold: ['Bold'],
        p_semi_bold: ['SemiBold'],
        p_extra_bold: ['ExtraBold'],
      },
    },
  },
  plugins: [
    flowbite.plugin(),
  ],
};
