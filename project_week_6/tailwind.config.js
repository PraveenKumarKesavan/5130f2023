/** @type {import('tailwindcss').Config} */
import FlowByte from "flowbite/plugin";
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [FlowByte],
};
