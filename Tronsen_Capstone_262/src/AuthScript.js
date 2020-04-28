import $ from "jquery";

window.history.replaceState(
  {},
  null,
  window.location.href.match(/\/backend\/.*(?=\?)/)
);

const anchorListener = function (e) {
  e.preventDefault();
  window.history.replaceState(
    {},
    null,
    window.location.href + "?user=" + localStorage.getItem("user")
  );
  window.location.href =
    e.target.pathname + "?user=" + localStorage.getItem("user");
};
let anchors = document.querySelectorAll("a");
anchors.forEach((anchor) => {
  anchor.onclick = anchorListener;
});
