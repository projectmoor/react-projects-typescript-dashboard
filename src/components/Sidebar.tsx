import React from "react";
import { FaCar } from "react-icons/fa";

const Sidebar : React.FC = () => {
  const links = [
    {
      title: "Self Driving Car",
      icon: FaCar,
    }
  ];
  return (
    <div className="sidebar">
      <div className="brand">
        <h3>
          FREEDOM<span>ROBOTICS</span>
        </h3>
      </div>
      <ul className="links">
        {links.map((link, index) => {
          return (
            <li key={index}>
              <a href="#">
                {<link.icon />}
                {link.title}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default Sidebar;