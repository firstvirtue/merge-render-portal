import { createRoot } from 'react-dom/client'
import { useRoute, useLocation } from 'wouter'
import './fonts.css'
import './styles.css'
import { Logo } from '@pmndrs/branding'

// prototype with scroll
// import { App } from './App'

// [!] prototype layout, add models
import { App } from './App2'

// webgl scene
// import { App } from './SceneVehicles.tsx'


import { Header } from './components/Header'
import { Footer } from './components/Footer'

/*
Model JSX auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.2.3 model.glb --transform --simplify --resolution=2048
Author: Omar Faruq Tawsif (https://sketchfab.com/omarfaruqtawsif32)
License: CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)
*/

function Root() {
  const [, params] = useRoute('/item/:id')
  const [, setLocation] = useLocation()
  return (
    <>
    <Header />
    <App />
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
      <a href="https://pmnd.rs/" style={{ position: 'absolute', bottom: 40, left: 90, fontSize: '13px' }}>
        pmnd.rs
        <br />
        dev collective
      </a>
      <div style={{ position: 'absolute', bottom: 40, right: 40, fontSize: '13px' }}>15/06/2023</div>
      <Logo style={{ position: 'absolute', bottom: 40, left: 40, width: 30 }} />
      {/* <a style={{ position: 'absolute', top: 40, left: 40, fontSize: '13px' }} href="#" onClick={() => setLocation('/')}>
        {params ? '< back' : 'double click to enter portal'}
      </a> */}
    </div>{' '}
    
    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'flex-start', gap: '2rem', paddingLeft: '4rem', paddingRight: '4rem'}}>
      <img src='/assets/img/menu.png' width={'24%'} height={'auto'} />
      <img src='/assets/img/sc-no-menu.png' width={'70%'} />
    </div>

    <div className='spacer'></div>
    <Footer />
    </>
  )
}

createRoot(document.getElementById('root')).render(<Root />)
