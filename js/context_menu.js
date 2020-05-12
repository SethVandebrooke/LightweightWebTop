function toggleMenu(command) {
  menu.style.display = command === "show" ? "block" : "none";
  menuVisible = !menuVisible;
};

function setMenuPosition({ top, left }) {
  menu.style.left = `${left}px`;
  menu.style.top = `${top}px`;
  toggleMenu("show");
};

function initContextMenu() {
  window.menu = document.querySelector(".menu");
  window.menuVisible = false;

  window.addEventListener("click", e => {
    if(menuVisible) {
      toggleMenu("hide");
    }
  });

  window.addEventListener("contextmenu", function(e) {
    e.preventDefault();
    setMenuPosition({
      left: e.pageX,
      top: e.pageY
    });
    return false;
  });
}