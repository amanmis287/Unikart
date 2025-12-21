import "../styles/Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <p>
        © {new Date().getFullYear()} <strong>UniKart</strong>. All rights
        reserved.
      </p>
      <p className="footer-sub">
        Designed & Developed as a Campus Marketplace Project For ADYPU
      </p>
    </footer>
  );
};

export default Footer;
