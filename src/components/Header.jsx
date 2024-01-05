export function Header() {
  return (
    <header className="header">
      <div className="left">
        <a href="/">
          {/* <img src="/assets/img/j-logo2.png" alt="" /> */}
          <strong>
            Jake
          </strong>
          <strong>
            Lee
            <span className="dot">.</span>
            {/* <span>Contact</span> */}
          </strong>
        </a>
      </div>
      <div className="menu-container">
        <a href="#" className="">Work</a>
        <a href="#" className="">Lab</a>
        <a href="#" className="contact">Contact</a>
      </div>
    </header>
  )
}