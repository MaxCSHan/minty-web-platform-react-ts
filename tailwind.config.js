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

      },
      backgroundImage: theme => ({
        'moctar-bg': "url('/src/assets/image/moctar.jpg')",
       }),
       transitionDelay: {
        '0': '0ms',
        '10': '10ms',
        '50': '50ms',
        '2000': '2000ms',
       }
    },
  },
  variants: {
    extend: {
      backgroundColor:['focus'],
      display:['first','hover'],
      textColor: ['active'],
      borderRadius:['last']


    },
  },
  plugins: [],
}
