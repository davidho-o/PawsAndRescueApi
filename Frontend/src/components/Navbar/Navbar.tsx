import { NavLink } from "react-router-dom";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const getNavClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? `${styles.navItem} ${styles.active}` : styles.navItem;

  return (
    <nav className={styles.navbar}>
      <div className={styles.brand}>🐾 Paws & Rescue</div>

      <ul className={styles.navMenu}>
        <li>
          <NavLink to="/dogs" className={getNavClass}>
            Dogs
          </NavLink>
        </li>
        <li>
          <NavLink to="/users" className={getNavClass}>
            Users
          </NavLink>
        </li>
        <li>
          <NavLink to="/shifts" className={getNavClass}>
            Shifts
          </NavLink>
        </li>
        <li>
          <NavLink to="/tasks" className={getNavClass}>
            Tasks
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}
