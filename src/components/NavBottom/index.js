import React from "react";

import "./navBottom.css";

function NavBottom(props) {

  return (
    <div>
      <nav className="nav">
        <div className="nav__link">
          <p>Cardápio</p>
        </div>
        <div className="nav__link">
          <p>Usuário</p>
        </div>
        <div className="nav__link">
          <p>Carrinho</p>
        </div>
        <div className="nav__link">
          <p>Informações</p>
        </div>
      </nav>
    </div>
  )
}

export default NavBottom;
