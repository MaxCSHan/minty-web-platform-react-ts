const plugin = require('tailwindcss/plugin')

const scrollbarHide = plugin(function ({ addUtilities }) {
  addUtilities({
    '.scrollbar-hide': {
      /* Firefox */
      'scrollbar-width': 'none',

      /* Safari and Chrome */
      '&::-webkit-scrollbar': {
        display: 'none'
      }
    }
  })
})

module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    fontFamily: {
      'sans': ['Avenir','Helvetica', 'Arial', 'sans-serif','ui-sans-serif', 'system-ui'],
    },
    backgroundColor: theme => ({
      ...theme('colors'),
      'primary': '#de4546',
      'secondary': '#ffed4a',
      'danger': '#e3342f',
     }),
     textColor: theme => ({
      ...theme('colors'),
      'primary': '#de4546',
      'secondary': '#ffed4a',
      'danger': '#e3342f',
     }),
     maxHeight: {
      '0': '0',
      '140': '35rem',
      '160': '40rem',
      '180': '45rem',
      '200': '50rem',
      '240': '60rem',
      '280': '70rem',
      '320': '80rem',
    },
    extend: {
      spacing: {
        '88': '22rem',
        '96': '24rem',
        '120': '30rem',
        '140': '35rem',
        '160': '40rem',
        '200': '50rem',
      },
      height:{
       '11/12': '91.666667%',
       '95/100': '95%',
       '0/100': '0%',


      },
      backgroundImage: theme => ({
        'moctar-bg': "url('/src/assets/image/moctar.jpg')",
        'onboard': "url('/src/assets/image/onboarding.jpg')",

       }),
       transitionDelay: {
        '0': '0ms',
        '10': '10ms',
        '50': '50ms',
        '2000': '2000ms',
       },
       keyframes: {
        "wiggle": {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        }
      }
       ,
       animation:{
        "wiggle":"wiggle 0.2s ease-in-out infinite"
       },
       maxWidth: {
         'mini':"12.5rem",
         '3/4': '75%',
        },
        minWidth: {
          'mini': '4rem',
         }
    },
  },
  variants: {
    extend: {
      backgroundColor:['focus'],
      display:['first','last','hover',"group-hover"],
      textColor: ['active'],
      borderRadius:['last']


    },
  },
  plugins: [
    scrollbarHide
  ],
}
