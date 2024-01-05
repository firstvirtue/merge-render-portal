export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="contact-wrap">
          <a href="tel:+82.10.5260.0729">
            <small>phone</small>
            <span>+82.10.5260.0729</span>
          </a>
          <a href="mailto:firstvirtue@gmail.com">
            <small>Pycsics</small>
            <span>firstvirtue@gmail.com</span>
          </a>
        </div>
        <div className="social-wrap">
          <a href="#"><img className="social-icon" src='/assets/icons/linkedin-svgrepo-com.svg' /></a>
          <a href="#"><img className="social-icon" src='/assets/icons/instagram-svgrepo-com.svg' /></a>
          <a href="#"><img className="social-icon" src='/assets/icons/github-svgrepo-com.svg' /></a>
        </div>
      </div>
    </footer>
  )
}