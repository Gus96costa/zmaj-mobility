/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./*.html", "./js/**/*.js"],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                serif: ['Newsreader', 'serif'],
                mono: ['Space Mono', 'monospace'],
            },
            colors: {
                brand: {
                    white: '#FFFFFF',
                    offwhite: '#F8F9FA',
                    charcoal: '#212121',
                    muted: '#858585',
                    lightgray: '#DEDFE0',
                    zip: '#365CD1',
                    aura: '#38BDF8',
                    purple: '#8D5AC9',
                    pink: '#F471CF',
                    dark: '#030303'
                }
            },
            animation: {
                'reveal-up': 'revealUp 1s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                'blob': 'blob 10s infinite',
                'float': 'float 6s ease-in-out infinite',
            },
            keyframes: {
                revealUp: { '0%': { opacity: '0', transform: 'translateY(60px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
                blob: { '0%, 100%': { transform: 'translate(0px, 0px) scale(1)' }, '33%': { transform: 'translate(30px, -50px) scale(1.1)' }, '66%': { transform: 'translate(-20px, 20px) scale(0.9)' } },
                float: { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-15px)' } }
            }
        }
    }
}
